import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  uuid,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '@/drizzle/mixins'
import { user } from './auth-schema'

export const identity = pgSchema('identity')

export const accountStatusEnum = identity.enum('account_status', [
  'pending',
  'active',
  'suspended',
])

export const onboardingStageEnum = identity.enum('onboarding_stage', [
  'pending',
  'documents_review',
  'interview',
  'approved',
  'rejected',
])

export const userProfile = identity.table(
  'user_profile',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    displayName: text('display_name').notNull(),
    accountStatus: accountStatusEnum('account_status')
      .notNull()
      .default('pending'),
    onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
    onboardingStage: onboardingStageEnum('onboarding_stage').default('pending'),
    phone: text('phone'),
    address: text('address'),
    city: text('city'),
    postalCode: text('postal_code'),
    qualifications: jsonb('qualifications'),
    hourlyRate: integer('hourly_rate'),
    avatarUrl: text('avatar_url'),
    radiusKm: integer('radius_km'),
    isAvailable: boolean('is_available').notNull().default(false),
    preferences: jsonb('preferences'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index('identity_user_profile_account_status_idx').on(table.accountStatus)],
)

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}))
