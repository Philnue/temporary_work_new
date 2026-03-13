import { requireAuth } from '@/auth/middleware/require-auth'
import { createServerFn } from '@tanstack/react-start'

export const getServerTime = createServerFn()
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    console.log('profile', context.profile)

    return new Date().toISOString()
  })
