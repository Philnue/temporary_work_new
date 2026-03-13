import { requireAuthContext } from '@/auth/server/auth-context'
import { createMiddleware } from '@tanstack/react-start'

type Role = 'user' | 'educator' | 'admin' | 'coordinator' | 'facility'

export const requireRole = (role: Role) =>
  createMiddleware().server(async ({ next }) => {
    const authContext = await requireAuthContext()

    if (authContext.user.role !== role) {
      throw new Error('Forbidden')
    }

    return next({
      context: authContext,
    })
  })
