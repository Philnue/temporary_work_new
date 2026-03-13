import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: () => (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Portal
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Ihr Portal - bitte anmelden
          </h1>
        </section>
        <Outlet />
      </div>
    </main>
  ),
})
