import { requireAuthContext } from '@/auth/server/auth-context'
import { createMiddleware } from '@tanstack/react-start'

export const requireAuth = createMiddleware().server(async ({ next }) => {
  const authContext = await requireAuthContext()

  return next({
    context: authContext,
  })
})
