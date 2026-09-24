import { motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { allTags, postsWithTag, type Post } from '../../content'
import { formatDate } from '../../lib/date'
import { NotFound } from './NotFound'

function TagPostLine({ post, index }: { post: Post; index: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.24), ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-border"
    >
      <Link to={post.path} className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
        <time dateTime={post.date.toISOString()} className="shrink-0 font-mono text-xs text-muted-foreground">
          {formatDate(post.date)}
        </time>
        <span className="min-w-0 flex-1 text-[15px] text-foreground transition-colors group-hover:text-accent">
          {post.title}
        </span>
      </Link>
    </motion.li>
  )
}

function TagGraph({ tags }: { tags: { name: string; count: number }[] }) {
  const nodes = useMemo(() => {
    const max = Math.max(1, ...tags.map((t) => t.count))
    const n = tags.length
    // Deterministic scatter in a grid-ish layout with count-based size.
    return tags.map((t, i) => {
      const angle = (i / Math.max(1, n)) * Math.PI * 2 + (i % 3) * 0.35
      const ring = 0.28 + ((i * 37) % 40) / 100
      const x = 50 + Math.cos(angle) * ring * 42
      const y = 50 + Math.sin(angle) * ring * 38
      const size = t.count >= max ? 'lg' : t.count >= Math.ceil(max * 0.6) ? 'md' : 'sm'
      return { ...t, x, y, size }
    })
  }, [tags])

  const maxCount = Math.max(1, ...tags.map((t) => t.count))

  return (
    <div className="tag-graph" role="list" aria-label="标签图谱">
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((b, j) => {
            const dist = Math.hypot(a.x - b.x, a.y - b.y)
            if (dist > 28) return null
            return (
              <line
                key={`${a.name}-${b.name}-${j}`}
                x1={`${a.x}%`}
                y1={`${a.y}%`}
                x2={`${b.x}%`}
                y2={`${b.y}%`}
                stroke="var(--border)"
                strokeWidth="1"
                opacity={0.7}
              />
            )
          }),
        )}
        {nodes.map((a) =>
          nodes
            .filter((b) => b.count === maxCount && a.name !== b.name)
            .map((b) => (
              <line
                key={`hub-${a.name}-${b.name}`}
                x1={`${a.x}%`}
                y1={`${a.y}%`}
                x2={`${b.x}%`}
                y2={`${b.y}%`}
                stroke="var(--accent)"
                strokeWidth="1"
                opacity={0.35}
              />
            )),
        )}
      </svg>
      {nodes.map((n) => (
        <Link
          key={n.name}
          to={`/tags/${encodeURIComponent(n.name)}/`}
          className="tag-graph-node"
          data-size={n.size}
          role="listitem"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          #{n.name}
          <span className="ml-1 font-mono text-[10px] text-muted-foreground">{n.count}</span>
        </Link>
      ))}
    </div>
  )
}

export function TagsPage() {
  const tags = allTags()
  const reduce = useReducedMotion()
  const [graph, setGraph] = useState(false)

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Tags</p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">标签</h1>
            <p className="mt-2 text-sm text-muted-foreground">{tags.length} 个标签</p>
          </div>
          <div
            className="flex border border-border"
            role="group"
            aria-label="标签视图切换"
          >
            <button
              type="button"
              className="year-chip cursor-pointer border-0 border-r"
              aria-pressed={!graph}
              onClick={() => setGraph(false)}
            >
              列表
            </button>
            <button
              type="button"
              className="year-chip cursor-pointer border-0"
              aria-pressed={graph}
              onClick={() => setGraph(true)}
            >
              图谱
            </button>
          </div>
        </div>
      </header>

      {graph ? (
        <div className="mt-8">
          <TagGraph tags={tags} />
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            节点大小按文章数 · 点击进入标签
          </p>
        </div>
      ) : (
        <ul className="mt-8 flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <motion.li
              key={t.name}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/tags/${encodeURIComponent(t.name)}/`}
                className="uiverse-btn inline-flex min-h-10 items-center gap-1.5 border border-border bg-card px-3.5 py-1 text-sm transition-all hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-[0_0_16px_-12px_var(--accent)]"
              >
                <span className="text-muted-foreground">#</span>
                {t.name}
                <span className="font-mono text-[11px] text-muted-foreground">{t.count}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function TagPage() {
  const { name = '' } = useParams()
  const navigate = useNavigate()
  const decoded = decodeURIComponent(name)
  let list = postsWithTag(decoded)
  let display = decoded
  if (!list.length) {
    list = postsWithTag(name)
    display = name
  }

  if (!list.length) {
    return (
      <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6">
        <NotFound />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <button
          type="button"
          onClick={() => navigate('/tags/')}
          className="mb-3 cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-accent"
        >
          ← 所有标签
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Tag</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">#{display}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{list.length} 篇文章</p>
      </header>
      <ul className="mt-6">
        {list.map((post, i) => (
          <TagPostLine key={post.slug} post={post} index={i} />
        ))}
      </ul>
    </div>
  )
}
