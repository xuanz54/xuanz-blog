import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'

export function NotFound() {
  const reduce = useReducedMotion()

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-24 sm:px-6">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden border border-border bg-card p-8 sm:p-12"
      >
        <div className="notfound-grid pointer-events-none absolute inset-0 opacity-[0.15]" aria-hidden="true" />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            404 · Not Found
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            页面不存在
          </h1>
          <p className="mt-4 max-w-[48ch] text-muted-foreground">
            这个地址没有内容。也许是链接过期，或文章已移动到归档里。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="uiverse-btn uiverse-btn--shine inline-flex min-h-11 cursor-pointer items-center bg-accent px-5 text-sm font-medium text-on-accent transition-all hover:bg-accent-hover"
            >
              返回首页
            </Link>
            <Link
              to="/archives/"
              className="uiverse-btn uiverse-btn--outline inline-flex min-h-11 cursor-pointer items-center border border-border px-5 text-sm transition-all hover:border-accent hover:text-accent"
            >
              浏览归档
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
