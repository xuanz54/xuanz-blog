export type FrontMatter = Record<string, unknown>

function parseScalar(raw: string): unknown {
  const value = raw.trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null' || value === '~') return null
  if (value !== '' && !Number.isNaN(Number(value))) return Number(value)
  if (/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?)?/.test(value)) {
    return value
  }
  return value
}

function splitTopLevel(input: string, sep: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quote: string | null = null
  let buf = ''
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      buf += ch
      if (ch === quote && input[i - 1] !== '\\') quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      buf += ch
      continue
    }
    if (ch === '[' || ch === '{') depth++
    if (ch === ']' || ch === '}') depth--
    if (depth === 0 && input.startsWith(sep, i)) {
      parts.push(buf)
      buf = ''
      i += sep.length - 1
      continue
    }
    buf += ch
  }
  parts.push(buf)
  return parts
}

function parseFlowArray(raw: string): unknown[] {
  const inner = raw.trim().slice(1, -1).trim()
  if (!inner) return []
  return splitTopLevel(inner, ',').map((p) => parseScalar(p))
}

function parseBlock(lines: string[], startIndex: number): { value: unknown; next: number } {
  const first = lines[startIndex]
  const listMatch = first.match(/^(\s*)-\s+(.*)$/)
  if (listMatch) {
    const indent = listMatch[1].length
    const items: unknown[] = []
    let i = startIndex
    while (i < lines.length) {
      const line = lines[i]
      if (!line.trim()) {
        i++
        continue
      }
      const m = line.match(/^(\s*)-\s*(.*)$/)
      if (!m || m[1].length !== indent) break
      const rest = m[2]
      if (rest === '') {
        items.push('')
        i++
        continue
      }
      // nested object in list item not needed for this blog
      items.push(parseScalar(rest))
      i++
    }
    return { value: items, next: i }
  }

  // nested map not needed beyond one level for this content
  return { value: parseScalar(first.trim()), next: startIndex + 1 }
}

export function parseFrontMatter(source: string): {
  data: FrontMatter
  content: string
} {
  const text = source.replace(/^﻿/, '')
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { data: {}, content: text }
  }

  const yaml = match[1]
  const content = match[2]
  const lines = yaml.split(/\r?\n/)
  const data: FrontMatter = {}

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith('#')) {
      i++
      continue
    }

    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!kv) {
      i++
      continue
    }

    const key = kv[1]
    const rest = kv[2]

    if (rest === '') {
      // maybe list or nested block on following lines
      let j = i + 1
      while (j < lines.length && (!lines[j].trim() || /^\s/.test(lines[j]))) {
        if (lines[j].trim()) break
        j++
      }
      if (j < lines.length && /^\s+/.test(lines[j])) {
        const { value, next } = parseBlock(lines, j)
        data[key] = value
        i = next
        continue
      }
      data[key] = ''
      i++
      continue
    }

    if (rest.startsWith('[')) {
      data[key] = parseFlowArray(rest)
      i++
      continue
    }

    data[key] = parseScalar(rest)
    i++
  }

  return { data, content }
}
