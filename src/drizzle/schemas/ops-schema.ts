import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  integer,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt } from '@/drizzle/mixins'
import { user } from './auth-schema'

export const systemRuntime = pgTable(
  'system_runtime',
  {
    id: integer('id').primaryKey().default(1),
    maintenanceEnabled: boolean('maintenance_enabled').notNull().default(false),
    maintenanceMessage: text('maintenance_message'),
    updatedBy: uuid('updated_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    check('ops_system_runtime_single_row_chk', sql`${table.id} = 1`),
  ],
)
