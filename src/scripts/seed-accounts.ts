import { eq } from 'drizzle-orm'
import { user } from '@/drizzle/schemas/auth-schema'
import { userProfile } from '@/drizzle/schemas/identity-schema'
import { db } from '@/drizzle/index'
import { auth } from '@/auth/server/auth'

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
  console.log('Seeding accounts...')

  let usersCreated = 0
  let usersSkipped = 0
  let profilesCreated = 0
  let profilesSkipped = 0

  for (const accountData of accounts) {
    const existingUsers = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, accountData.email))
      .limit(1)

    const existingUser = existingUsers.at(0)

    let userId = existingUser?.id

    if (!userId) {
      const signUpResult = await auth.api.signUpEmail({
        body: {
          name: accountData.name,
          email: accountData.email,
          password: accountData.password,
        },
      })

      usersCreated += 1

      userId = signUpResult.user.id
      console.log(`Created user: ${accountData.name} (${accountData.email})`)
    } else {
      usersSkipped += 1
      console.log(
        `User ${accountData.email} already exists, skipping user create`,
      )
    }

    const existingProfiles = await db
      .select({ userId: userProfile.userId })
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1)

    const existingProfile = existingProfiles.at(0)

    if (!existingProfile) {
      await db.insert(userProfile).values({
        userId,
        displayName: accountData.name,
      })
      profilesCreated += 1
      console.log(`Created profile for: ${accountData.email}`)
    } else {
      profilesSkipped += 1
      console.log(`Profile for ${accountData.email} already exists, skipping`)
    }
  }

  console.log(
    `Done. Users created: ${usersCreated}, users skipped: ${usersSkipped}, profiles created: ${profilesCreated}, profiles skipped: ${profilesSkipped}.`,
  )
}

seedAccounts().catch((error) => {
  console.error('Failed to seed accounts.')

  const nestedError = getNestedError(error)
  if (
    nestedError &&
    typeof nestedError === 'object' &&
    'code' in nestedError &&
    nestedError.code === '42P01'
  ) {
    console.error(
      'The auth/profile tables are missing. Run `pnpm db:push` or `pnpm db:migrate` first.',
    )
    process.exitCode = 1
    return
  }

  console.error(error)
  process.exitCode = 1
})
