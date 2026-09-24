import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const postsDir = path.join(root, 'content', 'posts')

function asciiSlug(title, date) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
  if (base.length >= 4) return base
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hash = Buffer.from(title, 'utf8')
    .toString('hex')
    .slice(-8)
  return `post-${y}${m}${d}-${hash}`
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))
const used = new Set()
const manifest = []

for (const file of files) {
  const full = path.join(postsDir, file)
  const raw = fs.readFileSync(full, 'utf8')
  const { data, content } = matter(raw)
  const title = String(data.title || file.replace(/\.md$/, ''))
  const date = data.date ? new Date(data.date) : new Date(0)
  const chineseSlug = file.replace(/\.md$/, '')

  let slug = asciiSlug(title, date)
  while (used.has(slug)) {
    slug = `${slug}-x`
  }
  used.add(slug)

  const next = matter.stringify(content, {
    ...data,
    title,
    slug: chineseSlug,
    ascii_slug: slug,
  })

  const nextFile = `${slug}.md`
  fs.writeFileSync(path.join(postsDir, nextFile), next, 'utf8')
  if (nextFile !== file) {
    fs.unlinkSync(full)
  }

  manifest.push({
    file: nextFile,
    title,
    chineseSlug,
    asciiSlug: slug,
    date: date.toISOString(),
  })
}

fs.writeFileSync(
  path.join(root, 'content', 'posts.manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf8',
)

console.log(`renamed ${manifest.length} posts`)
console.log(manifest.slice(0, 5))
