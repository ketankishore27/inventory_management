'use client'

import React, { useState } from 'react'

export default function DeleteResourcesPage() {
  const [serialNumber, setSerialNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [allocation, setAllocation] = useState<{
    name: string
    allocation_date: string
    cost_center: string
    location: string
    email: string
    detail: string
  } | null>(null)

  const normalizeDateToYMD = (val: string): string => {
    if (!val) return ''
    const m = val.match(/^\d{4}-\d{2}-\d{2}/)
    if (m) return m[0]
    const d = new Date(val)
    if (isNaN(d.getTime())) return ''
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!serialNumber.trim()) {
      setMessage('Please enter a Mac Serial Number')
      return
    }
    try {
      setSubmitting(true)
      setAllocation(null)
      const res = await fetch('http://127.0.0.1:8000/getSerialnumberAllocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serialnumber: serialNumber }),
      })
      const raw = await res.json()
      if (!res.ok || (raw && raw.status === 'Failed')) {
        setMessage('Request failed.')
        return
      }
      const record = Array.isArray(raw) ? (raw[0] ?? null) : raw
      if (!record || Object.keys(record).length === 0) {
        setMessage('No record found for the given serial number.')
        return
      }
      setAllocation({
        name: record?.name ?? '',
        allocation_date: normalizeDateToYMD(record?.allocation_date ?? ''),
        cost_center: record?.cost_center ?? '',
        location: record?.location ?? '',
        email: record?.email ?? '',
        detail: (record?.detail ?? record?.details) ?? '',
      })
      setMessage('Record loaded.')
    } catch (err) {
      console.error(err)
      setMessage('Search failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Delete Resources</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm max-w-2xl">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
              Mac Serial Number
            </label>
            <input
              id="serialNumber"
              name="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              required
              type="text"
              placeholder="Enter Mac serial number"
              className="mt-1 block w-full rounded-md bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 border-gray-300"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${submitting ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Searching...' : 'Search'}
            </button>
            {message && (
              <span className="text-sm text-gray-600">{message}</span>
            )}
          </div>
        </form>
      </div>

      {allocation && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Allocation Details (read-only)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={allocation.name}
                readOnly
                disabled
                className="mt-1 block w-full rounded-md bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Allocation Date</label>
              <input
                type="date"
                value={allocation.allocation_date}
                readOnly
                disabled
                className="mt-1 block w-full rounded-md bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost Center</label>
              <input
                type="text"
                value={allocation.cost_center}
                readOnly
                disabled
                className="mt-1 block w-full rounded-md bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={allocation.location}
                readOnly
                disabled
                className="mt-1 block w-full rounded-md bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={allocation.email}
                readOnly
                disabled
                className="mt-1 block w-full rounded-md bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Detail</label>
              <input
                type="text"
                value={allocation.detail}
                readOnly
                disabled
                className="mt-1 block w-full rounded-md bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              disabled={deleting || !allocation}
              onClick={async () => {
                try {
                  setDeleting(true)
                  const res = await fetch('http://127.0.0.1:8000/deleteResources', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ serialnumber: serialNumber }),
                  })
                  const data = await res.json()
                  if (res.ok && data?.status === 'Success') {
                    window.alert('Deleted successfully.')
                    setAllocation(null)
                    // Optionally clear the serial number
                    // setSerialNumber('')
                  } else {
                    window.alert('Delete failed.')
                  }
                } catch (e) {
                  console.error(e)
                  window.alert('Delete failed. Please try again.')
                } finally {
                  setDeleting(false)
                }
              }}
              className={`inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${deleting ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
