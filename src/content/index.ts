import { parseFrontMatter } from '../lib/frontmatter'
import { excerptFromContent, makeExcerpt, stripMarkdown } from '../lib/markdown'

export type PostFrontMatter = {
  title: string
  date: string
  updated?: string
  categories?: string[] | string
  tags?: string[] | string
  description?: string
  toc?: boolean
  no_word_count?: boolean
  no_reward?: boolean
  /** Pin to top of lists */
  top?: boolean
  /** Original Chinese filename slug (Hexo :title) */
  slug?: string
  /** ASCII file basename (safe for Vite glob on Windows) */
  ascii_slug?: string
}

export type Post = {
  slug: string
  path: string
  title: string
  date: Date
  updated?: Date
  categories: string[]
  tags: string[]
  description: string
  content: string
  excerpt: string
  wordCount: number
  readingMinutes: number
  frontMatter: PostFrontMatter
}

export type Page = {
  slug: string
  title: string
  content: string
}

function toArray(value: string[] | string | undefined): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return [value]
}

function countWords(text: string): number {
  const cjk = (text.match(/[一-鿿鿿㐀-䶿]/g) ?? []).length
  const latin = (text.match(/[a-zA-Z0-9]+/g) ?? []).length
  return cjk + latin
}

function makeSlug(filePath: string): string {
  const base = filePath
    .replace(/\\/g, '/')
    .split('/')
    .pop()!
    .replace(/\.md$/, '')
  return base
}

function permalinkFrom(date: Date, slug: string): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `/${y}/${m}/${d}/${encodeURIComponent(slug)}/`
}

const rawPosts = import.meta.glob<string>('../../content/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

function parseDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date(0)
}

function buildPost(filePath: string, raw: string): Post | null {
  const { data, content } = parseFrontMatter(raw)
  if (!data.title) return null

  const date = parseDate(data.date)
  const fileSlug = makeSlug(filePath)
  const routeSlug = typeof data.slug === 'string' && data.slug ? data.slug : fileSlug
  const plain = stripMarkdown(content)
  const wordCount = data.no_word_count ? 0 : countWords(plain)
  const readingMinutes = Math.max(1, Math.round(wordCount / 300))
  const rawDesc =
    typeof data.description === 'string' && data.description.trim()
      ? data.description.trim()
      : ''
  const cleanDesc = rawDesc ? stripMarkdown(rawDesc) : ''
  const excerpt = cleanDesc
    ? makeExcerpt(cleanDesc, 200)
    : excerptFromContent(content, 160)

  return {
    slug: fileSlug,
    path: permalinkFrom(date, routeSlug),
    title: String(data.title),
    date,
    updated: data.updated ? parseDate(data.updated) : undefined,
    categories: toArray(data.categories as string[] | string | undefined),
    tags: toArray(data.tags as string[] | string | undefined),
    description: cleanDesc || excerpt,
    content,
    excerpt,
    wordCount,
    readingMinutes,
    frontMatter: data as PostFrontMatter,
  }
}

function isTop(post: Post): boolean {
  return post.frontMatter.top === true
}

function byListOrder(a: Post, b: Post): number {
  const at = isTop(a) ? 1 : 0
  const bt = isTop(b) ? 1 : 0
  if (at !== bt) return bt - at
  return b.date.getTime() - a.date.getTime()
}

export const posts: Post[] = Object.entries(rawPosts)
  .map(([filePath, raw]) => buildPost(filePath, raw))
  .filter((p): p is Post => p !== null)
  .sort(byListOrder)

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function normalizePath(pathname: string): string {
  let p = pathname.split('?')[0].split('#')[0]
  if (!p.startsWith('/')) p = `/${p}`
  if (!p.endsWith('/')) p = `${p}/`
  return p
}

export function getPostByPath(pathname: string): Post | undefined {
  const raw = normalizePath(pathname)
  const decoded = normalizePath(safeDecode(pathname))
  return posts.find(
    (p) =>
      p.path === raw ||
      p.path === pathname ||
      safeDecode(p.path) === decoded ||
      safeDecode(p.path) === safeDecode(normalizePath(pathname)),
  )
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function paginate(page: number, perPage = 10) {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * perPage
  return {
    items: posts.slice(start, start + perPage),
    page: current,
    totalPages,
    total: posts.length,
  }
}

export function allCategories(): { name: string; count: number }[] {
  const map = new Map<string, number>()
  for (const post of posts) {
    for (const c of post.categories) {
      map.set(c, (map.get(c) ?? 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'))
}

export function allTags(): { name: string; count: number }[] {
  const map = new Map<string, number>()
  for (const post of posts) {
    for (const t of post.tags) {
      map.set(t, (map.get(t) ?? 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'))
}

export function postsByYear(): { year: number; posts: Post[] }[] {
  const map = new Map<number, Post[]>()
  for (const post of posts) {
    const y = post.date.getFullYear()
    if (!map.has(y)) map.set(y, [])
    map.get(y)!.push(post)
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, posts: list }))
}

export function postsInCategory(name: string): Post[] {
  return posts.filter((p) => p.categories.includes(name))
}

export function postsWithTag(name: string): Post[] {
  return posts.filter((p) => p.tags.includes(name))
}

export function adjacentPosts(current: Post): { prev?: Post; next?: Post } {
  const idx = posts.findIndex((p) => p.slug === current.slug)
  return {
    // posts are sorted newest first; "上一篇" = newer, "下一篇" = older
    prev: idx > 0 ? posts[idx - 1] : undefined,
    next: idx < posts.length - 1 ? posts[idx + 1] : undefined,
  }
}

const aboutModules = import.meta.glob<string>('../../content/about/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

export function getAboutContent(): string | null {
  const entry = Object.values(aboutModules)[0]
  if (!entry) return null
  const { content } = parseFrontMatter(entry)
  return content
}

export function getAboutTitle(): string {
  const entry = Object.values(aboutModules)[0]
  if (!entry) return '关于'
  const { data } = parseFrontMatter(entry)
  return String(data.title ?? '关于我')
}

export type SearchDoc = {
  title: string
  path: string
  excerpt: string
  categories: string[]
  tags: string[]
  body: string
}

export function searchDocs(): SearchDoc[] {
  return posts.map((p) => ({
    title: p.title,
    path: p.path,
    excerpt: p.excerpt,
    categories: p.categories,
    tags: p.tags,
    body: stripMarkdown(p.content).slice(0, 4000),
  }))
}
