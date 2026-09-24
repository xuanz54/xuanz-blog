import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const postsDir = path.join(root, 'content', 'posts')
const SITE = 'https://xuanz54.github.io'
const PER_PAGE = 10

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function permalink(date, slug) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `/${y}/${m}/${d}/${encodeURIComponent(slug)}/`
}

async function loadPosts() {
  const files = (await readdir(postsDir)).filter((f) => f.endsWith('.md'))
  const posts = []
  for (const file of files) {
    const raw = await readFile(path.join(postsDir, file), 'utf8')
    const { data } = matter(raw)
    if (!data.title || !data.date) continue
    const date = new Date(data.date)
    if (Number.isNaN(date.getTime())) continue
    const slug = typeof data.slug === 'string' && data.slug ? data.slug : file.replace(/\.md$/, '')
    posts.push({
      title: String(data.title),
      date,
      path: permalink(date, slug),
      description: data.description ? String(data.description) : '',
    })
  }
  posts.sort((a, b) => b.date.getTime() - a.date.getTime())
  return posts
}

function buildSitemap(posts) {
  const staticPaths = [
    '/',
    '/archives/',
    '/categories/',
    '/tags/',
    '/about/',
    '/search/',
  ]
  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE))
  const pagePaths = []
  for (let i = 2; i <= totalPages; i++) pagePaths.push(`/page/${i}/`)
  const urls = [...staticPaths, ...pagePaths, ...posts.map((p) => p.path)]
  const body = urls
    .map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

function buildAtom(posts) {
  const latest = posts.slice(0, 20)
  const updated = (latest[0]?.date ?? new Date()).toISOString()
  const entries = latest
    .map((p) => {
      const loc = `${SITE}${p.path}`
      return `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${escapeXml(loc)}" rel="alternate" type="text/html"/>
    <id>${escapeXml(loc)}</id>
    <updated>${p.date.toISOString()}</updated>
    <summary>${escapeXml(p.description)}</summary>
  </entry>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>xuanz的博客</title>
  <subtitle>一个啥都写的个人博客</subtitle>
  <id>${SITE}/</id>
  <link href="${SITE}/" rel="alternate" type="text/html"/>
  <link href="${SITE}/atom.xml" rel="self" type="application/atom+xml"/>
  <updated>${updated}</updated>
  <author>
    <name>CodeBardPro</name>
  </author>
${entries}
</feed>
`
}

async function main() {
  await mkdir(dist, { recursive: true })
  const posts = await loadPosts()
  const sitemap = buildSitemap(posts)
  const atom = buildAtom(posts)
  await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8')
  await writeFile(path.join(dist, 'atom.xml'), atom, 'utf8')
  await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'))
  console.log(
    `SEO done: sitemap ${posts.length} posts, atom ${Math.min(20, posts.length)} entries, 404.html`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
