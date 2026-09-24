import { useEffect } from 'react'
import { siteConfig } from '../../config/site'

type Heart = {
  id: number
  x: number
  y: number
  scale: number
  rotate: number
}

let heartId = 0

export function ClickHearts() {
  useEffect(() => {
    if (!siteConfig.effects.clickHeart) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const layer = document.createElement('div')
    layer.className = 'click-hearts'
    layer.setAttribute('aria-hidden', 'true')
    document.body.appendChild(layer)

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest('a, button, input, textarea, select, label, [contenteditable]')) return
      if (e.button !== 0) return

      const id = heartId++
      const heart: Heart = {
        id,
        x: e.clientX,
        y: e.clientY,
        scale: 0.7 + Math.random() * 0.6,
        rotate: -20 + Math.random() * 40,
      }
      spawn(layer, heart)
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      layer.remove()
    }
  }, [])

  return null
}

function spawn(layer: HTMLElement, heart: Heart) {
  const el = document.createElement('span')
  el.className = 'click-heart'
  el.dataset.id = String(heart.id)
  el.style.left = `${heart.x}px`
  el.style.top = `${heart.y}px`
  el.style.setProperty('--hs', String(heart.scale))
  el.style.setProperty('--hr', `${heart.rotate}deg`)
  el.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 21s-6.7-4.35-9.33-8.1C.7 10.2 1.1 6.9 3.6 5.2c2.1-1.4 4.8-.9 6.4 1.1L12 8.3l2-2c1.6-2 4.3-2.5 6.4-1.1 2.5 1.7 2.9 5 .93 7.7C18.7 16.65 12 21 12 21z"/></svg>'
  layer.appendChild(el)
  window.setTimeout(() => el.remove(), 900)
}
