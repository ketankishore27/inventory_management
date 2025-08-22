import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, serialNumber, allocationDate, po, location, email } = body || {}

    // Basic server-side validation
    const errors: Record<string, string> = {}
    if (!name?.trim()) errors.name = 'Name is required'
    if (!serialNumber?.trim()) errors.serialNumber = 'Serial Number is required'
    if (!allocationDate?.trim()) errors.allocationDate = 'Allocation Date is required'
    if (!po?.trim()) errors.po = 'PO is required'
    if (!location?.trim()) errors.location = 'Location is required'
    else {
      const allowed = ['Pune', 'Bangalore']
      if (!allowed.includes(location)) errors.location = 'Location must be Pune or Bangalore'
    }
    if (!email?.trim()) errors.email = 'Email is required'
    else {
      const emailRegex = /^[A-Za-z0-9._%+-]+@t-systems\.com$/i
      if (!emailRegex.test(email)) errors.email = 'Email must be a @t-systems.com address'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 })
    }

    // TODO: integrate with FastAPI service when endpoint is ready
    // Example:
    // const res = await fetch('http://127.0.0.1:8000/createAllocation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    // const data = await res.json()
    // return NextResponse.json({ ok: res.ok, data }, { status: res.status })

    // For now, echo success with a mock id
    const id = Math.random().toString(36).slice(2)
    return NextResponse.json({ ok: true, id, data: { name, serialNumber, allocationDate, po, location, email } }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message || 'Unexpected error' }, { status: 500 })
  }
}
