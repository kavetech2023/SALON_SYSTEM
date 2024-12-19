"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'

type Employee = {
  id: string
  name: string
  email: string
  phone: string
  photo?: string
}

type Service = {
  id: string
  name: string
  price: number
}

type Product = {
  id: string
  name: string
  price: number
  stock: number
}

type ManagementContextType = {
  employees: Employee[]
  services: Service[]
  products: Product[]
  addEmployee: (employee: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, employee: Omit<Employee, 'id'>) => void
  removeEmployee: (id: string) => void
  addService: (name: string, price: number) => void
  removeService: (id: string) => void
  addProduct: (name: string, price: number, stock: number) => void
  removeProduct: (id: string) => void
  loadEmployeesAndServices: () => void
  updateService: (id: string, service: { name: string; price: number }) => void
  updateProduct: (id: string, product: { name: string; price: number; stock: number }) => void
}

const ManagementContext = createContext<ManagementContextType | undefined>(undefined)

export const useManagement = () => {
  const context = useContext(ManagementContext)
  if (!context) {
    throw new Error('useManagement must be used within a ManagementProvider')
  }
  return context
}

export const ManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const loadEmployeesAndServices = async () => {
    try {
      const employeesSnapshot = await getDocs(collection(db, 'qualitywigs', 'management', 'employees'))
      const servicesSnapshot = await getDocs(collection(db, 'qualitywigs', 'management', 'services'))
      const productsSnapshot = await getDocs(collection(db, 'qualitywigs', 'management', 'products'))

      setEmployees(employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee)))
      setServices(servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)))
      setProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)))
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  useEffect(() => {
    loadEmployeesAndServices()
  }, [])

  const addEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'qualitywigs', 'management', 'employees'), employee)
      const newEmployee = { id: docRef.id, ...employee }
      setEmployees(prev => [...prev, newEmployee])
    } catch (error) {
      console.error('Error adding employee:', error)
    }
  }

  const updateEmployee = async (id: string, updatedEmployee: Omit<Employee, 'id'>) => {
    try {
      const employeeRef = doc(db, 'qualitywigs', 'management', 'employees', id)
      await updateDoc(employeeRef, updatedEmployee)
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp))
    } catch (error) {
      console.error('Error updating employee:', error)
    }
  }

  const removeEmployee = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'qualitywigs', 'management', 'employees', id))
      setEmployees(prev => prev.filter(emp => emp.id !== id))
    } catch (error) {
      console.error('Error removing employee:', error)
    }
  }

  const addService = async (name: string, price: number) => {
    try {
      const docRef = await addDoc(collection(db, 'qualitywigs', 'management', 'services'), { name, price })
      const newService = { id: docRef.id, name, price }
      setServices(prev => [...prev, newService])
    } catch (error) {
      console.error('Error adding service:', error)
    }
  }

  const removeService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'qualitywigs', 'management', 'services', id))
      setServices(prev => prev.filter(service => service.id !== id))
    } catch (error) {
      console.error('Error removing service:', error)
    }
  }

  const addProduct = async (name: string, price: number, stock: number) => {
    try {
      const docRef = await addDoc(collection(db, 'qualitywigs', 'management', 'products'), { name, price, stock })
      const newProduct = { id: docRef.id, name, price, stock }
      setProducts(prev => [...prev, newProduct])
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const removeProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'qualitywigs', 'management', 'products', id))
      setProducts(prev => prev.filter(product => product.id !== id))
    } catch (error) {
      console.error('Error removing product:', error)
    }
  }

  const updateService = async (id: string, updatedService: { name: string; price: number }) => {
    try {
      const serviceRef = doc(db, 'qualitywigs', 'management', 'services', id)
      await updateDoc(serviceRef, updatedService)
      setServices(prev => prev.map(service => service.id === id ? { ...service, ...updatedService } : service))
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const updateProduct = async (id: string, updatedProduct: { name: string; price: number; stock: number }) => {
    try {
      const productRef = doc(db, 'qualitywigs', 'management', 'products', id)
      await updateDoc(productRef, updatedProduct)
      setProducts(prev => prev.map(product => product.id === id ? { ...product, ...updatedProduct } : product))
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  return (
    <ManagementContext.Provider value={{ 
      employees, 
      services, 
      products,
      addEmployee, 
      updateEmployee,
      removeEmployee, 
      addService, 
      removeService,
      addProduct,
      removeProduct,
      loadEmployeesAndServices,
      updateService,
      updateProduct,
    }}>
      {children}
    </ManagementContext.Provider>
  )
}

