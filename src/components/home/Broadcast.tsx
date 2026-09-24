import { useEffect, useState } from 'react'
import { siteConfig } from '../../config/site'

type Hitokoto = {
  hitokoto?: string
  from?: string
  from_who?: string
}

export function Broadcast() {
  const [line, setLine] = useState<string | null>(null)

  useEffect(() => {
    if (!siteConfig.effects.broadcast) return
    const ctrl = new AbortController()
    fetch('https://v1.hitokoto.cn/?c=i&c=k&c=d&encode=json', {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Hitokoto | null) => {
        if (!data?.hitokoto) return
        const from = [data.from_who, data.from].filter(Boolean).join(' · ')
        setLine(from ? `${data.hitokoto} —— ${from}` : data.hitokoto)
      })
      .catch(() => {
        /* offline / blocked: stay silent */
      })
    return () => ctrl.abort()
  }, [])

  if (!siteConfig.effects.broadcast || !line) return null

  return (
    <aside
      className="mx-auto max-w-[1120px] border-b border-border px-4 py-4 sm:px-6"
      aria-label="一言"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
          Hitokoto
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">{line}</p>
      </div>
    </aside>
  )
}
