import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { posts, type Post } from '../../content'
import { formatDate } from '../../lib/date'
import { EffectBoundary } from '../effects/EffectBoundary'
import { Broadcast } from './Broadcast'

function StaticSubtitle() {
  return (
    <p className="font-mono text-sm text-muted-foreground" aria-live="polite">
      {siteConfig.subtitle}
      <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-accent" />
    </p>
  )
}

function HeroBackground() {
  const reduce = useReducedMotion()
  const [Field, setField] = useState<
    React.ComponentType<Record<string, unknown>> | null
  >(null)

  useEffect(() => {
    if (reduce) return
    let cancelled = false
    import('@designcodeio/threeui/components/RibbonFieldBackground')
      .then((mod) => {
        if (cancelled) return
        const loaded = (mod as Record<string, unknown>).RibbonFieldBackground
        if (typeof loaded === 'function') {
          setField(() => loaded as React.ComponentType<Record<string, unknown>>)
        }
      })
      .catch(() => {
        if (!cancelled) setField(null)
      })
    return () => {
      cancelled = true
    }
  }, [reduce])

  if (!Field) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <EffectBoundary>
        <div className="absolute inset-0 opacity-[0.28] dark:opacity-[0.38]">
          <Field
            speed={0.4}
            pointerAmount={0.55}
            smoothing={0.04}
            brightness={1}
            opacity={0.7}
            hue={42}
            saturation={0.85}
            className="h-full w-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </EffectBoundary>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/35" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background to-transparent" />
      <div className="hero-grid absolute inset-0 opacity-[0.12] dark:opacity-[0.18]" />
    </div>
  )
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-chip relative overflow-hidden border border-border bg-card px-4 py-2.5">
      <span className="stat-chip-bar" aria-hidden="true" />
      <div className="font-mono text-lg tabular-nums text-foreground">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
    </div>
  )
}

function PostRow({ post, index }: { post: Post; index: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.055, 0.33),
        ease: [0.16, 1, 0.3, 1],
      }}
        className="group relative border-b border-border py-8 first:pt-0"
    >
      <span
        aria-hidden="true"
        className="post-row-glow pointer-events-none absolute inset-x-0 -inset-y-1 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
        <time
          dateTime={post.date.toISOString()}
          className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground transition-colors group-hover:text-accent"
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
                className="decoration-accent/50 underline-offset-4 transition-all hover:text-accent group-hover:underline"
              >
                <span className="post-title-shine">{post.title}</span>
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
                className="chip-pill border border-border px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-muted-foreground transition-all hover:border-accent hover:bg-accent/12 hover:text-accent"
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

export function HomePage() {
  const page = 1
  const { items, totalPages, total } = useMemo(() => {
    const start = (page - 1) * siteConfig.postsPerPage
    return {
      items: posts.slice(start, start + siteConfig.postsPerPage),
      totalPages: Math.max(1, Math.ceil(posts.length / siteConfig.postsPerPage)),
      total: posts.length,
    }
  }, [page])

  const tagCount = useMemo(() => {
    const set = new Set<string>()
    for (const p of posts) for (const t of p.tags) set.add(t)
    return set.size
  }, [])

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <HeroBackground />
        <div className="relative mx-auto flex min-h-[78vh] max-w-[1120px] flex-col justify-end px-4 pt-28 pb-16 sm:px-6 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="hero-eyebrow chip-pill inline-flex items-center gap-2 border border-accent/45 bg-accent/10 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                <span className="hero-dot" aria-hidden="true" />
                Personal Notes
              </span>
              <span className="hidden font-mono text-[11px] tracking-[0.14em] text-muted-foreground sm:inline">
                est. {new Date().getFullYear()}
              </span>
            </div>

            <h1 className="mt-5 font-display text-4xl leading-[1.12] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              写给自己的
              <br />
              <span className="hero-gradient-text">技术与思考</span>
            </h1>

            <div className="mt-5">
              <StaticSubtitle />
            </div>

            <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-muted-foreground">
              {siteConfig.description}。收录 {total} 篇关于 AI、工程与效率的笔记。
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatChip value={String(total)} label="posts" />
              <StatChip value={String(tagCount)} label="tags" />
              <StatChip value="10/page" label="page" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/archives/"
                className="uiverse-btn uiverse-btn--shine inline-flex min-h-11 cursor-pointer items-center bg-accent px-6 text-sm font-medium text-on-accent transition-all hover:bg-accent-hover hover:shadow-[0_0_28px_-6px_var(--accent)]"
              >
                浏览归档
                <svg className="ml-2 transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                to="/search/"
                className="uiverse-btn uiverse-btn--outline inline-flex min-h-11 cursor-pointer items-center gap-2 border border-border bg-card px-6 text-sm text-foreground transition-all hover:border-accent hover:text-accent"
              >
                搜索
                <kbd className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground">⌘K</kbd>
              </Link>
              <Link
                to="/about/"
                className="uiverse-btn uiverse-btn--outline inline-flex min-h-11 cursor-pointer items-center border border-border bg-card px-6 text-sm text-foreground transition-all hover:border-accent hover:text-accent"
              >
                关于作者
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Broadcast />

      <section className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Latest</p>
            <h2 className="mt-1 font-display text-2xl font-medium tracking-tight text-foreground">
              最新文章
            </h2>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {total} posts
          </span>
        </div>

        <div>
          {items.map((post, i) => (
            <PostRow key={post.slug} post={post} index={i} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav
            className="mt-10 flex items-center justify-between"
            aria-label="分页"
          >
            <span className="font-mono text-xs text-muted-foreground">
              1 / {totalPages}
            </span>
              <Link
                to="/page/2/"
                className="uiverse-btn uiverse-btn--outline inline-flex min-h-11 cursor-pointer items-center border border-border px-5 text-sm text-foreground transition-all hover:border-accent hover:text-accent"
              >
              下一页
              <svg className="ml-2" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </nav>
        )}
      </section>
    </>
  )
}
