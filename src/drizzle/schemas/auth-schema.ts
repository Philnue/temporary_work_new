import { relations } from 'drizzle-orm'
import { boolean, index, pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createdAt, updatedAt, uuidPrimaryKey } from '@/drizzle/mixins'

export const auth = pgSchema('auth')

export const user = auth.table('user', {
  id: uuidPrimaryKey('id'),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role').notNull().default('user'),
  banned: boolean('banned').default(false).notNull(),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires', { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const session = auth.table(
  'session',
  {
    id: uuidPrimaryKey('id'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: uuid('impersonated_by').references(() => user.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [index('auth_session_user_id_idx').on(table.userId)],
)

export const account = auth.table(
  'account',
  {
    id: uuidPrimaryKey('id'),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
      withTimezone: true,
    }),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index('auth_account_user_id_idx').on(table.userId)],
)

export const verification = auth.table(
  'verification',
  {
    id: uuidPrimaryKey('id'),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index('auth_verification_identifier_idx').on(table.identifier)],
)

export const refreshTokens = auth.table(
  'refresh_tokens',
  {
    id: uuidPrimaryKey('id'),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    tokenHash: text('token_hash').notNull().unique(),
    deviceInfo: text('device_info'),
    platform: text('platform').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [index('auth_refresh_tokens_user_id_idx').on(table.userId)],
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  refreshTokens: many(refreshTokens),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
  user: one(user, {
    fields: [refreshTokens.userId],
    references: [user.id],
  }),
}))
