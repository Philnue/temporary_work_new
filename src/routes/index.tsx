import { Button } from '#/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button
        onClick={async () => {
          const { data } = await authClient.signIn.email({
            email: 'alice@test.com',
            password: 'password123',
          })
          console.log(data)
        }}
      >
        Click me
      </Button>
      <Button
        onClick={async () => {
          const { data } = await authClient.getSession()
          console.log(data)
        }}
      >
        Get Session
      </Button>
      <Button
        onClick={async () => {
          const { data } = await authClient.signOut()
          console.log(data)
        }}
      >
        Log Out
      </Button>
    </div>
  )
}
