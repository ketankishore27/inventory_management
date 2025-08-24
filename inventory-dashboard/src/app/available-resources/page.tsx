'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type StockDevice = {
  service_tag_number: string
  status: string
  sub_status: string
  ordered_by: string
  make_model: string
  po: string
  ownership: string
  deployed_date: string
  location: string
  received: string
  warranty_end: string
  warranty_date: string
  warranty_status: string
  year: number
}

export default function AvailableResourcesPage() {
  const [data, setData] = useState<StockDevice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterField, setFilterField] = useState<string>('')
  const [filterValue, setFilterValue] = useState<string>('')
  const [appliedFilterField, setAppliedFilterField] = useState<string>('')
  const [appliedFilterValue, setAppliedFilterValue] = useState<string>('')

  const suggestions = useMemo(() => {
    if (!filterField) return [] as string[]
    const key = filterField as keyof StockDevice
    const uniq = new Set<string>()
    for (const row of data) {
      const v = row[key] as unknown as string | number | null | undefined
      if (v !== null && v !== undefined && String(v).trim() !== '') {
        uniq.add(String(v))
      }
    }
    return Array.from(uniq).sort((a, b) => a.localeCompare(b)).slice(0, 100)
  }, [filterField, data])

  const tokens = useMemo(() => {
    return filterValue
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
  }, [filterValue])

  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement | null>(null)

  const activeQuery = useMemo(() => {
    const last = filterValue.split(/[\n,;]+/).pop() || ''
    return last.trim().toLowerCase()
  }, [filterValue])

  const filteredSuggestions = useMemo(() => {
    const q = activeQuery
    if (!q) return suggestions.filter((s) => !tokens.includes(s)).slice(0, 20)
    return suggestions
      .filter((s) => s.toLowerCase().includes(q) && !tokens.includes(s))
      .slice(0, 20)
  }, [suggestions, tokens, activeQuery])

  const pickSuggestion = useCallback((s: string) => {
    // Replace the last token (current typing) with selected suggestion and append a comma+space
    const prefix = filterValue.replace(/[^,\n;]*$/, '')
    setFilterValue(prefix + s + ', ')
    setShowSuggestions(false)
  }, [filterValue])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const handleFilterValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    let nextVal = raw
    const trimmed = raw.trim()
    // If user selected a suggestion and it's not already delimited, append a comma+space
    if (
      trimmed &&
      suggestions.includes(trimmed) &&
      !/[,;\n]\s?$/.test(raw)
    ) {
      nextVal = trimmed + ', '
    }
    setFilterValue(nextVal)
  }, [suggestions])

  const handleFilterValueKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'Tab')) {
      const hasText = filterValue.trim().length > 0
      const alreadyDelimited = /[,;\n]\s?$/.test(filterValue)
      if (hasText && !alreadyDelimited) {
        e.preventDefault()
        setFilterValue(filterValue + ', ')
      }
    }
  }, [filterValue])

  const filteredData = useMemo(() => {
    if (!appliedFilterField || !appliedFilterValue.trim()) return data
    const key = appliedFilterField as keyof StockDevice
    const needles = appliedFilterValue
      .split(/[\n,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    if (needles.length === 0) return data
    return data.filter((d) => {
      const val = d[key] as unknown as string | number | null | undefined
      if (val === null || val === undefined) return false
      const hay = String(val).toLowerCase()
      return needles.some((n) => hay.includes(n))
    })
  }, [data, appliedFilterField, appliedFilterValue])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('http://127.0.0.1:8000/getStockDevicesDetailed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const json = await res.json()
      if (!res.ok) throw new Error('Request failed')
      if (!Array.isArray(json)) throw new Error('Unexpected response shape')
      setData(json as StockDevice[])
    } catch (e: any) {
      console.error(e)
      setError(e?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Available Resources</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className={`inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter Field</label>
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="mt-1 block w-56 rounded-md bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 border-gray-300 h-[42px]"
          >
            <option value="">No filter</option>
            <option value="service_tag_number">Service Tag</option>
            <option value="status">Status</option>
            <option value="sub_status">Sub-Status</option>
            <option value="ordered_by">Ordered By</option>
            <option value="make_model">Make/Model</option>
            <option value="po">PO</option>
            <option value="ownership">Ownership</option>
            <option value="deployed_date">Deployed Date</option>
            <option value="location">Location</option>
            <option value="received">Received</option>
            <option value="warranty_end">Warranty End</option>
            <option value="warranty_date">Warranty Date</option>
            <option value="warranty_status">Warranty Status</option>
            <option value="year">Year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter Value</label>
          <div className="relative" ref={suggestionsRef}>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => { setShowSuggestions(true); handleFilterValueChange(e) }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleFilterValueKeyDown}
              placeholder="Type to filter... (comma, semicolon, or newline separated)"
              className="mt-1 block w-64 rounded-md bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 border-gray-300 h-[42px]"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-20 mt-1 max-h-56 w-64 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                {filteredSuggestions.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s) }}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          {tokens.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tokens.map((t) => (
                <span key={t} className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 border border-red-200">{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="pb-0.5">
          <button
            type="button"
            onClick={() => { setAppliedFilterField(filterField); setAppliedFilterValue(filterValue) }}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
        <div className="pb-0.5">
          <button
            type="button"
            onClick={() => { setFilterField(''); setFilterValue(''); setAppliedFilterField(''); setAppliedFilterValue('') }}
            className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-gray-900 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Service Tag</Th>
                <Th>Status</Th>
                <Th>Sub-Status</Th>
                <Th>Ordered By</Th>
                <Th>Make/Model</Th>
                <Th>PO</Th>
                <Th>Ownership</Th>
                <Th>Deployed Date</Th>
                <Th>Location</Th>
                <Th>Received</Th>
                <Th>Warranty End</Th>
                <Th>Warranty Date</Th>
                <Th>Warranty Status</Th>
                <Th>Year</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-6 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-6 text-center text-sm text-gray-500">No stock devices found.</td>
                </tr>
              ) : (
                filteredData.map((d: StockDevice, idx: number) => (
                  <tr key={`${d.service_tag_number}-${idx}`} className="hover:bg-gray-50">
                    <Td>{d.service_tag_number}</Td>
                    <Td>
                      <Badge color="indigo">{d.status}</Badge>
                    </Td>
                    <Td>
                      <Badge color="gray">{d.sub_status}</Badge>
                    </Td>
                    <Td>{d.ordered_by}</Td>
                    <Td>{d.make_model}</Td>
                    <Td>{d.po}</Td>
                    <Td>{d.ownership}</Td>
                    <Td>{d.deployed_date}</Td>
                    <Td>{d.location}</Td>
                    <Td>{d.received}</Td>
                    <Td>{d.warranty_end}</Td>
                    <Td>{d.warranty_date}</Td>
                    <Td>
                      <Badge color={d.warranty_status?.toLowerCase().includes('active') ? 'green' : 'red'}>
                        {d.warranty_status}
                      </Badge>
                    </Td>
                    <Td>{d.year}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{children}</td>
  )
}

function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: 'gray' | 'indigo' | 'green' | 'red' }) {
  const styles: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${styles[color]}`}>{children}</span>
  )
}
