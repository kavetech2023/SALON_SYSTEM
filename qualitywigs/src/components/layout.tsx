import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-gray-800 dark:text-white font-bold text-lg">
                Salon Management
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                Dashboard
              </Link>
              <Link href="/admin/employees" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                Employees
              </Link>
              <Link href="/admin/customers" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                Customers
              </Link>
              <Link href="/admin/products" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                Products
              </Link>
              <Link href="/employee" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                Employee Portal
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

