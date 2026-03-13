import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { getErrorMessage } from '@/lib/error-message'

import appCss from '../styles.css?url'

const THEME_FALLBACK_STYLE = `html,body{background-color:#ffffff;color-scheme:light;}@media (prefers-color-scheme: dark){html,body{background-color:#09090b;color-scheme:dark;}}html.dark,html.dark body{background-color:#09090b;color-scheme:dark;}html.light,html.light body{background-color:#ffffff;color-scheme:light;}`

const THEME_INIT_SCRIPT = `(function(){try{var readCookie=function(key){var part=document.cookie.split('; ').find(function(entry){return entry.indexOf(key+'=')===0});if(!part)return null;return part.split('=')[1]};var getStoredTheme=function(){try{return window.localStorage.getItem('theme')}catch(_){return null}};var cookieMode=readCookie('theme');var stored=getStoredTheme();var mode=(cookieMode==='light'||cookieMode==='dark'||cookieMode==='auto')?cookieMode:(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;root.style.backgroundColor=resolved==='dark'?'#09090b':'#ffffff';var themeColor=document.querySelector('meta[name="theme-color"]');if(themeColor){themeColor.setAttribute('content',resolved==='dark'?'#09090b':'#ffffff')}}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
})

function RootNotFoundComponent() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Not Found
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Diese Seite gibt es nicht.
        </h1>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Zur Startseite
          </Link>
        </div>
      </section>
    </main>
  )
}

function RootErrorComponent({ error }: any) {
  const message = getErrorMessage(error, 'An unexpected error occurred.')

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Error
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{THEME_FALLBACK_STYLE}</style>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="wrap-anywhere bg-background font-sans text-foreground antialiased">
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster closeButton position="top-right" richColors />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: 'TanStack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
            ]}
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
