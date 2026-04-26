import type { ReactNode } from 'react'

type LedgerState = 'done' | 'active' | 'future'

interface LedgerRowProps {
  date: string
  title: string
  status: LedgerState
  sub?: string
  children?: ReactNode
}

const STATUS_GLYPH: Record<LedgerState, string> = {
  done: '✓',
  active: '●',
  future: '─',
}

export default function LedgerRow({ date, title, status, sub, children }: LedgerRowProps) {
  return (
    <li className={`pv-ledger__row pv-ledger__row--${status}`}>
      <span className="pv-ledger__date">{date}</span>
      <div>
        <h3 className="pv-ledger__title">{title}</h3>
        {sub && <p className="pv-ledger__sub">{sub}</p>}
      </div>
      <span className="pv-ledger__status" aria-label={status}>{STATUS_GLYPH[status]}</span>
      {children && <div className="pv-ledger__detail">{children}</div>}
    </li>
  )
}

export function Ledger({ children }: { children: ReactNode }) {
  return <ol className="pv-ledger">{children}</ol>
}
