'use client'

import React, { useState } from 'react'

export default function AddResourceAllocationPage() {
  const [form, setForm] = useState({
    name: '',
    serialNumber: '',
    allocationDate: '',
    po: '',
    location: '',
    email: '',
    details: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [savedAllocation, setSavedAllocation] = useState<Record<string, string> | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // clear field error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.serialNumber.trim()) nextErrors.serialNumber = 'Serial Number is required'
    if (!form.allocationDate.trim()) nextErrors.allocationDate = 'Allocation Date is required'
    if (!form.po.trim()) nextErrors.po = 'PO is required'
    if (!form.location.trim()) nextErrors.location = 'Location is required'
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    else {
      const emailRegex = /^[A-Za-z0-9._%+-]+@t-systems\.com$/i
      if (!emailRegex.test(form.email)) nextErrors.email = 'Email must be a @t-systems.com address'
    }
    if (!form.details.trim()) nextErrors.details = 'Allocation Details are required'
    return nextErrors
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    try {
      setSubmitting(true)
      const payload = {
        name: form.name,
        serialNumber: form.serialNumber,
        allocationDate: form.allocationDate,
        po: form.po,
        location: form.location,
        email: form.email,
        detail: form.details,
      }
      const res = await fetch('http://127.0.0.1:8000/addResourceAllocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok || data?.status !== 'Success') {
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(data.errors)
        }
        setMessage({ type: 'error', text: data?.message || 'Failed to save allocation.' })
        // pop-up for unsuccessful operation
        if (typeof window !== 'undefined') {
          window.alert('Unsuccessful operation')
        }
        return
      }

      setMessage({ type: 'success', text: 'Resource allocation saved.' })
      // pop-up for success
      if (typeof window !== 'undefined') {
        window.alert('Data was saved')
      }
      const saved = { ...payload, details: form.details }
      setSavedAllocation(saved)
      setForm({ name: '', serialNumber: '', allocationDate: '', po: '', location: '', email: '', details: '' })
      setErrors({})
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Failed to save allocation.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Add Resource Allocation</h1>
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
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              id="serialNumber"
              name="serialNumber"
              value={form.serialNumber}
              onChange={onChange}
              required
              type="text"
              placeholder="Enter serial number"
              className={`mt-1 block w-full rounded-md bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 ${errors.serialNumber ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.serialNumber && <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>}
          </div>

          <div>
            <label htmlFor="allocationDate" className="block text-sm font-medium text-gray-700">Allocation Date</label>
            <input
              id="allocationDate"
              name="allocationDate"
              value={form.allocationDate}
              onChange={onChange}
              required
              type="date"
              className={`mt-1 block w-full rounded-md bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 ${errors.allocationDate ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.allocationDate && <p className="mt-1 text-sm text-red-600">{errors.allocationDate}</p>}
          </div>

          <div>
            <label htmlFor="po" className="block text-sm font-medium text-gray-700">PO</label>
            <input
              id="po"
              name="po"
              value={form.po}
              onChange={onChange}
              required
              type="text"
              placeholder="Enter PO number"
              className={`mt-1 block w-full rounded-md bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 ${errors.po ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.po && <p className="mt-1 text-sm text-red-600">{errors.po}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <select
              id="location"
              name="location"
              value={form.location}
              onChange={onChange}
              required
              className={`mt-1 block w-full rounded-md bg-white text-gray-900 shadow-sm focus:border-red-500 focus:ring-red-500 ${errors.location ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Select location</option>
              <option value="Pune">Pune</option>
              <option value="Bangalore">Bangalore</option>
            </select>
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email ID</label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              type="email"
              placeholder="Enter email address"
              className={`mt-1 block w-full rounded-md bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Allocation Details</label>
            <textarea
              id="details"
              name="details"
              value={form.details}
              onChange={onChange}
              rows={4}
              required
              placeholder="Add any notes or details about this allocation..."
              className={`mt-1 block w-full rounded-md bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500 ${errors.details ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.details && <p className="mt-1 text-sm text-red-600">{errors.details}</p>}
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${submitting ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Saving...' : 'Save Allocation'}
            </button>
            {message && (
              <span className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</span>
            )}
          </div>
        </form>
      </div>

      {savedAllocation && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Allocation</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Name</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{savedAllocation['name']}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Serial Number</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{savedAllocation['serialNumber']}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Allocation Date</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{savedAllocation['allocationDate']}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">PO</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{savedAllocation['po']}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Location</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{savedAllocation['location']}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Email ID</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{savedAllocation['email']}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Details</td>
                  <td className="px-4 py-2 text-sm text-gray-900 whitespace-pre-wrap">{savedAllocation['details']}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
