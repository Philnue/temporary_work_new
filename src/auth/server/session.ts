import { createServerFn } from '@tanstack/react-start'
import { readAuthContext, requireAuthContext } from './auth-context'
import { readSession, requireSession } from './session-core'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    return readSession()
  },
)

export const ensureSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    return requireSession()
  },
)

export const getSessionWithProfile = createServerFn({ method: 'GET' }).handler(
  async () => {
    return readAuthContext()
  },
)

export const ensureSessionWithProfile = createServerFn({
  method: 'GET',
}).handler(async () => {
  return requireAuthContext()
})
