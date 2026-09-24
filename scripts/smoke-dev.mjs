const base = 'http://localhost:5173'

const idx = await fetch(base + '/src/content/index.ts').then((r) => r.text())
const imports = [...idx.matchAll(/from "(\/content\/posts\/[^"]+)"/g)].map((m) => m[1])
console.log('imports', imports.length)

let ok = 0
let bad = 0
for (const p of imports) {
  const res = await fetch(base + p)
  const text = await res.text()
  if (text.startsWith('export default')) ok++
  else {
    bad++
    console.log('BAD', p, text.slice(0, 60))
  }
}
console.log({ ok, bad })

const critical = [
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/components/layout/Layout.tsx',
  '/src/components/home/HomePage.tsx',
  '/src/content/index.ts',
  '/src/styles/index.css',
  '/content/about/index.md?import&raw',
]
for (const u of critical) {
  const res = await fetch(base + u)
  const t = await res.text()
  const isHtml = t.startsWith('<!doctype')
  console.log(res.status, isHtml ? 'HTML' : 'mod', u, t.length)
}

// sample chinese integrity
const sample = await fetch(base + '/content/posts/post-20240724-bfe794a8.md?import&raw').then((r) => r.text())
console.log('git sample has CJK', /[一-鿿]/.test(sample), sample.slice(0, 80))
