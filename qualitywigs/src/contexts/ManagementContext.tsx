"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

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

  const loadEmployeesAndServices = () => {
    const storedEmployees = localStorage.getItem('employees')
    const storedServices = localStorage.getItem('services')
    const storedProducts = localStorage.getItem('products')
    if (storedEmployees) setEmployees(JSON.parse(storedEmployees))
    if (storedServices) setServices(JSON.parse(storedServices))
    if (storedProducts) setProducts(JSON.parse(storedProducts))
  }

  useEffect(() => {
    loadEmployeesAndServices()
  }, [])

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = { id: Date.now().toString(), ...employee }
    const updatedEmployees = [...employees, newEmployee]
    setEmployees(updatedEmployees)
    localStorage.setItem('employees', JSON.stringify(updatedEmployees))
  }

  const updateEmployee = (id: string, updatedEmployee: Omit<Employee, 'id'>) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === id ? { ...emp, ...updatedEmployee } : emp
    )
    setEmployees(updatedEmployees)
    localStorage.setItem('employees', JSON.stringify(updatedEmployees))
  }

  const removeEmployee = (id: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id)
    setEmployees(updatedEmployees)
    localStorage.setItem('employees', JSON.stringify(updatedEmployees))
  }

  const addService = (name: string, price: number) => {
    const newService = { id: Date.now().toString(), name, price }
    const updatedServices = [...services, newService]
    setServices(updatedServices)
    localStorage.setItem('services', JSON.stringify(updatedServices))
  }

  const removeService = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id)
    setServices(updatedServices)
    localStorage.setItem('services', JSON.stringify(updatedServices))
  }

  const addProduct = (name: string, price: number, stock: number) => {
    const newProduct = { id: Date.now().toString(), name, price, stock }
    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  const removeProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
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
      loadEmployeesAndServices
    }}>
      {children}
    </ManagementContext.Provider>
  )
}

