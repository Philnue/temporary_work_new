import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'
const THEME_STORAGE_KEY = 'theme'
const THEME_COOKIE_KEY = 'theme'

function getStoredTheme(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY)
  } catch {
    return null
  }
}

function setStoredTheme(mode: ThemeMode) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // no-op when storage is unavailable
  }
}

function readThemeCookie(): ThemeMode | null {
  if (typeof document === 'undefined') {
    return null
  }

  const cookiePart = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${THEME_COOKIE_KEY}=`))

  if (!cookiePart) {
    return null
  }

  const value = cookiePart.split('=')[1]
  return value === 'light' || value === 'dark' || value === 'auto'
    ? value
    : null
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const cookieMode = readThemeCookie()
  if (cookieMode) {
    return cookieMode
  }

  const stored = getStoredTheme()
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
  document.documentElement.style.backgroundColor =
    resolved === 'dark' ? '#09090b' : '#ffffff'
  document.cookie = `${THEME_COOKIE_KEY}=${mode}; path=/; max-age=31536000; samesite=lax`
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)

    const initialMode = getInitialMode()
    setMode((currentMode) =>
      currentMode === initialMode ? currentMode : initialMode,
    )
    applyThemeMode(initialMode)
  }, [])

  useEffect(() => {
    if (!isHydrated || mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [isHydrated, mode])

  function toggleMode() {
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    setStoredTheme(nextMode)
  }

  const label = !isHydrated
    ? 'Theme mode toggle'
    : mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground"
    >
      {!isHydrated
        ? 'Theme'
        : mode === 'auto'
          ? 'Auto'
          : mode === 'dark'
            ? 'Dark'
            : 'Light'}
    </button>
  )
}
