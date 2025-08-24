'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const redirectTo = params.get('from') || '/dashboard'

  useEffect(() => {
    const hasAuth = document.cookie.split('; ').some((c) => c.startsWith('auth='))
    if (hasAuth) {
      router.replace('/dashboard')
    }
  }, [router])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('Please enter username and password')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/getUserAuthorization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }
      const data = await res.json() as { status?: string }
      if (data?.status === 'Success') {
        const maxAge = 60 * 60 * 8 // 8 hours
        document.cookie = `auth=1; path=/; max-age=${maxAge}`
        document.cookie = `user=${encodeURIComponent(username)}; path=/; max-age=${maxAge}`
        router.replace(redirectTo)
        return
      }
      setError('Invalid credentials')
    } catch (err) {
      setError('Unable to login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-center justify-center px-4 overflow-hidden">
      <Image
        src="/login_page.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-20 pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/90" />
      <div className="relative w-full max-w-sm rounded-xl bg-gray-800/90 backdrop-blur p-6 shadow-xl ring-1 ring-gray-700">
        <Image
          src="/login_page.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-20 pointer-events-none select-none absolute inset-0 z-0"
        />
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg overflow-hidden bg-white relative z-10">
          <Image src="/dl-telekom-logo-01.jpg" alt="Inventory Logo" width={28} height={28} className="object-contain" />
        </div>
        <h1 className="text-center text-2xl font-semibold text-white relative z-10">Inventory Management</h1>
        <p className="mt-1 text-center text-sm text-gray-300 relative z-10">Sign in to continue</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4 relative z-10">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 px-3 py-2"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-900/40 border border-red-800 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md text-white font-medium py-2.5 transition-colors ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'}`}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
