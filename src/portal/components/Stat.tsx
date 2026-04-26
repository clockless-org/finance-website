import { useEffect, useRef, useState } from 'react'

interface StatProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  decimals?: number
  countUp?: boolean
  format?: (n: number) => string
}

const REDUCE_MOTION = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

function formatDefault(n: number, decimals: number) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export default function Stat({ value, suffix, prefix, label, decimals = 0, countUp = true, format }: StatProps) {
  const [shown, setShown] = useState(countUp && !REDUCE_MOTION ? 0 : value)
  const ref = useRef<HTMLDivElement | null>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (!countUp || REDUCE_MOTION) {
      setShown(value)
      return
    }
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || animated.current) continue
        animated.current = true
        const start = performance.now()
        const duration = 800
        function tick(now: number) {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setShown(value * eased)
          if (t < 1) requestAnimationFrame(tick)
          else setShown(value)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [value, countUp])

  const formatted = format ? format(shown) : formatDefault(shown, decimals)

  return (
    <div className="pv-stat" ref={ref}>
      <span className="pv-stat__label">{label}</span>
      <span className="pv-stat__value">
        {prefix}{formatted}{suffix}
      </span>
    </div>
  )
}
