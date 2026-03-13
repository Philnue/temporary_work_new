import type {
  account,
  refreshTokens,
  session,
  user,
  verification,
} from '@/drizzle/schemas/auth-schema'
import type { deviceTokens, notifications } from '@/drizzle/schemas/comms-schema'
import type {
  auditLogs,
  documents,
  ratings,
} from '@/drizzle/schemas/compliance-schema'
import type { userProfile } from '@/drizzle/schemas/identity-schema'
import type { systemRuntime } from '@/drizzle/schemas/ops-schema'
import type { facilities } from '@/drizzle/schemas/org-schema'
import type {
  availability,
  dateAvailability,
  demandApplications,
  demands,
  leaveRequests,
  shiftApplications,
  shiftAssignments,
  shifts,
} from '@/drizzle/schemas/staffing-schema'
import type { timesheets } from '@/drizzle/schemas/time-schema'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type AuthUser = InferSelectModel<typeof user>
export type NewAuthUser = InferInsertModel<typeof user>

export type AuthSession = InferSelectModel<typeof session>
export type NewAuthSession = InferInsertModel<typeof session>

export type AuthAccount = InferSelectModel<typeof account>
export type NewAuthAccount = InferInsertModel<typeof account>

export type AuthVerification = InferSelectModel<typeof verification>
export type NewAuthVerification = InferInsertModel<typeof verification>

export type AuthRefreshToken = InferSelectModel<typeof refreshTokens>
export type NewAuthRefreshToken = InferInsertModel<typeof refreshTokens>

export type UserProfile = InferSelectModel<typeof userProfile>
export type NewUserProfile = InferInsertModel<typeof userProfile>

export type Facility = InferSelectModel<typeof facilities>
export type NewFacility = InferInsertModel<typeof facilities>

export type Shift = InferSelectModel<typeof shifts>
export type NewShift = InferInsertModel<typeof shifts>

export type Availability = InferSelectModel<typeof availability>
export type NewAvailability = InferInsertModel<typeof availability>

export type LeaveRequest = InferSelectModel<typeof leaveRequests>
export type NewLeaveRequest = InferInsertModel<typeof leaveRequests>

export type ShiftApplication = InferSelectModel<typeof shiftApplications>
export type NewShiftApplication = InferInsertModel<typeof shiftApplications>

export type ShiftAssignment = InferSelectModel<typeof shiftAssignments>
export type NewShiftAssignment = InferInsertModel<typeof shiftAssignments>

export type Demand = InferSelectModel<typeof demands>
export type NewDemand = InferInsertModel<typeof demands>

export type DemandApplication = InferSelectModel<typeof demandApplications>
export type NewDemandApplication = InferInsertModel<typeof demandApplications>

export type DateAvailability = InferSelectModel<typeof dateAvailability>
export type NewDateAvailability = InferInsertModel<typeof dateAvailability>

export type Timesheet = InferSelectModel<typeof timesheets>
export type NewTimesheet = InferInsertModel<typeof timesheets>

export type DeviceToken = InferSelectModel<typeof deviceTokens>
export type NewDeviceToken = InferInsertModel<typeof deviceTokens>

export type Notification = InferSelectModel<typeof notifications>
export type NewNotification = InferInsertModel<typeof notifications>

export type Document = InferSelectModel<typeof documents>
export type NewDocument = InferInsertModel<typeof documents>

export type Rating = InferSelectModel<typeof ratings>
export type NewRating = InferInsertModel<typeof ratings>

export type AuditLog = InferSelectModel<typeof auditLogs>
export type NewAuditLog = InferInsertModel<typeof auditLogs>

export type SystemRuntime = InferSelectModel<typeof systemRuntime>
export type NewSystemRuntime = InferInsertModel<typeof systemRuntime>

export type UserId = AuthUser['id']
