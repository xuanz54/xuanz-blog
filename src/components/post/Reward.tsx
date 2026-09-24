import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { siteConfig } from '../../config/site'

export function Reward({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!siteConfig.reward.enabled || disabled) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="uiverse-btn uiverse-btn--outline mt-10 inline-flex min-h-11 cursor-pointer items-center gap-2 border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s-7-4.5-9.5-8.5C.8 9.5 1.5 6 4.5 4.5 7 3.2 10 4.2 12 6.5c2-2.3 5-3.3 7.5-2 3 1.5 3.7 5 2 8C19 16.5 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        打赏作者
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="打赏作者"
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-foreground/45 backdrop-blur-[2px]"
              aria-label="关闭打赏"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md border border-accent/35 bg-card p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Reward</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">请作者喝杯咖啡</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-accent"
                  aria-label="关闭"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <RewardPanel label="支付宝" src={siteConfig.reward.alipay} tone="#1677ff" />
                <RewardPanel label="微信支付" src={siteConfig.reward.wechat} tone="#07c160" />
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                感谢支持 · 扫码即可请作者喝一杯
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function RewardPanel({ label, src, tone }: { label: string; src: string; tone: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="border border-border bg-muted p-3 text-center">
      <div className="mb-2 inline-flex items-center gap-1.5">
        <span className="h-2 w-2" style={{ background: tone }} aria-hidden="true" />
        <span className="font-mono text-[11px] tracking-wide text-muted-foreground">{label}</span>
      </div>
      <div className="mx-auto flex aspect-square w-full max-w-[140px] items-center justify-center border border-dashed border-border bg-card">
        {failed ? (
          <div className="p-3 text-center">
            <p className="text-xs text-muted-foreground">二维码待配置</p>
            <p className="mt-1 font-mono text-[10px] break-all text-muted-foreground/70">{src}</p>
          </div>
        ) : (
          <img
            src={src}
            alt={`${label}收款码`}
            className="h-full w-full object-contain p-2"
            onError={() => setFailed(true)}
            loading="lazy"
          />
        )}
      </div>
    </div>
  )
}
