export async function renderMermaidDiagrams(root: ParentNode): Promise<void> {
  const nodes = [...root.querySelectorAll<HTMLElement>('div.mermaid, pre.mermaid')]
  if (!nodes.length) return

  const mod = await import('mermaid')
  const mermaid = mod.default
  const isDark = document.documentElement.classList.contains('dark')
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'neutral',
    securityLevel: 'strict',
    fontFamily: 'ui-monospace, JetBrains Mono, monospace',
  })

  for (const [i, el] of nodes.entries()) {
    if (el.dataset.rendered === '1') continue
    const code = (el.textContent ?? '').trim()
    if (!code) continue
    try {
      const id = `mermaid-${i}-${Math.random().toString(36).slice(2, 8)}`
      const { svg } = await mermaid.render(id, code)
      el.innerHTML = svg
      el.dataset.rendered = '1'
      el.classList.add('mermaid-rendered')
    } catch {
      /* keep source text as fallback */
    }
  }
}
