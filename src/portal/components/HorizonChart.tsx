interface HorizonChartProps {
  data: number[]
  labels?: string[]
  height?: number
  ariaLabel?: string
  /** percentage values 0–100 are expected; auto-scales otherwise */
}

/**
 * Single-color SVG horizon ribbon. Used in Holdings and on the landing
 * page as the concentration-horizon imagery.
 */
export default function HorizonChart({
  data,
  labels,
  height = 120,
  ariaLabel = 'Concentration horizon',
}: HorizonChartProps) {
  if (data.length === 0) return null

  const width = 600
  const padding = { top: 8, right: 0, bottom: 24, left: 0 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const max = Math.max(...data, 1)
  const stepX = innerW / Math.max(data.length - 1, 1)

  const points = data.map((d, i) => {
    const x = padding.left + i * stepX
    const y = padding.top + innerH - (d / max) * innerH
    return { x, y, value: d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${(padding.top + innerH).toFixed(2)} L ${points[0].x.toFixed(2)} ${(padding.top + innerH).toFixed(2)} Z`

  return (
    <svg
      className="pv-horizon"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={ariaLabel}
    >
      {/* hairline axis */}
      <line
        x1={padding.left}
        y1={padding.top + innerH}
        x2={padding.left + innerW}
        y2={padding.top + innerH}
        stroke="var(--hairline)"
        strokeWidth="1"
      />
      {/* horizon fill */}
      <path d={areaPath} fill="var(--copper)" fillOpacity="0.18" />
      {/* horizon line */}
      <path d={linePath} fill="none" stroke="var(--copper)" strokeWidth="1.5" />
      {/* end marker */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill="var(--copper)"
      />
      {labels && (
        <g>
          {labels.map((l, i) => {
            if (i % Math.ceil(labels.length / 6) !== 0 && i !== labels.length - 1) return null
            const x = padding.left + i * stepX
            return (
              <text
                key={i}
                x={x}
                y={height - 6}
                fontFamily="IBM Plex Mono, ui-monospace, monospace"
                fontSize="10"
                fill="var(--ink-quiet)"
                textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}
                letterSpacing="0.04em"
              >
                {l}
              </text>
            )
          })}
        </g>
      )}
    </svg>
  )
}

interface AllocationRingProps {
  pct: number
  size?: number
  ariaLabel?: string
}

/**
 * Single-color allocation ring. Hairline center, percentage in mono.
 */
export function AllocationRing({ pct, size = 160, ariaLabel = 'Allocation' }: AllocationRingProps) {
  const stroke = 6
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.max(0, Math.min(100, pct)) / 100)
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
      className="pv-ring"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--hairline)"
        strokeWidth="1"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--bond)"
        strokeWidth={stroke}
        strokeLinecap="butt"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2 + 6}
        textAnchor="middle"
        fontFamily="IBM Plex Mono, ui-monospace, monospace"
        fontSize={size / 5}
        fontWeight="500"
        fill="var(--ink)"
      >
        {Math.round(pct)}%
      </text>
    </svg>
  )
}
