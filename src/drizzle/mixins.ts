import { sql } from 'drizzle-orm'
import { timestamp, uuid } from 'drizzle-orm/pg-core'

export const uuidPrimaryKey = (name = 'id') =>
  uuid(name).primaryKey().notNull().default(sql`uuidv7()`)

export const createdAt = (name = 'created_at') =>
  timestamp(name, { withTimezone: true }).defaultNow().notNull()

export const updatedAt = (name = 'updated_at') =>
  timestamp(name, { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
