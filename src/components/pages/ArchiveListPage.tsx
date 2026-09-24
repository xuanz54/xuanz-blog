import { motion, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { paginate } from '../../content'
import { formatDate } from '../../lib/date'
import type { Post } from '../../content'
import { NotFound } from './NotFound'

function PostRow({ post, index }: { post: Post; index: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group border-b border-border py-8 first:pt-0"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
        <time
          dateTime={post.date.toISOString()}
          className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
        >
          {formatDate(post.date)}
        </time>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {post.frontMatter.top && (
              <span className="border border-accent/50 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                置顶
              </span>
            )}
            <h2 className="font-display text-2xl leading-snug font-medium tracking-tight text-foreground sm:text-[1.65rem]">
              <Link
                to={post.path}
                className="decoration-accent/40 underline-offset-4 transition-colors hover:text-accent group-hover:underline"
              >
                {post.title}
              </Link>
            </h2>
          </div>
          <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {post.categories.slice(0, 1).map((c) => (
              <Link
                key={c}
                to={`/categories/${encodeURIComponent(c)}/`}
                className="chip-pill border border-border px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {c}
              </Link>
            ))}
            {post.tags.slice(0, 3).map((t) => (
              <Link
                key={t}
                to={`/tags/${encodeURIComponent(t)}/`}
                className="text-xs text-muted-foreground transition-colors hover:text-accent"
              >
                #{t}
              </Link>
            ))}
            <span className="ml-auto hidden font-mono text-[11px] text-muted-foreground sm:inline">
              {post.readingMinutes} min
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export function ArchiveListPage({ page }: { page: number }) {
  const { items, totalPages, total, page: current } = paginate(page, siteConfig.postsPerPage)
  const invalid = !Number.isFinite(page) || page < 1 || page > totalPages

  // Prefetch next page route when near bottom.
  useEffect(() => {
    if (invalid || current >= totalPages) return
    const nextPath = current + 1 === 2 ? '/' : `/page/${current + 1}/`
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = nextPath
    link.as = 'document'
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [current, totalPages, invalid])

  if (invalid) {
    return <NotFound />
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Page {current}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">文章列表</h1>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {total} posts
        </span>
      </header>

      <div>
        {items.map((post, i) => (
          <PostRow key={post.slug} post={post} index={i} />
        ))}
      </div>

      <nav className="mt-10 flex items-center justify-between" aria-label="分页">
        {current > 1 ? (
          <Link
            to={current === 2 ? '/' : `/page/${current - 1}/`}
            className="uiverse-btn uiverse-btn--outline inline-flex min-h-11 cursor-pointer items-center border border-border px-4 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            上一页
          </Link>
        ) : (
          <span />
        )}
        <span className="font-mono text-xs text-muted-foreground">
          {current} / {totalPages}
        </span>
        {current < totalPages ? (
          <Link
            to={`/page/${current + 1}/`}
            className="uiverse-btn uiverse-btn--outline inline-flex min-h-11 cursor-pointer items-center border border-border px-4 text-sm transition-colors hover:border-accent hover:text-accent"
            onMouseEnter={(e) => {
              const href = e.currentTarget.getAttribute('href')
              if (!href) return
              if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return
              const link = document.createElement('link')
              link.rel = 'prefetch'
              link.href = href
              link.as = 'document'
              document.head.appendChild(link)
            }}
          >
            下一页
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
