import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { useTheme } from '../../hooks/useTheme'

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {open ? (
        <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M3 6h14M3 10h14M3 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 119.5 3a7 7 0 0011.5 11.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Progress() {
  const [progress, setProgress] = useState(0)
  const location = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => {
    const id = window.setTimeout(() => setProgress(100), 50)
    const t = window.setTimeout(() => setProgress(0), 500)
    return () => {
      window.clearTimeout(id)
      window.clearTimeout(t)
      setProgress(0)
    }
  }, [location.pathname])

  if (reduce || progress === 0) return null
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden="true">
      <motion.div
        className="h-full bg-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        style={{ transformOrigin: 'left' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <motion.button
      type="button"
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
      className="back-to-top fixed bottom-6 right-6 z-40 flex h-11 w-11 cursor-pointer items-center justify-center border border-border bg-card text-foreground shadow-sm transition-colors hover:border-accent hover:text-accent"
      aria-label="返回顶部"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  )
}

function RouteFade({ children }: { children: ReactNode }) {
  const location = useLocation()
  const reduce = useReducedMotion()
  const isPost = /^\/\d{4}\/\d{2}\/\d{2}\//.test(location.pathname)
  const isHome = location.pathname === '/'

  if (reduce) return <>{children}</>

  // Home: slightly stronger reveal; post: gentle rise + fade; other: light fade.
  const initial = isHome ? { opacity: 0, y: 14 } : isPost ? { opacity: 0, y: 18 } : { opacity: 0, y: 8 }
  const duration = isPost ? 0.45 : isHome ? 0.4 : 0.32

  return (
    <motion.div
      key={location.pathname}
      initial={initial}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const t = window.setTimeout(() => setMenuOpen(false), 0)
    return () => window.clearTimeout(t)
  }, [location.pathname])

  useEffect(() => {
    if (!siteConfig.analytics.busuanzi) return
    if (document.querySelector('script[data-busuanzi]')) return
    const s = document.createElement('script')
    s.src = 'https://busuanzi.iberiu.com/js/busuanzi.pure.mini.js'
    s.async = true
    s.dataset.busuanzi = '1'
    document.head.appendChild(s)
  }, [])

  return (
    <div className="min-h-dvh flex flex-col">
      <Progress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-accent focus:bg-card focus:px-4 focus:py-2 focus:text-sm"
      >
        跳到主要内容
      </a>

      <header className="glass-header sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-11 w-11 cursor-pointer items-center justify-center text-foreground transition-colors hover:text-accent lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            >
              <MenuIcon open={menuOpen} />
            </button>
            <Link to="/" className="group flex items-baseline gap-2">
              <span className="font-display text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                {siteConfig.title}
              </span>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
                {siteConfig.subtitle}
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
            {siteConfig.nav.map((item) => {
              const external = 'external' in item && item.external === true
              if (external) {
                return (
                  <a
                    key={item.to}
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link relative px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                )
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `nav-link relative px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'text-accent'
                        : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            })}
            <NavLink
              to="/search/"
              className={({ isActive }) =>
                `flex h-11 w-11 items-center justify-center transition-colors ${
                  isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`
              }
              aria-label="搜索"
              title="搜索 (Ctrl/⌘ K)"
            >
              <SearchIcon />
            </NavLink>
            <button
              type="button"
              onClick={toggle}
              className="theme-toggle ml-1 flex h-11 w-11 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-accent"
              aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              <motion.span
                key={theme}
                initial={{ rotate: -40, opacity: 0.4 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex"
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </motion.span>
            </button>
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
            <NavLink
              to="/search/"
              className={({ isActive }) =>
                `flex h-11 w-11 items-center justify-center transition-colors ${
                  isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`
              }
              aria-label="搜索"
              title="搜索 (Ctrl/⌘ K)"
            >
              <SearchIcon />
            </NavLink>
            <button
              type="button"
              onClick={toggle}
              className="theme-toggle flex h-11 w-11 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-accent"
              aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              <motion.span
                key={theme}
                initial={{ rotate: -40, opacity: 0.4 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex"
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </motion.span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-header border-t border-t-transparent px-4 py-3 lg:hidden"
            aria-label="移动导航"
          >
            <div className="flex flex-col">
              {siteConfig.nav.map((item) => {
                const external = 'external' in item && item.external === true
                if (external) {
                  return (
                    <a
                      key={item.to}
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-11 px-2 py-3 text-sm text-foreground"
                    >
                      {item.label}
                    </a>
                  )
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `min-h-11 px-2 py-3 text-sm ${
                        isActive ? 'text-accent' : 'text-foreground'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          </motion.nav>
        )}
      </header>

      <main id="main" className="flex-1">
        <RouteFade>{children}</RouteFade>
      </main>

      <footer className="relative overflow-hidden border-t border-border">
        <div className="footer-glow pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[1120px] flex-col gap-3 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p>
              © {new Date().getFullYear()} {siteConfig.author}. {siteConfig.title}.
            </p>
            <p className="mt-1 text-xs">
              邮件联系：<a className="text-accent hover:underline" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {siteConfig.analytics.busuanzi && (
              <span className="font-mono text-[11px] uppercase tracking-[0.14em]" title="站点访问统计">
                UV <span id="busuanzi_value_site_uv">-</span>
                {' · '}
                PV <span id="busuanzi_value_site_pv">-</span>
              </span>
            )}
            <a
              href="/atom.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-accent"
            >
              RSS
            </a>
            <a
              href="https://github.com/xuanz54"
              target="_blank"
              rel="noopener noreferrer"
              className="uiverse-btn uiverse-btn--outline inline-flex min-h-9 items-center border border-border px-3.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
              Hexo 迁移 · React + ThreeUI
            </span>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  )
}
