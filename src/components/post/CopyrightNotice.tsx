import { siteConfig } from '../../config/site'

export function CopyrightNotice({ path, title }: { path: string; title: string }) {
  if (!siteConfig.features.copyright) return null

  const base = siteConfig.url.replace(/\/+$/, '')
  const url = `${base}${path}`

  return (
    <section className="mt-8 border border-border bg-card p-5" aria-label="版权声明">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Copyright</p>
      <h2 className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
        版权声明
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        本文标题：《{title}》
        <br />
        作者：{siteConfig.author}
        <br />
        本文链接：{' '}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-accent hover:underline"
        >
          {url}
        </a>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        本站所有文章均采用{' '}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          CC BY-NC-SA 4.0
        </a>{' '}
        国际许可协议。转载请保留原文链接；商业性使用请先获得授权。
      </p>
    </section>
  )
}
