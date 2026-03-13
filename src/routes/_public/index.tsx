import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({ component: App })

function App() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Starter
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Build your app with TanStack Start + shadcn/ui
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          The auth flow, server functions, and route structure are ready. Start
          with the dashboard or sign in to test protected pages.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/login"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Go to Login
          </Link>
          <Link
            to="/dashboard"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}
