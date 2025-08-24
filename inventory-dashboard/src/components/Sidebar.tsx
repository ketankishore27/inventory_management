'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingCartIcon, 
  ShoppingBagIcon,
  WrenchIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Add Resource Allocation', href: '/add-resource-allocation', icon: ShoppingCartIcon },
  { name: 'Update Resource Allocation', href: '/update-resource-allocation', icon: ShoppingCartIcon },
  { name: 'Delete Resources', href: '/delete-resources', icon: TrashIcon },
  { name: 'Person View', href: '/person-view', icon: CubeIcon },
  { name: 'Available Resources', href: '/available-resources', icon: ShoppingBagIcon },
  { name: 'EOW Resources', href: '/eow-resources', icon: WrenchIcon }
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex w-64 flex-col">
        <div className="flex h-16 items-center px-4 bg-gray-900">
          <Link href="/" className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-white">
              <Image src="/dl-telekom-logo-01.jpg" alt="Inventory Logo" width={28} height={28} className="object-contain" />
            </div>
            <span className="ml-2 text-xl font-semibold text-white">Inventory</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col bg-gray-900">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = item.href !== '#' && (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}
                  />
                  {item.name}
                </Link>
              )})}
          </nav>
        </div>
      </div>
    </div>
  )
}
