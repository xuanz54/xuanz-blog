export function ReadingProgressRing({ progress }: { progress: number }) {
  const pct = Math.round(progress)
  return (
    <div
      className="read-ring relative"
      style={{ ['--p' as string]: String(pct) }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="阅读进度"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="25"
          fill="none"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <circle
          className="progress"
          cx="32"
          cy="32"
          r="25"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="butt"
        />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] tabular-nums text-foreground">
        {pct}%
      </span>
    </div>
  )
}

/** Top-of-viewport reading bar (fixed, article only). */
export function ReadingProgressBar({ progress }: { progress: number }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-16 z-30 h-0.5"
      aria-hidden="true"
    >
      <div
        className="h-full bg-accent transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
