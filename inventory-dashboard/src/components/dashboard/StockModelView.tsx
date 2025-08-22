'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { ChartColors } from './chartTheme'
import {
  defaultTooltipProps,
  chartMargin,
  gridProps,
  ValueLabels,
  xAxisDefaults,
  yAxisDefaults,
  barRadius,
  makeYAxisLabel,
  formatNumber,
} from './chartStyles'
import { ChartLegendContent } from './ChartLegend'

interface DataPoint {
  name: string
  value: number
}

export default function StockModelView() {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch('http://127.0.0.1:8000/getStockModelView', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()

        let transformed: DataPoint[] = []
        if (Array.isArray(json)) {
          if (json.length && typeof json[0] === 'object') {
            transformed = json
              .map((it: any) => ({
                name: String(it.name ?? it.key ?? it.x ?? ''),
                value: Number(it.value ?? it.y ?? 0),
              }))
              .filter((d) => d.name)
          }
        } else if (json && typeof json === 'object') {
          transformed = Object.entries(json).map(([k, v]) => ({
            name: String(k),
            value: Number((v as any) ?? 0),
          }))
        }

        setData(transformed)
      } catch (e) {
        console.error('Failed to load stock model view', e)
        setError('Failed to load stock model view')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading)
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    )

  if (error)
    return (
      <div className="h-full w-full flex items-center justify-center text-red-500 text-sm">
        {error}
      </div>
    )

  if (!data.length)
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
        No data
      </div>
    )

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={chartMargin}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="name" {...xAxisDefaults} />
        <YAxis {...yAxisDefaults} label={makeYAxisLabel('Count')} tickFormatter={(v) => formatNumber(Number(v))} />
        <Legend align="right" verticalAlign="top" content={() => (
          <ChartLegendContent items={[{ label: 'Stock', color: ChartColors.stock }]} />
        )} />
        <Tooltip {...defaultTooltipProps} formatter={(v) => formatNumber(Number(v))} />
        <Bar dataKey="value" fill={ChartColors.stock} radius={barRadius}>
          <ValueLabels />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
