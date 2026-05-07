import type { PeakHour } from '@/lib/types'

interface PeakHoursChartProps {
  data: PeakHour[]
}

const VIEW_W = 960
const VIEW_H = 300
const PADDING = { top: 16, right: 16, bottom: 36, left: 40 }
const CHART_W = VIEW_W - PADDING.left - PADDING.right
const CHART_H = VIEW_H - PADDING.top - PADDING.bottom

export default function PeakHoursChart({ data }: PeakHoursChartProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const countByHour = new Map(data.map((d) => [d.hour, d.orderCount]))
  const maxCount = Math.max(...hours.map((h) => countByHour.get(h) ?? 0), 1)

  const barW = CHART_W / 24
  const gap = barW * 0.2

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

          return (
            <g key={hour}>
              <rect
                x={x}
                y={y}
                width={barW - gap}
                height={barH}
                className="fill-primary opacity-80"
                rx={2}
              />
              <text
                x={x + (barW - gap) / 2}
                y={CHART_H + 20}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
                fontSize={10}
              >
                {hour}
              </text>
            </g>
          )
        })}

        {/* y-axis baseline */}
        <line
          x1={0}
          y1={CHART_H}
          x2={CHART_W}
          y2={CHART_H}
          className="stroke-border"
          strokeWidth={1}
        />
      </g>
    </svg>
  )
}
