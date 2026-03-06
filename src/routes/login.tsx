import { authClient } from '#/lib/auth-client'
import { getSession } from '#/lib/auth-fns'
import { Button, Input } from '@base-ui/react'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Login</h1>

      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Button
        onClick={() => {
          authClient.signIn.email({
            email: 'alice@test.com',
            password: 'password123',
          })
        }}
      >
        Login
      </Button>
    </div>
  )
}
