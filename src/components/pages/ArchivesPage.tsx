import { motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { postsByYear } from '../../content'
import { formatMonthDay } from '../../lib/date'

export function ArchivesPage() {
  const groups = postsByYear()
  const reduce = useReducedMotion()
  const [yearFilter, setYearFilter] = useState<number | null>(null)

  const years = useMemo(() => groups.map((g) => g.year), [groups])
  const visible = useMemo(
    () => (yearFilter == null ? groups : groups.filter((g) => g.year === yearFilter)),
    [groups, yearFilter],
  )
  const totalCount = groups.reduce((n, g) => n + g.posts.length, 0)

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          Archives
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          归档
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">共 {totalCount} 篇文章</p>
      </header>

      <div
        className="mt-6 flex flex-wrap gap-2"
        role="group"
        aria-label="按年份筛选"
      >
        <button
          type="button"
          className="year-chip cursor-pointer"
          aria-pressed={yearFilter == null}
          onClick={() => setYearFilter(null)}
        >
          全部
        </button>
        {years.map((y) => (
          <button
            key={y}
            type="button"
            className="year-chip cursor-pointer"
            aria-pressed={yearFilter === y}
            onClick={() => setYearFilter(y)}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-12">
        {visible.map((group, gi) => (
          <motion.section
            key={group.year}
            id={`year-${group.year}`}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.45, delay: Math.min(gi * 0.05, 0.2), ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 flex items-baseline gap-4">
              <h2 className="font-display text-2xl font-semibold tabular-nums">
                {group.year}
              </h2>
              <span className="font-mono text-[11px] text-muted-foreground">
                {group.posts.length}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <ul className="space-y-0">
              {group.posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={post.path}
                    className="group flex items-baseline gap-4 border-b border-border/70 py-3 transition-colors hover:bg-accent/8"
                  >
                    <time
                      dateTime={post.date.toISOString()}
                      className="w-16 shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
                    >
                      {formatMonthDay(post.date)}
                    </time>
                    <span className="min-w-0 flex-1 truncate text-[15px] text-foreground transition-colors group-hover:text-accent">
                      {post.title}
                    </span>
                    {post.categories[0] && (
                      <span className="hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:inline">
                        {post.categories[0]}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
