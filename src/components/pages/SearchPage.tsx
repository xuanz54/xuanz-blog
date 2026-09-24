import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchDocs, type SearchDoc } from '../../content'

function scoreDoc(doc: SearchDoc, q: string): number {
  const query = q.toLowerCase()
  const title = doc.title.toLowerCase()
  const excerpt = doc.excerpt.toLowerCase()
  const tags = doc.tags.join(' ').toLowerCase()
  const cats = doc.categories.join(' ').toLowerCase()
  const body = (doc.body || '').toLowerCase()

  let score = 0
  if (title === query) score += 100
  if (title.includes(query)) score += 50
  if (tags.includes(query)) score += 20
  if (cats.includes(query)) score += 15
  if (excerpt.includes(query)) score += 10
  if (body.includes(query)) score += 8

  const words = query.split(/\s+/).filter(Boolean)
  for (const w of words) {
    if (title.includes(w)) score += 8
    if (excerpt.includes(w)) score += 3
    if (tags.includes(w)) score += 4
    if (body.includes(w)) score += 2
  }
  return score
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const q = query.trim()
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-accent/20 text-foreground">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  )
}

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const queryParam = (params.get('q') ?? '').trim()
  // Sync draft when URL q changes (e.g. back/forward). Keyboard typing stays local.
  const [draft, setDraft] = useState(queryParam)
  const [lastParam, setLastParam] = useState(queryParam)
  if (queryParam !== lastParam) {
    setLastParam(queryParam)
    setDraft(queryParam)
  }
  const debounceRef = useRef<number | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = '搜索 · xuanz的博客'
    inputRef.current?.focus()
  }, [])

  const docs = useMemo(() => searchDocs(), [])

  // Live suggestions: debounce URL update so shareable link stays clean while typing.
  useEffect(() => {
    const next = draft.trim()
    if (next === queryParam) return
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      setParams(next ? { q: next } : {}, { replace: true })
    }, 150)
    return () => window.clearTimeout(debounceRef.current)
  }, [draft, queryParam, setParams])

  const query = draft.trim() || queryParam

  const results = useMemo(() => {
    if (!query) return []
    return docs
      .map((d) => ({ d, s: scoreDoc(d, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.d)
      .slice(0, 30)
  }, [docs, query])

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Search</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">搜索</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          实时联想 · 快捷键 <kbd className="font-mono text-[11px]">Ctrl/⌘ K</kbd> 打开命令面板
        </p>
      </header>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault()
          const next = draft.trim()
          setParams(next ? { q: next } : {})
        }}
        role="search"
      >
        <label htmlFor="search-input" className="sr-only">
          搜索文章
        </label>
        <div className="flex">
          <input
            id="search-input"
            ref={inputRef}
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="输入关键词…"
            className="min-h-12 flex-1 border border-border bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-accent"
            autoComplete="off"
          />
          <button
            type="submit"
            className="uiverse-btn uiverse-btn--shine min-h-12 cursor-pointer bg-accent px-5 text-sm font-medium text-on-accent transition-all hover:bg-accent-hover hover:shadow-[0_0_22px_-8px_var(--accent)]"
          >
            搜索
          </button>
        </div>
      </form>

      <div className="mt-8" aria-live="polite">
        {!query && (
          <p className="text-sm text-muted-foreground">
            输入标题、标签或正文关键词开始搜索。
          </p>
        )}
        {query && results.length === 0 && (
          <p className="text-sm text-muted-foreground">没有找到「{query}」相关文章。</p>
        )}
        {results.length > 0 && (
          <>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {results.length} results
            </p>
            <ul>
              {results.map((doc) => (
                <li key={doc.path} className="border-b border-border">
                  <Link to={doc.path} className="group block py-4">
                    <h2 className="text-[17px] text-foreground transition-colors group-hover:text-accent">
                      <Highlight text={doc.title} query={query} />
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      <Highlight text={doc.excerpt} query={query} />
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doc.categories.map((c) => (
                        <span key={c} className="font-mono text-[11px] text-muted-foreground">
                          {c}
                        </span>
                      ))}
                      {doc.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
