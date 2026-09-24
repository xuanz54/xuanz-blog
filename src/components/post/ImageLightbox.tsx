import { useEffect } from 'react'

export type LightboxState = { src: string; alt: string } | null

export function ImageLightbox({
  state,
  onClose,
}: {
  state: LightboxState
  onClose: () => void
}) {
  useEffect(() => {
    if (!state) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [state, onClose])

  if (!state) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/92 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={state.alt || '图片预览'}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center border border-border bg-card text-foreground transition-colors hover:border-accent hover:text-accent"
        aria-label="关闭图片预览"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <img
        src={state.src}
        alt={state.alt}
        className="max-h-[88vh] max-w-[92vw] border border-border object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
