import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt, uuidPrimaryKey } from '@/drizzle/mixins'
import { user } from './auth-schema'
import { shiftAssignments, shifts } from './staffing-schema'

export const timesheetStatusEnum = pgEnum('timesheet_status', [
  'pending',
  'approved',
  'disputed',
  'paid',
])

export const timesheets = pgTable(
  'timesheets',
  {
    id: uuidPrimaryKey('id'),
    shiftId: uuid('shift_id')
      .references(() => shifts.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    assignmentId: uuid('assignment_id').references(() => shiftAssignments.id, {
      onDelete: 'set null',
    }),
    weekStart: date('week_start'),
    clockIn: timestamp('clock_in', { withTimezone: true }),
    clockOut: timestamp('clock_out', { withTimezone: true }),
    breakMinutes: integer('break_minutes').default(0),
    totalMinutes: integer('total_minutes'),
    status: timesheetStatusEnum('status').notNull().default('pending'),
    unsignedPdfKey: text('unsigned_pdf_key'),
    signedPdfKey: text('signed_pdf_key'),
    notes: text('notes'),
    approvedBy: uuid('approved_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index('timekeeping_timesheets_shift_id_idx').on(table.shiftId),
    index('timekeeping_timesheets_user_week_status_idx').on(
      table.userId,
      table.weekStart,
      table.status,
    ),
  ],
)
