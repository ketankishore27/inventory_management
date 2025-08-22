import { NextResponse } from 'next/server'

export async function GET() {
  const dashboardData = {
    salesActivity: [
      { id: 1, title: 'TO BE PACKED', value: 228, unit: 'Qty', color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { id: 2, title: 'TO BE SHIPPED', value: 6, unit: 'Pkgs', color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { id: 3, title: 'TO BE DELIVERED', value: 10, unit: 'Pkgs', color: 'text-purple-600', bgColor: 'bg-purple-50' },
      { id: 4, title: 'TO BE INVOICED', value: 474, unit: 'Qty', color: 'text-green-600', bgColor: 'bg-green-50' }
    ],
    inventory: { quantityInHand: 10458, quantityToBeReceived: 168 },
    products: { lowStockItems: 3, allItemGroup: 39, allItems: 190, unconfirmedItems: 121, activePercentage: 71 },
    topSellingItems: [
      { id: 1, name: 'Hanswooly Cotton Cas...', quantity: 171, unit: 'pcs', color: 'Orange' },
      { id: 2, name: 'Cutiepie Rompers-spo...', quantity: 45, unit: 'sets', color: 'Blue & Pink' },
      { id: 3, name: 'Cutiepie Rompers-jet b...', quantity: 38, unit: 'sets', color: 'Dark Blue & White' }
    ],
    purchaseOrders: { quantityOrdered: 2.00, totalCost: 46.92 },
    salesOrders: [{ channel: 'Direct sales', draft: 0, confirmed: 50, packed: 0, shipped: 0, invoiced: 102 }]
  }
  return NextResponse.json(dashboardData)
}
