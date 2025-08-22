import React from 'react'
import { ChartPalette } from './chartTheme'

export type LegendItem = { label: string; color: string }

export function ChartLegendContent({ items }: { items: LegendItem[] }) {
  return (
    <div className="flex items-center justify-end gap-4 pr-2 pt-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2 text-xs text-gray-700">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: it.color }}
          />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ChartLegendFromPalette({
  entries,
}: {
  entries: { label: string; paletteKey: keyof typeof ChartPalette }[]
}) {
  const items = entries.map((e) => ({ label: e.label, color: ChartPalette[e.paletteKey] }))
  return <ChartLegendContent items={items} />
}
