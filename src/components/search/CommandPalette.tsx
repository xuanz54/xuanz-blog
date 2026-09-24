import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { searchDocs, type SearchDoc } from '../../content'

type Cmd =
  | { kind: 'page'; id: string; label: string; path: string }
  | { kind: 'post'; id: string; label: string; path: string; doc: SearchDoc }
  | { kind: 'tag'; id: string; label: string; path: string }

function scoreDoc(doc: SearchDoc, q: string): number {
  const query = q.toLowerCase()
  const title = doc.title.toLowerCase()
  const tags = doc.tags.join(' ').toLowerCase()
  const cats = doc.categories.join(' ').toLowerCase()
  const body = (doc.body || '').toLowerCase()
  let s = 0
  if (title.includes(query)) s += 50
  if (tags.includes(query)) s += 20
  if (cats.includes(query)) s += 15
  if (body.includes(query)) s += 8
  for (const w of query.split(/\s+/).filter(Boolean)) {
    if (title.includes(w)) s += 8
    if (tags.includes(w)) s += 4
    if (body.includes(w)) s += 2
  }
  return s
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const [lastQ, setLastQ] = useState('')
  if (q !== lastQ) {
    setLastQ(q)
    setActive(0)
  }
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)
  const docs = useMemo(() => searchDocs(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        setQ('')
        setActive(0)
        return
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const items = useMemo<Cmd[]>(() => {
    const base: Cmd[] = siteConfig.nav.map((n) => ({
      kind: 'page',
      id: `nav:${n.to}`,
      label: n.label,
      path: n.to,
    }))
    base.push(
      { kind: 'page', id: 'nav:search', label: '搜索', path: '/search/' },
      { kind: 'page', id: 'home', label: '首页', path: '/' },
    )

    const query = q.trim().toLowerCase()
    if (!query) {
      const recent = docs.slice(0, 8).map((d) => ({
        kind: 'post' as const,
        id: d.path,
        label: d.title,
        path: d.path,
        doc: d,
      }))
      return [...base, ...recent]
    }

    const posts: Cmd[] = docs
      .map((d) => ({ d, s: scoreDoc(d, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map(({ d }) => ({ kind: 'post', id: d.path, label: d.title, path: d.path, doc: d }))

    const pages = base.filter((b) => b.label.toLowerCase().includes(query))

    const tagSet = new Set<string>()
    for (const d of docs) for (const t of d.tags) if (t.toLowerCase().includes(query)) tagSet.add(t)
    const tags: Cmd[] = [...tagSet].slice(0, 6).map((t) => ({
      kind: 'tag',
      id: `tag:${t}`,
      label: `#${t}`,
      path: `/tags/${encodeURIComponent(t)}/`,
    }))

    return [...pages, ...posts, ...tags]
  }, [q, docs])

  const go = (item: Cmd) => {
    setOpen(false)
    setQ('')
    navigate(item.path)
  }

  if (!open) return null

  const onKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = items[active]
      if (item) go(item)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <>
      <div
        className="cmdk-backdrop"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="命令面板"
        className="cmdk-panel"
        initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onKeyDown={onKeyNav}
      >
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="搜索文章、标签或页面…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          role="combobox"
          aria-expanded="true"
          aria-controls="cmdk-list"
          aria-activedescendant={items[active] ? `cmdk-${active}` : undefined}
          autoComplete="off"
        />
        <ul id="cmdk-list" className="cmdk-list" role="listbox">
          {items.length === 0 && <li className="cmdk-empty">没有匹配结果</li>}
          {items.map((item, i) => (
            <li
              key={item.id}
              id={`cmdk-${i}`}
              role="option"
              aria-selected={i === active}
              data-active={i === active ? 'true' : 'false'}
              className="cmdk-item"
              onMouseEnter={() => setActive(i)}
              onClick={() => go(item)}
            >
              <span className="kind">
                {item.kind === 'post' ? 'post' : item.kind === 'tag' ? 'tag' : 'nav'}
              </span>
              <span className="truncate">{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="cmdk-hint">
          <span>↑↓ 选择</span>
          <span>Enter 打开</span>
          <span>Esc 关闭</span>
          <span className="ml-auto">Ctrl/⌘ K</span>
        </div>
      </motion.div>
    </>
  )
}
