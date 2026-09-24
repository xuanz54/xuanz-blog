import { useEffect, useRef } from 'react'
import { siteConfig } from '../../config/site'

export function TwikooComments({ path, title }: { path: string; title: string }) {
  const envId = siteConfig.comments.twikooEnvId
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!envId || !boxRef.current) return
    let cancelled = false

    const ensureScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.twikoo) {
          resolve()
          return
        }
        const existing = document.querySelector<HTMLScriptElement>('script[data-twikoo]')
        if (existing) {
          existing.addEventListener('load', () => resolve(), { once: true })
          return
        }
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.51/dist/twikoo.all.min.js'
        s.defer = true
        s.dataset.twikoo = '1'
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('twikoo load failed'))
        document.head.appendChild(s)
      })

    ensureScript()
      .then(() => {
        if (cancelled || !boxRef.current || !window.twikoo) return
        window.twikoo.init({
          envId,
          el: boxRef.current,
          path,
          lang: 'zh-CN',
})
      })
      .catch(() => {
        /* placeholder remains */
      })

    return () => {
      cancelled = true
    }
  }, [envId, path])

  if (!envId) {
    return (
      <section className="mt-10 border border-dashed border-border bg-muted/40 p-6" aria-label="评论">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Comments</p>
        <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">评论</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Twikoo 开关已就绪，但尚未配置 <code className="border border-border bg-card px-1">envId</code>
          。部署 Twikoo 后端并填入环境 ID 即可启用本页评论。
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          当前文章：{title}
        </p>
      </section>
    )
  }

  return (
    <section className="mt-10" aria-label="评论">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Comments</p>
      <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">评论</h2>
      <div ref={boxRef} id="tikoo" className="mt-4" />
    </section>
  )
}

declare global {
  interface Window {
    twikoo?: {
      init: (options: Record<string, unknown>) => void
    }
  }
}
