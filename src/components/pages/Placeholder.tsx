export function Placeholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-[1120px] px-4 py-20 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        Coming next
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-4 max-w-[60ch] text-muted-foreground">
        该页面将在下一阶段实现。阶段一先交付首页、Shell 与内容管线。
      </p>
    </div>
  )
}
