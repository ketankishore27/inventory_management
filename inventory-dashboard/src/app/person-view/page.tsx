'use client'

import React, { useState } from 'react'

type ResourceAllocation = {
  service_tag_number: string
  name: string
  allocation_date: string
  cost_center: string
  location: string
  email: string
  detail?: string
}

export default function PersonViewPage() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ResourceAllocation[] | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<ResourceAllocation | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }
  const openDetails = (item: ResourceAllocation) => {
    setSelected(item)
    setDetailOpen(true)
  }

  const closeDetails = () => {
    setDetailOpen(false)
    setSelected(null)
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else {
      const emailRegex = /^[A-Za-z0-9._%+-]+@t-systems\.com$/i
      if (!emailRegex.test(form.email)) next.email = 'Email must be a @t-systems.com address'
    }
    return next
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    try {
      setLoading(true)
      setResults(null)
      const res = await fetch('http://127.0.0.1:8000/getResourceAllocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(typeof data?.message === 'string' ? data.message : 'Request failed')
      }
      if (Array.isArray(data)) {
        setResults(data as ResourceAllocation[])
        setMessage(null)
      } else if (data?.status === 'Failed') {
        setResults([])
        setMessage('No data found or operation failed.')
      } else {
        setResults([])
        setMessage('No data returned.')
      }
    } catch (err) {
      console.error(err)
      setMessage('Unable to fetch resource allocations. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Person View</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              type="text"
              placeholder="Enter name"
              className={`mt-1 block w-full rounded-md bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email-ID</label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              type="email"
              placeholder="Enter email address"
              pattern="^[A-Za-z0-9._%+-]+@t-systems\\.com$"
              title="Email must be a @t-systems.com address"
              className={`mt-1 block w-full rounded-md bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center rounded-md px-4 py-2 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${loading ? 'bg-red-500/70 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {loading ? 'Loading…' : 'Continue'}
            </button>
            {message && (
              <span className="ml-3 text-sm text-green-600">{message}</span>
            )}
          </div>
        </form>
      </div>

      {results !== null && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Allocations</h2>
            <span className="text-sm text-gray-500">{results.length} result{results.length === 1 ? '' : 's'}</span>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-12 w-12 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v18m9-9H3" />
              </svg>
              <p className="mt-3 text-sm text-gray-600">No allocations found for the provided person.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((item) => (
                <div key={`${item.service_tag_number}-${item.email}`} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm ring-1 ring-gray-100">
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">{item.service_tag_number}</span>
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200">{item.location}</span>
                        </div>
                        <h3 className="mt-2 text-base font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openDetails(item)}
                        className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 ring-1 ring-inset ring-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="View details"
                        title="View details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3">
                      <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12m-12 3.75h12m-12 3.75h12M3.75 6.75h.008v.008H3.75V6.75zm0 3.75h.008v.008H3.75V10.5zm0 3.75h.008v.008H3.75v-.008z" />
                        </svg>
                        <span className="font-medium">Cost Center:</span>
                        <span className="text-gray-600">{item.cost_center}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75M3 18.75V8.25m18 10.5V8.25M3 8.25h18" />
                        </svg>
                        <span className="font-medium">Allocation Date:</span>
                        <span className="text-gray-600">{item.allocation_date}</span>
                      </div>
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {detailOpen && selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={closeDetails} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5" role="dialog" aria-modal="true">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Allocation Details</h3>
                <button onClick={closeDetails} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">SerialNumber</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{selected.service_tag_number}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{selected.name}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Location</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{selected.location}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Cost Center</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{selected.cost_center}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Allocation Date</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{selected.allocation_date}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Detail</p>
                    <p className="mt-1 text-sm font-medium text-gray-900 whitespace-pre-wrap break-words">{selected.detail ?? '-'}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
                <button onClick={closeDetails} className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
