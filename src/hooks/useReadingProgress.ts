import { useEffect, useState } from 'react'

/** Returns 0–100 scroll progress of document (article reading progress). */
export function useReadingProgress(): number {
  const [p, setP] = useState(0)

  useEffect(() => {
    let raf = 0

    const update = () => {
      raf = 0
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop
      const height = doc.scrollHeight - doc.clientHeight
      const value = height <= 0 ? 0 : (scrollTop / height) * 100
      const next = Math.min(100, Math.max(0, Math.round(value)))
      setP((prev) => (prev === next ? prev : next))
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return p
}
