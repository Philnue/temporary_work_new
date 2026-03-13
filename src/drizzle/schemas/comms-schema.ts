import {
  boolean,
  index,
  jsonb,
  pgSchema,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt, uuidPrimaryKey } from '@/drizzle/mixins'
import { user } from './auth-schema'

export const comms = pgSchema('comms')

export const notificationTypeEnum = comms.enum('notification_type', [
  'shift',
  'leave',
  'document',
  'assignment',
  'system',
  'general',
])

export const deviceTokens = comms.table(
  'device_tokens',
  {
    id: uuidPrimaryKey('id'),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    token: text('token').notNull(),
    platform: text('platform').notNull(),
    deviceName: text('device_name'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex('comms_device_tokens_token_unique').on(table.token),
    index('comms_device_tokens_user_id_idx').on(table.userId),
  ],
)

export const notifications = comms.table(
  'notifications',
  {
    id: uuidPrimaryKey('id'),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    type: notificationTypeEnum('type').notNull().default('general'),
    title: text('title').notNull(),
    message: text('message').notNull(),
    read: boolean('read').notNull().default(false),
    data: jsonb('data'),
    createdAt: createdAt(),
  },
  (table) => [
    index('comms_notifications_user_read_idx').on(table.userId, table.read),
    index('comms_notifications_user_created_idx').on(table.userId, table.createdAt),
  ],
)
