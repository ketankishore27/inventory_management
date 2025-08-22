'use client'

import InventoryInsights from './dashboard/InventoryInsights'
import DeployedModelView from './dashboard/DeployedModelView'
import StockModelView from './dashboard/StockModelView'
import DeployedModelSubStatus from './dashboard/DeployedModelSubStatus'
import StockModelSubStatus from './dashboard/StockModelSubStatus'

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      <InventoryInsights />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-semibold text-gray-900">Deployed Model View</h3>
          <div className="mt-4 h-80">
            <DeployedModelView />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-semibold text-gray-900">Deployed Model SubStatus</h3>
          <div className="mt-4 h-80">
            <DeployedModelSubStatus />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-semibold text-gray-900">Stock Model View</h3>
          <div className="mt-4 h-80">
            <StockModelView />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-semibold text-gray-900">Stock Model SubStatus</h3>
          <div className="mt-4 h-80">
            <StockModelSubStatus />
          </div>
        </div>
      </div>
    </div>
  )
}

