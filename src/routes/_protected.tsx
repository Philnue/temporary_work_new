import {
  createFileRoute,
  redirect,
  Outlet,
  useNavigate,
  Link,
} from '@tanstack/react-router'
import { authClient } from '@/auth/client/auth-client'
import { getSessionWithProfile } from '@/auth/server/session'
import ThemeToggle from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/error-message'
import { toast } from 'sonner'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const auth = await getSessionWithProfile()

    if (!auth) {
      const redirectTarget = location.href

      throw redirect({
        to: '/login',
        search: { redirect: redirectTarget },
      })
    }

    return auth
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { error } = await authClient.signOut()

    if (error) {
      toast.error(getErrorMessage(error, 'Logout failed. Please try again.'))
      return
    }

    toast.success('Successfully logged out.')
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-2">
          <h1 className="mr-2 text-2xl font-semibold tracking-tight">Portal</h1>

          <nav className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              About
            </Link>
            <Link
              to="/dashboard"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{
                className:
                  'rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground',
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/settings"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{
                className:
                  'rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground',
              }}
            >
              Settings
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  )
}
