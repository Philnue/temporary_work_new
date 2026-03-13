import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core'
import { createdAt, updatedAt, uuidPrimaryKey } from '@/drizzle/mixins'
import { user } from './auth-schema'

export const facilityTypeEnum = pgEnum('facility_type', [
  'kindergarten',
  'school',
  'daycare',
  'other',
])

export const facilities = pgTable(
  'facilities',
  {
    id: uuidPrimaryKey('id'),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    type: facilityTypeEnum('type').notNull(),
    address: text('address').notNull(),
    city: text('city').notNull(),
    postalCode: text('postal_code').notNull(),
    phone: text('phone'),
    email: text('email'),
    contactPerson: text('contact_person'),
    description: text('description'),
    logoUrl: text('logo_url'),
    requirements: jsonb('requirements'),
    notes: text('notes'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index('org_facilities_user_id_idx').on(table.userId),
    index('org_facilities_city_type_idx').on(table.city, table.type),
  ],
)
