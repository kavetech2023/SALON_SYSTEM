"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Sale = {
  id: string
  service: string
  amount: number
  employeeName: string
  date: string
  customerName?: string
  customerContact?: string
}

type SalesContextType = {
  sales: Sale[]
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void
  loadSales: () => void
  removeSale: (id: string) => void
  updateSale: (id: string, updatedSale: Omit<Sale, 'id' | 'date'>) => void
  notifyAdmin: (notification: Sale | { type: 'error' | 'complaint', message: string, employeeName: string, date: string }) => void
}

const SalesContext = createContext<SalesContextType | undefined>(undefined)

export const useSales = () => {
  const context = useContext(SalesContext)
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider')
  }
  return context
}

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>([])

  const loadSales = () => {
    const storedSales = localStorage.getItem('sales')
    if (storedSales) {
      setSales(JSON.parse(storedSales))
    }
  }

  useEffect(() => {
    loadSales()
  }, [])

  const addSale = (newSale: Omit<Sale, 'id' | 'date'>) => {
    const saleWithIdAndDate = {
      ...newSale,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    const updatedSales = [saleWithIdAndDate, ...sales]
    setSales(updatedSales)
    localStorage.setItem('sales', JSON.stringify(updatedSales))
    notifyAdmin(saleWithIdAndDate)
  }

  const removeSale = (id: string) => {
    const updatedSales = sales.filter(sale => sale.id !== id)
    setSales(updatedSales)
    localStorage.setItem('sales', JSON.stringify(updatedSales))
  }

  const updateSale = (id: string, updatedSale: Omit<Sale, 'id' | 'date'>) => {
    const updatedSales = sales.map(sale => 
      sale.id === id ? { ...sale, ...updatedSale } : sale
    )
    setSales(updatedSales)
    localStorage.setItem('sales', JSON.stringify(updatedSales))
  }

  const notifyAdmin = (notification: Sale | { type: 'error' | 'complaint', message: string, employeeName: string, date: string }) => {
    if ('type' in notification) {
      console.log(`New ${notification.type} from ${notification.employeeName}: ${notification.message}`)
    } else {
      console.log(`New sale notification: ${notification.employeeName} sold ${notification.service} for $${notification.amount}`)
    }
    // Here you would typically use an email service or API to send the actual email
  }

  return (
    <SalesContext.Provider value={{ sales, addSale, loadSales, removeSale, updateSale, notifyAdmin }}>
      {children}
    </SalesContext.Provider>
  )
}

