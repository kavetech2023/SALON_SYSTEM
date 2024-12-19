"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSales } from "@/contexts/SalesContext"
import { useManagement } from "@/contexts/ManagementContext"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import confetti from 'canvas-confetti'

export default function EmployeeDashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerContact, setCustomerContact] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [complaintMessage, setComplaintMessage] = useState("")
  const { addSale, notifyAdmin } = useSales()
  const { employees, services, products } = useManagement()

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!selectedEmployee || (!selectedService && !selectedProduct)) {
      console.error("Please select an employee and a service or product")
      return
    }

    let saleItem
    if (selectedService) {
      saleItem = services.find(s => s.id === selectedService)
    } else {
      saleItem = products.find(p => p.id === selectedProduct)
    }

    if (!saleItem) {
      console.error("Invalid selection")
      return
    }

    const newSale = {
      service: selectedService,
      amount: saleItem.price,
      employeeName: selectedEmployee,
      customerName: customerName || null,
      customerContact: customerContact || null
    }

    addSale(newSale)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    console.log("Sale recorded successfully")
    setSelectedService("")
    setSelectedProduct("")
    setCustomerName("")
    setCustomerContact("")
  }

  const handleError = () => {
    if (!errorMessage) {
      console.error("Please enter an error message")
      return
    }
    notifyAdmin({
      type: "error",
      message: errorMessage,
      employeeName: selectedEmployee,
      date: new Date().toISOString(),
    })
    console.log("Error reported to admin")
    setErrorMessage("")
  }

  const handleComplaint = () => {
    if (!complaintMessage) {
      console.error("Please enter a complaint message")
      return
    }
    notifyAdmin({
      type: "complaint",
      message: complaintMessage,
      employeeName: selectedEmployee,
      date: new Date().toISOString(),
    })
    console.log("Complaint sent to admin")
    setComplaintMessage("")
  }

  const selectedEmployeeData = employees.find(emp => emp.name === selectedEmployee)

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <ThemeToggle />
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {employees.map((employee) => (
                <Button
                  key={employee.id}
                  variant={selectedEmployee === employee.name ? "default" : "outline"}
                  onClick={() => setSelectedEmployee(employee.name)}
                  className="h-auto py-2"
                >
                  <div className="flex flex-col items-center">
                    <Image
                      src={employee.photo || "/placeholder.svg"}
                      alt={employee.name}
                      width={50}
                      height={50}
                      className="rounded-full mb-2"
                    />
                    <span>{employee.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        {selectedEmployeeData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Selected Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Image
                  src={selectedEmployeeData.photo || "/placeholder.svg"}
                  alt={selectedEmployeeData.name}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedEmployeeData.name}</h2>
                  <p>{selectedEmployeeData.email}</p>
                  <p>{selectedEmployeeData.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Select Service</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <Button
                      key={service.id}
                      variant={selectedService === service.id ? "default" : "outline"}
                      onClick={() => setSelectedService(service.id)}
                      className="h-auto py-2"
                    >
                      <div className="flex flex-col items-center">
                        <span>{service.name}</span>
                        <span>Kshs {service.price.toFixed(2)}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Select Product</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search products..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="mb-4"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <Button
                      key={product.id}
                      variant={selectedProduct === product.id ? "default" : "outline"}
                      onClick={() => setSelectedProduct(product.id)}
                      className="h-auto py-2"
                    >
                      <div className="flex flex-col items-center">
                        <span>{product.name}</span>
                        <span>Kshs {product.price.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Customer Name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                placeholder="Customer Contact (optional)"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Button type="submit" className="w-full">
                Record Sale
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 flex space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Report Error</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Error</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="Describe the error..."
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
              />
              <Button onClick={handleError}>Send Error Report</Button>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Submit Complaint</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Complaint</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="Describe your complaint..."
                value={complaintMessage}
                onChange={(e) => setComplaintMessage(e.target.value)}
              />
              <Button onClick={handleComplaint}>Send Complaint</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

