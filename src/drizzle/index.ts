import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as authSchema from './schemas/auth-schema'
import * as commsSchema from './schemas/comms-schema'
import * as complianceSchema from './schemas/compliance-schema'
import * as identitySchema from './schemas/identity-schema'
import * as opsSchema from './schemas/ops-schema'
import * as orgSchema from './schemas/org-schema'
import * as staffingSchema from './schemas/staffing-schema'
import * as timeSchema from './schemas/time-schema'

export const schema = {
  ...authSchema,
  ...identitySchema,
  ...orgSchema,
  ...staffingSchema,
  ...timeSchema,
  ...commsSchema,
  ...complianceSchema,
  ...opsSchema,
}

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
})
