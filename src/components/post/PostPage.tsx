import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { adjacentPosts, getPostByPath } from '../../content'
import { siteConfig } from '../../config/site'
import { formatDate } from '../../lib/date'
import { enhanceCodeBlocks } from '../../lib/codeCopy'
import { renderMermaidDiagrams } from '../../lib/mermaid'
import { setMetaDescription } from '../../lib/meta'
import {
  extractHeadingsFromMarkdown,
  highlightCodeBlocks,
  renderMarkdown,
  type Heading,
} from '../../lib/markdown'
import { NotFound } from '../pages/NotFound'
import { CopyrightNotice } from './CopyrightNotice'
import { ImageLightbox, type LightboxState } from './ImageLightbox'
import { Reward } from './Reward'
import { ShareRow } from './ShareRow'
import { TwikooComments } from './TwikooComments'
import { ReadingProgressBar, ReadingProgressRing } from './ReadingProgress'
import { useReadingProgress } from '../../hooks/useReadingProgress'

function TocNav({ headings }: { headings: Heading[] }) {
  const items = headings.filter((h) => h.depth >= 2 && h.depth <= 3)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length < 2) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.id)
            break
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    )
    for (const h of items) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <nav aria-label="目录" className="toc">
      <p className="toc-title">目录</p>
      <ol className="toc-list">
        {items.map((h) => (
          <li key={h.id} className={h.depth === 3 ? 'toc-h3' : 'toc-h2'}>
            <a
              href={`#${h.id}`}
              className={activeId === h.id ? 'is-active' : undefined}
              aria-current={activeId === h.id ? 'true' : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function PostHeaderField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
    </div>
  )
}

export function PostPage() {
  const location = useLocation()
  const params = useParams()
  const { year, month, day, slug } = params
  const reduce = useReducedMotion()
  const progress = useReadingProgress()
  const articleRef = useRef<HTMLElement>(null)

  const post = useMemo(() => {
    if (year && month && day && slug) {
      return getPostByPath(`/${year}/${month}/${day}/${encodeURIComponent(slug)}/`)
    }
    return getPostByPath(location.pathname)
  }, [location.pathname, year, month, day, slug])

  const headings = useMemo(
    () => (post ? extractHeadingsFromMarkdown(post.content) : []),
    [post],
  )

  const [html, setHtml] = useState('')
  const [lightbox, setLightbox] = useState<LightboxState>(null)

  useEffect(() => {
    if (!post) return
    let cancelled = false
    const base = renderMarkdown(post.content)
    highlightCodeBlocks(base)
      .then((enhanced) => {
        if (!cancelled) setHtml(enhanced)
      })
      .catch(() => {
        if (!cancelled) setHtml(base)
      })
    return () => {
      cancelled = true
    }
  }, [post])

  useEffect(() => {
    if (!post) return
    document.title = `${post.title} · xuanz的博客`
    setMetaDescription(post.description || siteConfig.description)
  }, [post])

  useEffect(() => {
    if (!html) return
    const root = document.querySelector('.markdown-body')
    if (!root) return
    const cleanup = enhanceCodeBlocks(root)
    if (siteConfig.features.mermaid) {
      renderMermaidDiagrams(root).catch(() => {
        /* mermaid optional */
      })
    }
    return cleanup
  }, [html])

  useEffect(() => {
    if (!html || !siteConfig.features.lightbox) return
    const root = document.querySelector('.markdown-body')
    if (!root) return
    const onClick = (e: Event) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const img = target.closest('img')
      if (!img || !(root as Element).contains(img)) return
      e.preventDefault()
      setLightbox({
        src: (img as HTMLImageElement).src,
        alt: (img as HTMLImageElement).alt,
      })
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [html])

  if (!post) return <NotFound />

  const { prev, next } = adjacentPosts(post)

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 sm:py-14">
      <ReadingProgressBar progress={progress} />
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
        <article ref={articleRef} className="min-w-0">
          <motion.header
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden border-b border-border pb-8"
          >
            <PostHeaderField />
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Article
              </p>
              <h1 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
                {post.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <time dateTime={post.date.toISOString()} className="font-mono text-xs">
                  {formatDate(post.date)}
                </time>
                {post.updated && post.updated.getTime() > post.date.getTime() && (
                  <span className="font-mono text-xs text-muted-foreground">
                    更新于 {formatDate(post.updated)}
                  </span>
                )}
                <span className="font-mono text-xs">
                  {post.readingMinutes} min · {post.wordCount} 字
                </span>
                <span className="flex flex-wrap gap-2">
                  {post.categories.map((c) => (
                    <Link
                      key={c}
                      to={`/categories/${encodeURIComponent(c)}/`}
                      className="chip-pill border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-all hover:border-accent hover:bg-accent/12 hover:text-accent"
                    >
                      {c}
                    </Link>
                  ))}
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      to={`/tags/${encodeURIComponent(t)}/`}
                      className="text-xs text-muted-foreground transition-colors hover:text-accent"
                    >
                      #{t}
                    </Link>
                  ))}
                </span>
              </div>
            </div>
          </motion.header>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="markdown-body mt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <CopyrightNotice path={post.path} title={post.title} />

          <ShareRow title={post.title} />
          <Reward disabled={Boolean(post.frontMatter.no_reward)} />
          <TwikooComments path={post.path} title={post.title} />

          <nav
            className="mt-14 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
            aria-label="上下篇"
          >
            {prev ? (
              <Link
                to={prev.path}
                className="group border border-border bg-card p-5 transition-all hover:border-accent hover:shadow-[0_0_22px_-14px_var(--accent)]"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  上一篇
                </span>
                <p className="mt-1 text-sm text-foreground group-hover:text-accent">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span className="border border-dashed border-border p-5 text-sm text-muted-foreground">
                没有更早的文章
              </span>
            )}
            {next ? (
              <Link
                to={next.path}
                className="group border border-border bg-card p-5 transition-all hover:border-accent hover:shadow-[0_0_22px_-14px_var(--accent)] sm:col-start-2 sm:text-right"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  下一篇
                </span>
                <p className="mt-1 text-sm text-foreground group-hover:text-accent">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span className="border border-dashed border-border p-5 text-sm text-muted-foreground sm:col-start-2">
                没有更新的文章
              </span>
            )}
          </nav>
        </article>

        <aside className="mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <div className="mb-6 flex justify-center lg:justify-start">
              <ReadingProgressRing progress={progress} />
            </div>
            <TocNav headings={headings} />
          </div>
        </aside>
      </div>

      <ImageLightbox state={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
