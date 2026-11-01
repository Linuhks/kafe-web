import type { PeakHour } from '@/lib/types'

interface PeakHoursChartProps {
  data: PeakHour[]
}

// Narrow viewBox: the SVG scales to the card (~250-340px), so text stays ~11-14px.
const VIEW_W = 280
const VIEW_H = 180
const PADDING = { top: 20, right: 8, bottom: 28, left: 8 }
const CHART_W = VIEW_W - PADDING.left - PADDING.right
const CHART_H = VIEW_H - PADDING.top - PADDING.bottom
const LABEL_EVERY_HOURS = 3

export default function PeakHoursChart({ data }: PeakHoursChartProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const countByHour = new Map(data.map((d) => [d.hour, d.orderCount]))
  const maxCount = Math.max(...hours.map((h) => countByHour.get(h) ?? 0), 1)

  const barW = CHART_W / 24
  const gap = barW * 0.25

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="w-full"
      aria-label="Pedidos por hora do dia"
    >
      <g transform={`translate(${PADDING.left}, ${PADDING.top})`}>
        {hours.map((hour) => {
          const count = countByHour.get(hour) ?? 0
          const barH = (count / maxCount) * CHART_H
          const x = hour * barW + gap / 2
          const y = CHART_H - barH
          const centerX = x + (barW - gap) / 2

          return (
            <g key={hour}>
              <rect
                x={x}
                y={y}
                width={barW - gap}
                height={barH}
                className="fill-kafe-primary"
                rx={2}
              />
              {count > 0 && (
                <text
                  x={centerX}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-kafe-on-surface"
                  fontSize={12}
                  fontWeight={600}
                >
                  {count}
                </text>
              )}
              {hour % LABEL_EVERY_HOURS === 0 && (
                <text
                  x={centerX}
                  y={CHART_H + 18}
                  textAnchor="middle"
                  className="fill-kafe-on-surface-variant"
                  fontSize={12}
                >
                  {hour}
                </text>
              )}
            </g>
          )
        })}

        <line
          x1={0}
          y1={CHART_H}
          x2={CHART_W}
          y2={CHART_H}
          className="stroke-kafe-outline-variant"
          strokeWidth={1}
        />
      </g>
    </svg>
  )
}
