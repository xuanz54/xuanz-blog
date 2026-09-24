# DESIGN.md — Xuanz Blog

> Overrides `design-system/xuanz-blog/MASTER.md` where they conflict.
> Sources: taste-skill (anti-slop) + ui-ux-pro-max.

## Design Read

Reading this as: personal tech-notes blog in a **dark magazine / black-gold editorial** language — near-black ink ground, warm white type, single amber-gold accent, Playfair Display display + Source Serif 4 body, hairline gold rules, sharp (radius 0) cards. Light mode is warm paper, not cool mist. Hero shader stays RibbonField (single layer, gold hue).

## Dials

- `DESIGN_VARIANCE: 7`
- `MOTION_INTENSITY: 6`（单层 hero shader、hover micro、路由淡入；无无限 CSS 动画）
- `VISUAL_DENSITY: 3`

## Palette (lock)

| Token | Dark | Light | Use |
|-------|------|-------|-----|
| `--background` | `#0A0A09` | `#F7F3EB` | page ground |
| `--foreground` | `#F5F0E6` | `#1C1917` | body ink |
| `--card` | `#141311` | `#FFFDF8` | surfaces |
| `--border` | `#2E2A24` | `#E7E0D4` | hairlines |
| `--muted-foreground` | `#A8A29E` | `#57534E` | meta text |
| `--accent` | `#E8B84B` | `#A16207` | single gold accent |
| `--accent-hover` | `#F0D078` | `#854D0E` | hover |

- One accent only (gold/amber). No AI purple/pink/teal gradients.
- Page ground: static faint **amber** radial glows (`--page-gradient`), no animation.
- Gold hairlines: section borders may mix accent 25–40% into `--border`.
- Surface classes: `.glass` / `.glass-strong` / `.glass-flat` are **solid editorial cards** (no heavy blur); `.glass-header` keeps light blur for sticky bar only.

## Typography

- Display: **Playfair Display Variable** (magazine) for Latin headings; Chinese headings fall back to `"Noto Serif SC", "Songti SC", "Source Han Serif SC"`.
- Body: **Source Serif 4 Variable** + same Chinese serif stack.
- Mono labels (dates, tags): `ui-monospace, "JetBrains Mono", monospace`, uppercase, tracking `0.14em`, 11–12px.
- Body 16–17px / line-height 1.8 for Chinese; measure ~65ch.
- No Inter. No Outfit / Work Sans / Newsreader / Public Sans / Fraunces.

## Shape

- Cards / panels / images: **`radius 0`** (print editorial).
- Buttons: rectangular `radius 0`, solid accent or hairline outline.
- Hairline borders over drop shadows; gold-tinted rules under headers/TOC.
- Optional micro gold glow on hover (`box-shadow` amber), not rounded pills.

## Motion

- Use `motion/react` only. No raw scroll listeners (except existing passive scroll UI flags).
- Reveal: opacity + y 16–24px, 0.55–0.75s, ease `[0.16, 1, 0.3, 1]`, stagger 55ms.
- Respect `prefers-reduced-motion`（点击爱心、shader、路由动画、命令面板动效均跳过）.
- Hero 仅 1 层 **RibbonFieldBackground** shader（`hue: 42` gold 调），单层 opacity ≤ 0.4，文字区始终有 scrim。
- 文章页 header 只保留静态 scrim，不铺 shader。
- 页脚不铺 shader（静态 footer-glow）。
- 每屏并行 shader ≤ 1 层；统一懒加载 `import('@designcodeio/threeui/components/...')`。
- Backdrop-blur 仅限 sticky header / cmdk 遮罩；禁止全页 blur 层叠。
- 无无限循环 CSS 动画（shimmer / pulse / 扫光移除）；无高频 setState 打字机。
- Button hover lift / theme icon rotate 为允许的 micro-interaction（仅 hover 触发）。
- Route change: light fade+y8 via `RouteFade`。

## Anti-slop checklist (pre-ship)

- [ ] No emoji as icons
- [ ] ≤1 eyebrow per 3 sections
- [ ] Left-aligned hero (not centered)
- [ ] Contrast ≥ 4.5:1 body
- [ ] Focus rings visible
- [ ] 375 / 768 / 1024 / 1440 OK
- [ ] Dark + Light both warm paper/black-gold coherent
- [ ] Cards radius 0; gold hairlines present
- [ ] No duplicate CTA intent
- [ ] No em-dash flourishes in UI copy
- [ ] Click hearts / command palette respect reduced-motion
- [ ] Reward images fallback if missing
- [ ] Code copy button keyboard reachable
- [ ] ≤1 WebGL layer per viewport
