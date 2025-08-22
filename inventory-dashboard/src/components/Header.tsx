'use client'

import { useEffect, useState } from 'react'
import { 
  ClockIcon, 
  BellIcon, 
  Cog6ToothIcon, 
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const [now, setNow] = useState(new Date())
  const [visible, setVisible] = useState(true)

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

  const day = now.toLocaleDateString(undefined, { weekday: 'long' })
  const date = now.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const formatted = `${day}, ${date} · ${time}`
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
            <span className="text-sm font-medium text-gray-700">Zylker</span>
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
          
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">U</span>
          </div>
        </div>
      </div>
    </header>
  )
}
