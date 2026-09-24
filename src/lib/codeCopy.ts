const COPY_LABEL = '复制'
const COPIED_LABEL = '已复制'

export function enhanceCodeBlocks(root: ParentNode): () => void {
  const blocks = Array.from(root.querySelectorAll('pre'))
  const cleanups: Array<() => void> = []

  for (const pre of blocks) {
    if (pre.closest('[data-copy-enhanced]')) continue
    pre.setAttribute('data-copy-enhanced', '1')

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'code-copy-btn'
    btn.textContent = COPY_LABEL
    btn.setAttribute('aria-label', '复制代码')

    const onClick = async () => {
      const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? ''
      try {
        await navigator.clipboard.writeText(code)
        btn.textContent = COPIED_LABEL
        btn.classList.add('is-copied')
        window.setTimeout(() => {
          btn.textContent = COPY_LABEL
          btn.classList.remove('is-copied')
        }, 1600)
      } catch {
        btn.textContent = '失败'
        window.setTimeout(() => {
          btn.textContent = COPY_LABEL
        }, 1200)
      }
    }

    btn.addEventListener('click', onClick)
    pre.classList.add('has-copy')
    pre.appendChild(btn)
    cleanups.push(() => {
      btn.removeEventListener('click', onClick)
      btn.remove()
      pre.classList.remove('has-copy')
      pre.removeAttribute('data-copy-enhanced')
    })
  }

  return () => {
    for (const fn of cleanups) fn()
  }
}
