import React from 'react'
import { LabelList } from 'recharts'

// Rotated X-axis tick for long labels
export const AXIS_TICK_FONT_SIZE = 12

export const AxisTick = (props: any) => {
  const { x, y, payload } = props
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="end" transform="rotate(-35)" fontSize={AXIS_TICK_FONT_SIZE}>
        {payload?.value}
      </text>
    </g>
  )
}

// Centralized tooltip props for Recharts <Tooltip /> component
export const defaultTooltipProps = {
  wrapperStyle: { zIndex: 50 } as React.CSSProperties,
  contentStyle: {
    backgroundColor: 'rgba(17,24,39,0.95)', // gray-900 ~ opaque
    border: '1px solid #374151', // gray-700
    borderRadius: 8,
    color: '#F9FAFB', // gray-50
  } as React.CSSProperties,
  labelStyle: { color: '#D1D5DB' } as React.CSSProperties,
  itemStyle: { color: '#F9FAFB' } as React.CSSProperties,
  cursor: { fill: 'rgba(59,130,246,0.08)' }, // subtle blue selection
} as const

// Centralized chart spacing and grid styling
export const chartMargin = { top: 8, right: 16, left: 0, bottom: 48 } as const
export const gridProps = { strokeDasharray: '3 3', vertical: false } as const

// Value labels for bars (placed at top of each bar)
export function ValueLabels() {
  return (
    <LabelList dataKey="value" position="top" className="fill-gray-700 text-[11px]" />
  )
}

// Centralized axis defaults
export const xAxisDefaults = {
  interval: 0,
  height: 60,
  tickMargin: 8,
  tickLine: false,
  tick: <AxisTick />,
} as const

export const yAxisDefaults = {
  tick: { fontSize: AXIS_TICK_FONT_SIZE },
  tickLine: false,
} as const

// Centralized bar radius
export const barRadius: [number, number, number, number] = [4, 4, 0, 0]

// Optional axis label helpers
export function makeXAxisLabel(value: string, props?: any) {
  return { value, position: 'insideBottom', offset: 0, ...props }
}

export function makeYAxisLabel(value: string, props?: any) {
  return { value, angle: -90, position: 'insideLeft', offset: 10, ...props }
}

// Number formatting utility (e.g., 1.2k, 3.4M)
export function formatNumber(n: number, digits = 1): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(digits)}B`
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(digits)}M`
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(digits)}k`
  return `${n}`
}
