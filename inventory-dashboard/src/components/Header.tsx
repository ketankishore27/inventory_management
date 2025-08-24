'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ClockIcon, 
  BellIcon, 
  Cog6ToothIcon, 
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const [now, setNow] = useState(new Date())
  const [visible, setVisible] = useState(true)
  const [username, setUsername] = useState('')
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let timeoutId: number | undefined
    const t = setInterval(() => {
      setVisible(false)
      setNow(new Date())
      timeoutId = window.setTimeout(() => setVisible(true), 50)
    }, 1000)
    return () => {
      clearInterval(t)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    // Read username from cookie set during login
    const userCookie = document.cookie.split('; ').find(c => c.startsWith('user='))
    if (userCookie) {
      try {
        const value = decodeURIComponent(userCookie.split('=')[1] || '')
        setUsername(value)
      } catch {
        // ignore decode errors
      }
    }
  }, [])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])

  const handleLogout = () => {
    // Clear auth cookies and go to login
    document.cookie = 'auth=; path=/; max-age=0'
    document.cookie = 'user=; path=/; max-age=0'
    setMenuOpen(false)
    router.replace('/')
  }

  const day = now.toLocaleDateString(undefined, { weekday: 'long' })
  const date = now.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const formatted = `${day}, ${date} · ${time}`
  const displayName = username.trim()
  const initial = (displayName.charAt(0) || '').toUpperCase()
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-700 bg-gray-100 rounded-full px-3 py-1 shadow-sm">
            <ClockIcon className="h-5 w-5 text-gray-600" />
            <span className={`text-sm font-medium tabular-nums transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>{formatted}</span>
          </div>
        </div>

        {/* Search removed */}

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">{displayName}</span>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
            <BellIcon className="h-5 w-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>
          
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(v => !v)}
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center focus:outline-none hover:ring-2 hover:ring-gray-300"
            >
              <span className="text-sm font-medium text-gray-600">{initial}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-10">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
