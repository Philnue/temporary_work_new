import type { UserProfile } from '@/drizzle/types'
import type { SessionRecord, SessionUser } from './session-core'
import { readSession, requireSession } from './session-core'
import { readUserProfileByUserId } from './profile-query'

export type AuthContext = {
  user: SessionUser
  session: SessionRecord
  profile: UserProfile | null
}

function buildAuthContext(args: {
  user: SessionUser
  session: SessionRecord
  profile: UserProfile | null
}): AuthContext {
  return {
    user: args.user,
    session: args.session,
    profile: args.profile,
  }
}

export async function readAuthContext(): Promise<AuthContext | null> {
  const session = await readSession()

  if (!session) {
    return null
  }

  const profile = await readUserProfileByUserId(session.user.id)
  return buildAuthContext({
    user: session.user,
    session: session.session,
    profile,
  })
}

export async function requireAuthContext(): Promise<AuthContext> {
  const session = await requireSession()
  const profile = await readUserProfileByUserId(session.user.id)

  return buildAuthContext({
    user: session.user,
    session: session.session,
    profile,
  })
}
