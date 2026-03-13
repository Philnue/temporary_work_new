import { db } from '@/drizzle'
import type { UserProfile } from '@/drizzle/types'

export async function readUserProfileByUserId(
  userId: string,
): Promise<UserProfile | null> {
  const profile = await db.query.userProfile.findFirst({
    where: (profiles, { eq }) => eq(profiles.userId, userId),
  })

  return profile ?? null
}
