import { useEffect, useState } from 'react'
import { siteConfig } from '../../config/site'

type ShareItem = {
  key: string
  label: string
  href: (ctx: ShareCtx) => string
}

type ShareCtx = {
  url: string
  title: string
  summary: string
}

function currentCtx(title?: string): ShareCtx {
  return {
    url: typeof window === 'undefined' ? siteConfig.url : window.location.href,
    title: title ? `${title} · ${siteConfig.title}` : siteConfig.title,
    summary: siteConfig.description,
  }
}

const items: ShareItem[] = [
  {
    key: 'weibo',
    label: '微博',
    href: (c) =>
      `https://service.weibo.com/share/share.php?url=${encodeURIComponent(c.url)}&title=${encodeURIComponent(c.title)}`,
  },
  {
    key: 'twitter',
    label: 'X',
    href: (c) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(c.url)}&text=${encodeURIComponent(c.title)}`,
  },
  {
    key: 'qq',
    label: 'QQ',
    href: (c) =>
      `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(c.url)}&title=${encodeURIComponent(c.title)}&summary=${encodeURIComponent(c.summary)}`,
  },
  {
    key: 'douban',
    label: '豆瓣',
    href: (c) =>
      `https://shuo.douban.com/j/service/share/link?href=${encodeURIComponent(c.url)}&name=${encodeURIComponent(c.title)}`,
  },
]

export function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border pt-6">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        Share
      </span>
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href(currentCtx(title))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {item.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="uiverse-btn inline-flex min-h-9 cursor-pointer items-center border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
      >
        {copied ? '已复制链接' : '复制链接'}
      </button>
    </div>
  )
}
