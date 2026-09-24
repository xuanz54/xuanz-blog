import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const urlTheme = new URLSearchParams(window.location.search).get('theme')
  if (urlTheme === 'light' || urlTheme === 'dark') return urlTheme
  const stored = localStorage.getItem('xuanz-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('xuanz-theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return { theme, setTheme, toggle }
}
