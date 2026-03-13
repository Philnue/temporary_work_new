import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/drizzle/schemas/auth-schema.ts',
    './src/drizzle/schemas/identity-schema.ts',
    './src/drizzle/schemas/org-schema.ts',
    './src/drizzle/schemas/staffing-schema.ts',
    './src/drizzle/schemas/time-schema.ts',
    './src/drizzle/schemas/comms-schema.ts',
    './src/drizzle/schemas/compliance-schema.ts',
    './src/drizzle/schemas/ops-schema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgres://postgres:postgres@localhost:5432/postgres',
  },
})
