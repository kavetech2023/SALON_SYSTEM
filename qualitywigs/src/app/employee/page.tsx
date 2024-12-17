"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSales } from "@/contexts/SalesContext"
import { useManagement } from "@/contexts/ManagementContext"
import Image from "next/image"
import confetti from 'canvas-confetti'
import { Layout } from "@/components/layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function EmployeeDashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerContact, setCustomerContact] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [complaintMessage, setComplaintMessage] = useState("")
  const { addSale, notifyAdmin } = useSales()
  const { employees, services } = useManagement()

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee || !selectedService) {
      console.error("Please select an employee and a service")
      return
    }
    const service = services.find(s => s.id === selectedService)
    if (!service) {
      console.error("Invalid service selected")
      return
    }
    const newSale = {
      service: service.name,
      amount: service.price,
      employeeName: selectedEmployee,
      customerName: customerName || undefined,
      customerContact: customerContact || undefined,
    }
    addSale(newSale)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    console.log("Sale recorded successfully")
    setSelectedService("")
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
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Record a Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <Button
                    key={service.id}
                    type="button"
                    variant={selectedService === service.id ? "default" : "outline"}
                    onClick={() => setSelectedService(service.id)}
                    className="h-auto py-2"
                  >
                    <div className="flex flex-col items-center">
                      <span>{service.name}</span>
                      <span>${service.price.toFixed(2)}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

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
            <Button onClick={handleSubmit} className="w-full">
              Record Sale
            </Button>
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
    </Layout>
  )
}

