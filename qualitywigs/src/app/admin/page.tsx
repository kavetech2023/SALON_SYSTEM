"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useSales } from "@/contexts/SalesContext"
import { useManagement } from "@/contexts/ManagementContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Layout } from "@/components/layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboard() {
  const { sales, loadSales } = useSales()
  const { loadEmployeesAndServices } = useManagement()
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  useEffect(() => {
    loadSales()
    loadEmployeesAndServices()
  }, [])

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date).toISOString().split('T')[0]
    return saleDate === selectedDate
  })

  const totalSales = filteredSales.reduce((total, sale) => total + sale.amount, 0)

  const salesByService = filteredSales.reduce((acc, sale) => {
    acc[sale.service] = (acc[sale.service] || 0) + sale.amount
    return acc
  }, {} as Record<string, number>)

  const pieChartData = Object.entries(salesByService).map(([name, value]) => ({ name, value }))

  const salesByEmployee = filteredSales.reduce((acc, sale) => {
    acc[sale.employeeName] = (acc[sale.employeeName] || 0) + sale.amount
    return acc
  }, {} as Record<string, number>)

  const barChartData = Object.entries(salesByEmployee).map(([name, value]) => ({ name, value }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const refreshData = () => {
    loadSales()
    loadEmployeesAndServices()
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={refreshData}>Refresh Data</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">Kshs {totalSales.toFixed(2)}</div>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(7)].map((_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - i)
                    const dateString = date.toISOString().split('T')[0]
                    return (
                      <SelectItem key={dateString} value={dateString}>
                        {date.toLocaleDateString()}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sales by Service</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sales by Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.slice(0, 5).map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.service}</TableCell>
                      <TableCell>Kshs {sale.amount.toFixed(2)}</TableCell>
                      <TableCell>{sale.employeeName}</TableCell>
                      <TableCell>{new Date(sale.date).toLocaleString()}</TableCell>
                      <TableCell>
                        {sale.customerName && `${sale.customerName}`}
                        {sale.customerContact && ` (${sale.customerContact})`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
