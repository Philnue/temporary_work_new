import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgSchema,
  real,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt, uuidPrimaryKey } from '@/drizzle/mixins'
import { user } from './auth-schema'
import { facilities } from './org-schema'

export const staffing = pgSchema('staffing')

export const shiftStatusEnum = staffing.enum('shift_status', [
  'open',
  'assigned',
  'completed',
  'cancelled',
])

export const leaveStatusEnum = staffing.enum('leave_status', [
  'pending',
  'approved',
  'rejected',
])

export const leaveTypeEnum = staffing.enum('leave_type', [
  'vacation',
  'sick',
  'personal',
  'other',
])

export const dayOfWeekEnum = staffing.enum('day_of_week', [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

export const applicationStatusEnum = staffing.enum('application_status', [
  'pending',
  'accepted',
  'rejected',
])

export const assignmentStatusEnum = staffing.enum('assignment_status', [
  'pending',
  'accepted',
  'rejected',
])

export const demandStatusEnum = staffing.enum('demand_status', [
  'open',
  'assigned',
  'cancelled',
  'completed',
])

export const shifts = staffing.table(
  'shifts',
  {
    id: uuidPrimaryKey('id'),
    facilityId: uuid('facility_id')
      .references(() => facilities.id, { onDelete: 'cascade' })
      .notNull(),
    assignedUserId: uuid('assigned_user_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    date: date('date').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    status: shiftStatusEnum('status').notNull().default('open'),
    requiredQualifications: jsonb('required_qualifications'),
    notes: text('notes'),
    hourlyRate: integer('hourly_rate'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    check(
      'staffing_shifts_time_order_chk',
      sql`${table.endTime} > ${table.startTime}`,
    ),
    index('staffing_shifts_facility_date_status_idx').on(
      table.facilityId,
      table.date,
      table.status,
    ),
    index('staffing_shifts_assigned_user_id_idx').on(table.assignedUserId),
  ],
)

export const availability = staffing.table(
  'availability',
  {
    id: uuidPrimaryKey('id'),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    dayOfWeek: dayOfWeekEnum('day_of_week').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    isAvailable: boolean('is_available').notNull().default(true),
    createdAt: createdAt(),
  },
  (table) => [
    check(
      'staffing_availability_time_order_chk',
      sql`${table.endTime} > ${table.startTime}`,
    ),
    uniqueIndex('staffing_availability_user_day_unique').on(
      table.userId,
      table.dayOfWeek,
      table.startTime,
      table.endTime,
    ),
  ],
)

export const leaveRequests = staffing.table(
  'leave_requests',
  {
    id: uuidPrimaryKey('id'),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    type: leaveTypeEnum('type').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    reason: text('reason'),
    status: leaveStatusEnum('status').notNull().default('pending'),
    reviewedBy: uuid('reviewed_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    reviewNotes: text('review_notes'),
    createdAt: createdAt(),
  },
  (table) => [
    check(
      'staffing_leave_requests_date_order_chk',
      sql`${table.endDate} >= ${table.startDate}`,
    ),
    index('staffing_leave_requests_user_status_idx').on(table.userId, table.status),
  ],
)

export const shiftApplications = staffing.table(
  'shift_applications',
  {
    id: uuidPrimaryKey('id'),
    shiftId: uuid('shift_id')
      .references(() => shifts.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    status: applicationStatusEnum('status').notNull().default('pending'),
    notes: text('notes'),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex('staffing_shift_applications_shift_user_unique').on(
      table.shiftId,
      table.userId,
    ),
    index('staffing_shift_applications_status_idx').on(table.status),
  ],
)

export const shiftAssignments = staffing.table(
  'shift_assignments',
  {
    id: uuidPrimaryKey('id'),
    shiftId: uuid('shift_id')
      .references(() => shifts.id, { onDelete: 'cascade' })
      .notNull(),
    assignedUserId: uuid('assigned_user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    assignedBy: uuid('assigned_by')
      .references(() => user.id, { onDelete: 'set null' })
      .notNull(),
    status: assignmentStatusEnum('status').notNull().default('pending'),
    rejectionReason: text('rejection_reason'),
    createdAt: createdAt(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('staffing_shift_assignments_shift_user_unique').on(
      table.shiftId,
      table.assignedUserId,
    ),
    index('staffing_shift_assignments_status_idx').on(table.status),
  ],
)

export const demands = staffing.table(
  'demands',
  {
    id: uuidPrimaryKey('id'),
    facilityId: uuid('facility_id')
      .references(() => facilities.id, { onDelete: 'cascade' })
      .notNull(),
    title: text('title').notNull(),
    description: text('description'),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    hoursPerDay: real('hours_per_day'),
    startTime: time('start_time'),
    endTime: time('end_time'),
    qualificationsRequired: jsonb('qualifications_required'),
    additionalRequirements: jsonb('additional_requirements'),
    status: demandStatusEnum('status').notNull().default('open'),
    assignedEducatorId: uuid('assigned_educator_id').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdBy: uuid('created_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    check(
      'staffing_demands_date_order_chk',
      sql`${table.endDate} >= ${table.startDate}`,
    ),
    index('staffing_demands_facility_status_idx').on(table.facilityId, table.status),
  ],
)

export const demandApplications = staffing.table(
  'demand_applications',
  {
    id: uuidPrimaryKey('id'),
    demandId: uuid('demand_id')
      .references(() => demands.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    status: applicationStatusEnum('status').notNull().default('pending'),
    notes: text('notes'),
    createdAt: createdAt(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('staffing_demand_applications_demand_user_unique').on(
      table.demandId,
      table.userId,
    ),
    index('staffing_demand_applications_status_idx').on(table.status),
  ],
)

export const dateAvailability = staffing.table(
  'date_availability',
  {
    id: uuidPrimaryKey('id'),
    userId: uuid('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    date: date('date').notNull(),
    timeFrom: time('time_from').notNull(),
    timeTo: time('time_to').notNull(),
    isAvailable: boolean('is_available').notNull().default(true),
    notes: text('notes'),
    createdAt: createdAt(),
  },
  (table) => [
    check(
      'staffing_date_availability_time_order_chk',
      sql`${table.timeTo} > ${table.timeFrom}`,
    ),
    uniqueIndex('staffing_date_availability_user_date_time_unique').on(
      table.userId,
      table.date,
      table.timeFrom,
      table.timeTo,
    ),
  ],
)
