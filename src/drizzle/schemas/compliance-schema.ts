import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt, uuidPrimaryKey } from '@/drizzle/mixins'
import { user } from './auth-schema'
import { shiftAssignments } from './staffing-schema'

export const compliance = pgSchema('compliance')

export const ratingTypeEnum = compliance.enum('rating_type', [
  'educator_rates_facility',
  'facility_rates_educator',
])

export const documents = compliance.table(
  'documents',
  {
    id: uuidPrimaryKey('id'),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    fileName: text('file_name').notNull(),
    fileUrl: text('file_url').notNull(),
    s3Key: text('s3_key'),
    s3Bucket: text('s3_bucket'),
    fileSize: integer('file_size'),
    mimeType: text('mime_type'),
    expiresAt: date('expires_at'),
    isVerified: boolean('is_verified').notNull().default(false),
    verifiedBy: uuid('verified_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index('compliance_documents_user_verified_idx').on(
      table.userId,
      table.isVerified,
    ),
    index('compliance_documents_expires_at_idx').on(table.expiresAt),
  ],
)

export const ratings = compliance.table(
  'ratings',
  {
    id: uuidPrimaryKey('id'),
    assignmentId: uuid('assignment_id')
      .references(() => shiftAssignments.id, { onDelete: 'cascade' })
      .notNull(),
    fromUserId: uuid('from_user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    toUserId: uuid('to_user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    type: ratingTypeEnum('type').notNull(),
    scores: jsonb('scores').notNull(),
    comment: text('comment'),
    createdAt: createdAt(),
  },
  (table) => [
    index('compliance_ratings_assignment_id_idx').on(table.assignmentId),
    index('compliance_ratings_to_user_id_idx').on(table.toUserId),
  ],
)

export const auditLogs = compliance.table(
  'audit_logs',
  {
    id: uuidPrimaryKey('id'),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id'),
    oldValue: jsonb('old_value'),
    newValue: jsonb('new_value'),
    metadata: jsonb('metadata'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: createdAt(),
  },
  (table) => [
    index('compliance_audit_logs_user_created_idx').on(table.userId, table.createdAt),
    index('compliance_audit_logs_entity_idx').on(table.entityType, table.entityId),
  ],
)
