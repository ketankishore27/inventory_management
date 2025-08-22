'use client'

import { ClockIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

const initialInsights = [
  {
    id: 1,
    title: 'ALL DEVICES',
    value: '--',
    unit: 'Qty',
    icon: ClockIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 2,
    title: 'DEPLOYED DEVICES',
    value: '--',
    unit: 'Pkgs',
    icon: ClockIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 3,
    title: 'STOCK DEVICES',
    value: '--',
    unit: 'Pkgs',
    icon: ClockIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 4,
    title: 'EOW DEVICES',
    value: '--',
    unit: 'Qty',
    icon: ClockIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

export default function InventoryInsights() {
  const [insights, setInsights] = useState(initialInsights)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch data from all endpoints
        const allDevicesRes = await fetch('http://127.0.0.1:8000/getAllDevices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const allDevicesData = await allDevicesRes.json()
        
        const deployedDevicesRes = await fetch('http://127.0.0.1:8000/getDeployedDevices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const deployedDevicesData = await deployedDevicesRes.json()
        
        const stockDevicesRes = await fetch('http://127.0.0.1:8000/getStockDevices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const stockDevicesData = await stockDevicesRes.json()
        
        const eowDevicesRes = await fetch('http://127.0.0.1:8000/getEowDevices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const eowDevicesData = await eowDevicesRes.json()
        
        // Update insights with fetched data
        setInsights(prev => [
          { ...prev[0], value: allDevicesData.count?.toString() || '0' },
          { ...prev[1], value: deployedDevicesData.count?.toString() || '0' },
          { ...prev[2], value: stockDevicesData.count?.toString() || '0' },
          { ...prev[3], value: eowDevicesData.count?.toString() || '0' },
        ])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Insights</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                  <span className="text-sm font-medium text-gray-500">{insight.title}</span>
                </div>
                <div className="mt-2">
                  {loading ? (
                    <span className="text-2xl font-bold text-gray-400">Loading...</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-gray-900">{insight.value}</span>
                      <span className="text-sm text-gray-500 ml-1">{insight.unit}</span>
                    </>
                  )}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full ${insight.bgColor} flex items-center justify-center`}>
                <insight.icon className={`h-6 w-6 ${insight.color}`} />
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
