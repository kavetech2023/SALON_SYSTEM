"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'

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

  const loadSales = async () => {
    try {
      const salesCollection = collection(db, 'qualitywigs', 'sales', 'transactions')
      const q = query(salesCollection, orderBy('date', 'desc'))
      const querySnapshot = await getDocs(q)
      const salesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Sale[]
      setSales(salesData)
    } catch (error) {
      console.error('Error loading sales:', error)
    }
  }

  useEffect(() => {
    loadSales()
  }, [])

  const addSale = async (newSale: Omit<Sale, 'id' | 'date'>) => {
    try {
      const saleWithDate = {
        ...newSale,
        date: new Date().toISOString(),
      }
      
      const salesCollection = collection(db, 'qualitywigs', 'sales', 'transactions')
      const docRef = await addDoc(salesCollection, saleWithDate)
      
      const saleWithId = {
        ...saleWithDate,
        id: docRef.id,
      }
      
      setSales(prevSales => [saleWithId, ...prevSales])
      notifyAdmin(saleWithId)
    } catch (error) {
      console.error('Error adding sale:', error)
    }
  }

  const removeSale = async (id: string) => {
    try {
      const saleRef = doc(db, 'qualitywigs', 'sales', 'transactions', id)
      await deleteDoc(saleRef)
      setSales(prevSales => prevSales.filter(sale => sale.id !== id))
    } catch (error) {
      console.error('Error removing sale:', error)
    }
  }

  const updateSale = async (id: string, updatedSale: Omit<Sale, 'id' | 'date'>) => {
    try {
      const saleRef = doc(db, 'qualitywigs', 'sales', 'transactions', id)
      await updateDoc(saleRef, updatedSale)
      
      setSales(prevSales =>
        prevSales.map(sale =>
          sale.id === id ? { ...sale, ...updatedSale } : sale
        )
      )
    } catch (error) {
      console.error('Error updating sale:', error)
    }
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

