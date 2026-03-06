import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/drizzle/index'
import * as authSchema from '@/drizzle/auth-schema'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  plugins: [tanstackStartCookies()],
})
