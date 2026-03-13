import { auth } from '@/auth/server/auth'
import { getRequestHeaders } from '@tanstack/react-start/server'

export async function readSession() {
  const headers = getRequestHeaders()
  return auth.api.getSession({ headers })
}

export async function requireSession() {
  const session = await readSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}

type SessionData = NonNullable<Awaited<ReturnType<typeof readSession>>>

export type SessionUser = SessionData['user']
export type SessionRecord = SessionData['session']
