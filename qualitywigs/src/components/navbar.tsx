"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Quality Wigs
              </Link>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link href="/admin">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/admin/employees">
              <Button variant="ghost">Employees</Button>
            </Link>
            <Link href="/admin/customers">
              <Button variant="ghost">Customers</Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="ghost">Products</Button>
            </Link>
            <Link href="/admin/services">
              <Button variant="ghost">Services</Button>
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="ml-2 p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/admin"
              className="block px-3 py-2 text-base font-medium hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/employees"
              className="block px-3 py-2 text-base font-medium hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Employees
            </Link>
            <Link
              href="/admin/customers"
              className="block px-3 py-2 text-base font-medium hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Customers
            </Link>
            <Link
              href="/admin/products"
              className="block px-3 py-2 text-base font-medium hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/admin/services"
              className="block px-3 py-2 text-base font-medium hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
} 