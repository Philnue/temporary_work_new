import { authClient } from '@/auth/client/auth-client'
import { getSession } from '@/auth/server/session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/error-message'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

type LoginSearch = {
  redirect?: string
}

function getSafeRedirect(path?: string) {
  // Allow only internal paths to avoid open redirects.
  if (!path) {
    return '/dashboard'
  }

  if (!path.startsWith('/') || path.startsWith('//')) {
    return '/dashboard'
  }

  return path
}

export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search): LoginSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const session = await getSession()
    if (session) {
      throw redirect({ href: getSafeRedirect(search.redirect) })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const navigateAfterLogin = () => {
    navigate({ href: getSafeRedirect(search.redirect) })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await authClient.signIn.email({ email, password })

    if (error) {
      toast.error(getErrorMessage(error, 'Login failed. Please try again.'))
      return
    }

    toast.success('Successfully signed in.')
    navigateAfterLogin()
  }

  const handleQuickLogin = async () => {
    const { error } = await authClient.signIn.email({
      email: 'alice@test.com',
      password: 'password123',
    })

    if (error) {
      toast.error(getErrorMessage(error, 'Login failed. Please try again.'))
      return
    }

    toast.success('Successfully signed in.')
    navigateAfterLogin()
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with your account to access the dashboard.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <Input
          type="email"
          placeholder="Email"
          name="email"
          defaultValue="alice@test.com"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          defaultValue="password123"
          required
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleQuickLogin}
        >
          Direkt Login
        </Button>
      </form>
    </div>
  )
}
