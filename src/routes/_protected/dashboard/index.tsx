import { useAuth } from '@/auth/client/use-auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, profile } = useAuth()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Dashboard
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Portal</h1>
        <p className="mt-3 text-muted-foreground">
          Willkommen, {profile?.displayName ?? user.name} ({user.email}).
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Profilstatus: {profile ? 'angelegt' : 'nicht vorhanden'}
        </p>
      </section>
    </main>
  )
}
