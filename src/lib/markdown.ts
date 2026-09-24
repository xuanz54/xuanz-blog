import { marked, type Tokens } from 'marked'
import type { ShikiTransformer } from 'shiki'

export type Heading = {
  id: string
  text: string
  depth: number
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function uniqueIds(headings: Heading[]): Heading[] {
  const seen = new Map<string, number>()
  return headings.map((h) => {
    const n = seen.get(h.id) ?? 0
    seen.set(h.id, n + 1)
    if (n === 0) return h
    return { ...h, id: `${h.id}-${n}` }
  })
}

export function extractHeadingsFromMarkdown(md: string): Heading[] {
  const headings: Heading[] = []
  const lines = md.split(/\r?\n/)
  let inFence = false

  for (const line of lines) {
    if (/^```/.test(line) || /^~~~/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = line.match(/^(#{1,6})\s+(.+)$/)
    if (!m) continue
    const depth = m[1].length
    if (depth < 2 || depth > 4) continue
    const text = m[2]
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .trim()
    if (!text) continue
    headings.push({ id: slugify(text), text, depth })
  }

  return uniqueIds(headings)
}

marked.setOptions({ gfm: true, breaks: false })

const renderer = new marked.Renderer()

renderer.heading = function ({ tokens, depth }: Tokens.Heading) {
  const inline = this.parser.parseInline(tokens)
  const plain = inline.replace(/<[^>]+>/g, '')
  const id = slugify(plain)
  return `<h${depth} id="${id}">${inline}</h${depth}>`
}

renderer.code = function ({ text, lang }: Tokens.Code) {
  const language = (lang || '').trim().split(/\s+/)[0] || 'text'
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<pre class="shiki-host" data-lang="${language}"><code>${escaped}</code></pre>`
}

renderer.image = function ({ href, title, text }: Tokens.Image) {
  const src = href ?? ''
  const alt = text ?? ''
  const t = title ? ` title="${title}"` : ''
  return `<img src="${src}" alt="${alt}"${t} loading="lazy" />`
}

renderer.link = function ({ href, title, tokens }: Tokens.Link) {
  const text = this.parser.parseInline(tokens)
  const url = href ?? ''
  const t = title ? ` title="${title}"` : ''
  const isExternal = /^https?:\/\//i.test(url)
  if (isExternal) {
    return `<a href="${url}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`
  }
  return `<a href="${url}"${t}>${text}</a>`
}

marked.use({ renderer })

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string
}

type HighlighterInstance = Awaited<ReturnType<typeof import('shiki').createHighlighter>>

let highlighterPromise: Promise<HighlighterInstance> | null = null

export async function getHighlighter(): Promise<HighlighterInstance> {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then((mod) =>
      mod.createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: [
          'javascript',
          'typescript',
          'jsx',
          'tsx',
          'json',
          'bash',
          'shell',
          'python',
          'java',
          'sql',
          'html',
          'css',
          'yaml',
          'markdown',
          'diff',
          'ini',
          'docker',
          'nginx',
          'c',
          'cpp',
          'go',
          'rust',
          'text',
        ],
      }),
    )
  }
  return highlighterPromise
}

const transformers: ShikiTransformer[] = [
  {
    pre(node) {
      this.addClassToHast(node, 'shiki-block')
    },
  },
]

export async function highlightCodeBlocks(html: string): Promise<string> {
  if (!html.includes('shiki-host')) return html

  const highlighter = await getHighlighter()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const blocks = doc.querySelectorAll('pre.shiki-host')

  for (const pre of blocks) {
    const codeEl = pre.querySelector('code')
    if (!codeEl) continue
    const raw = codeEl.textContent ?? ''
    const lang = pre.getAttribute('data-lang') || 'text'
    const langs = highlighter.getLoadedLanguages()
    const useLang = langs.includes(lang) ? lang : 'text'
    const isDark = document.documentElement.classList.contains('dark')
    const highlighted = highlighter.codeToHtml(raw, {
      lang: useLang,
      theme: isDark ? 'github-dark' : 'github-light',
      transformers,
    })
    const wrapper = doc.createElement('div')
    wrapper.innerHTML = highlighted
    pre.replaceWith(wrapper.firstElementChild ?? pre)
  }

  return doc.body.innerHTML
}

export function enhanceHeadings(html: string): string {
  return html
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/^﻿/, '')
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>\n]+>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/^\s{0,3}\d+\.\s+/gm, '')
    .replace(/^\s{0,3}(\*\*\*|---|___)\s*$/gm, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(?<![\w一-鿿])_([^_\n]+)_(?![\w一-鿿])/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

export function makeExcerpt(source: string, max = 160): string {
  const plain = stripMarkdown(source)
  if (plain.length <= max) return plain

  const cut = plain.slice(0, max)
  const lastStop = Math.max(
    cut.lastIndexOf('。'),
    cut.lastIndexOf('！'),
    cut.lastIndexOf('？'),
    cut.lastIndexOf('；'),
    cut.lastIndexOf('.'),
    cut.lastIndexOf('?'),
    cut.lastIndexOf(' '),
  )
  if (lastStop >= Math.floor(max * 0.45)) {
    return `${cut.slice(0, lastStop + 1).trim()}…`
  }
  return `${cut.trim()}…`
}

/** Prefer intro paragraphs before the first heading when auto-generating an excerpt. */
export function excerptFromContent(content: string, max = 160): string {
  const beforeHeading = content.replace(/\n\s{0,3}#{1,6}\s+[\s\S]*$/, '')
  return makeExcerpt(beforeHeading, max)
}

export function stripMarkdownForSearch(md: string): string {
  return stripMarkdown(md)
}
