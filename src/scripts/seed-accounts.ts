import { eq } from 'drizzle-orm'
import { user } from '@/drizzle/auth-schema'
import { db } from '@/drizzle/index'
import { auth } from '@/lib/auth'

type SeedAccount = {
  name: string
  email: string
  password: string
}

const accounts: SeedAccount[] = [
  {
    name: 'Alice Test',
    email: 'alice@test.com',
    password: 'password123',
  },
  {
    name: 'Bob Test',
    email: 'bob@test.com',
    password: 'password123',
  },
]

function getNestedError(error: unknown) {
  if (error && typeof error === 'object' && 'cause' in error) {
    return error.cause
  }

  return null
}

async function seedAccounts() {
  console.log('🌱 Seeding accounts...')

  let createdCount = 0
  let skippedCount = 0

  for (const accountData of accounts) {
    const existingUsers = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, accountData.email))
      .limit(1)

    if (existingUsers.length > 0) {
      skippedCount += 1
      console.log(`⚠️  User ${accountData.email} already exists, skipping`)
      continue
    }

    await auth.api.signUpEmail({
      body: {
        name: accountData.name,
        email: accountData.email,
        password: accountData.password,
      },
    })

    createdCount += 1
    console.log(`✅ Created user: ${accountData.name} (${accountData.email})`)
  }

  console.log(`🌱 Done! Created: ${createdCount}, Skipped: ${skippedCount}.`)
}

seedAccounts().catch((error) => {
  console.error('❌ Failed to seed accounts.')

  const nestedError = getNestedError(error)
  if (
    nestedError &&
    typeof nestedError === 'object' &&
    'code' in nestedError &&
    nestedError.code === '42P01'
  ) {
    console.error(
      'The auth tables are missing. Run `pnpm db:push` or `pnpm db:migrate` first.',
    )
    process.exitCode = 1
    return
  }

  console.error(error)
  process.exitCode = 1
})
