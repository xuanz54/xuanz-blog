import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.SHOT_BASE || 'http://127.0.0.1:5173'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_ROOT = join(ROOT, 'docs', 'screenshots')
const W = 1440

const gitSlug = encodeURIComponent('Git的使用')
const pages = [
  { name: 'home', path: '/', h: 960, wait: 'body' },
  { name: 'post', path: `/2024/07/24/${gitSlug}/`, h: 960, wait: '.markdown-body' },
  { name: 'archives', path: '/archives/', h: 900, wait: 'li' },
  { name: 'categories', path: '/categories/', h: 900, wait: '.cat-bar, a[href*="/categories/"]' },
  { name: 'tags', path: '/tags/', h: 900, wait: 'a[href*="/tags/"]' },
  { name: 'search', path: '/search/?q=Git', h: 900, wait: 'body' },
  { name: 'about', path: '/about/', h: 900, wait: '.markdown-body, article' },
  { name: '404', path: '/no-such-page/', h: 720, wait: 'body' },
]

const themes = ['dark', 'light']

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
  defaultViewport: { width: W, height: 960, deviceScaleFactor: 1 },
})

let ok = 0
const total = pages.length * themes.length
try {
  const page = await browser.newPage()
  for (const theme of themes) {
    const out = theme === 'dark' ? OUT_ROOT : join(OUT_ROOT, theme)
    mkdirSync(out, { recursive: true })

    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
      { name: 'prefers-color-scheme', value: theme },
    ])
    await page.evaluateOnNewDocument((t) => {
      try {
        localStorage.setItem('xuanz-theme', t)
      } catch {
        /* ignore */
      }
      document.documentElement.classList.toggle('dark', t === 'dark')
    }, theme)

    for (const item of pages) {
      const file = join(out, `${item.name}.png`)
      await page.setViewport({ width: W, height: item.h, deviceScaleFactor: 1 })
      await page.goto(BASE + item.path, { waitUntil: 'networkidle0', timeout: 45000 })
      await page.evaluate((t) => {
        document.documentElement.classList.toggle('dark', t === 'dark')
        localStorage.setItem('xuanz-theme', t)
      }, theme)
      try {
        await page.waitForSelector(item.wait, { timeout: 8000 })
      } catch {
        /* keep going */
      }
      await new Promise((r) => setTimeout(r, 500))
      await page.screenshot({ path: file, type: 'png' })
      ok++
      console.log(`OK ${theme}/${item.name} ${item.path}`)
    }
  }
} finally {
  await browser.close()
}
console.log(`done ${ok}/${total}`)
