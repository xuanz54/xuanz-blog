import { motion, useReducedMotion } from 'motion/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { allCategories, postsInCategory, type Post } from '../../content'
import { formatDate } from '../../lib/date'
import { NotFound } from './NotFound'

function PostLine({ post, index }: { post: Post; index: number }) {
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
        {post.categories[0] && (
          <span className="font-mono text-[11px] text-muted-foreground">{post.categories[0]}</span>
        )}
      </Link>
    </motion.li>
  )
}

export function CategoriesPage() {
  const cats = allCategories()
  const reduce = useReducedMotion()
  const max = Math.max(1, ...cats.map((c) => c.count))
  const total = cats.reduce((n, c) => n + c.count, 0)

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Categories</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">分类</h1>
        <p className="mt-2 text-sm text-muted-foreground">{cats.length} 个分类</p>
      </header>

      <ul className="mt-8 space-y-4">
        {cats.map((c, i) => {
          const pct = Math.round((c.count / Math.max(1, total)) * 100)
          const width = Math.round((c.count / max) * 100)
          return (
            <motion.li
              key={c.name}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.32), ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/categories/${encodeURIComponent(c.name)}/`}
                className="group block border border-border bg-card p-5 transition-all hover:border-accent hover:shadow-[0_0_20px_-14px_var(--accent)]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-foreground transition-colors group-hover:text-accent">
                    {c.name}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    {c.count} 篇 · {pct}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-muted" aria-hidden="true">
                  <div
                    className="cat-bar"
                    style={{
                      width: `${width}%`,
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                </div>
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

export function CategoryPage() {
  const { name = '' } = useParams()
  const navigate = useNavigate()
  const decoded = decodeURIComponent(name)
  const list = postsInCategory(decoded)

  if (!list.length) {
    // try undecoded
    const alt = postsInCategory(name)
    if (!alt.length) {
      return (
        <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6">
          <NotFound />
        </div>
      )
    }
    return <CategoryList name={name} list={alt} onBack={() => navigate('/categories/')} />
  }

  return <CategoryList name={decoded} list={list} onBack={() => navigate('/categories/')} />
}

function CategoryList({
  name,
  list,
  onBack,
}: {
  name: string
  list: Post[]
  onBack: () => void
}) {
  return (
    <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-3 cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-accent"
        >
          ← 所有分类
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Category</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{list.length} 篇文章</p>
      </header>
      <ul className="mt-6">
        {list.map((post, i) => (
          <PostLine key={post.slug} post={post} index={i} />
        ))}
      </ul>
    </div>
  )
}
