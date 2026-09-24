import { useEffect, useMemo } from 'react'
import { getAboutContent } from '../../content'
import { renderMarkdown } from '../../lib/markdown'

export function AboutPage() {
  const raw = getAboutContent() ?? ''
  const html = useMemo(() => renderMarkdown(raw), [raw])

  useEffect(() => {
    document.title = '关于 · xuanz的博客'
  }, [raw])

  const headings = useMemo(() => {
    const matches = [...raw.matchAll(/^(#{1,3})\s+(.+)$/gm)]
    return matches.map((m) => {
      const depth = m[1].length
      const text = m[2].replace(/`/g, '').replace(/\*\*/g, '').trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w一-鿿]+/g, '-')
        .replace(/^-+|-+$/g, '')
      return { id, text, depth }
    })
  }, [raw])

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 sm:py-16">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
        <article className="min-w-0">
          <header className="border-b border-border pb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">About</p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">关于</h1>
          </header>
          <div className="markdown-body mt-8" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <aside className="mt-10 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <nav aria-label="页面目录" className="toc">
              <p className="toc-title">目录</p>
              <ol className="toc-list">
                {headings
                  .filter((h) => h.depth >= 2)
                  .map((h) => (
                    <li
                      key={h.id}
                      className={h.depth === 3 ? 'toc-h3' : 'toc-h2'}
                    >
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
              </ol>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  )
}
