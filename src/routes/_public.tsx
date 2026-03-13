import ThemeToggle from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  component: () => (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3">
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{
                className:
                  'rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground',
              }}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{
                className:
                  'rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground',
              }}
            >
              About
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button size="sm">Zum Portal</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  ),
})
