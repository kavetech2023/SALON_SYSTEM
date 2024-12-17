"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Layout } from "@/components/layout"

type Customer = {
  id: string
  name: string
  email: string
  phone: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newCustomerEmail, setNewCustomerEmail] = useState("")
  const [newCustomerPhone, setNewCustomerPhone] = useState("")
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { id: Date.now().toString(), ...customer }
    setCustomers([...customers, newCustomer])
  }

  const updateCustomer = (id: string, updatedCustomer: Omit<Customer, 'id'>) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, ...updatedCustomer } : customer
    ))
  }

  const removeCustomer = (id: string) => {
    setCustomers(customers.filter(customer => customer.id !== id))
  }

  const handleAddCustomer = () => {
    if (newCustomerName && newCustomerEmail && newCustomerPhone) {
      addCustomer({ name: newCustomerName, email: newCustomerEmail, phone: newCustomerPhone })
      setNewCustomerName("")
      setNewCustomerEmail("")
      setNewCustomerPhone("")
    }
  }

  const handleUpdateCustomer = () => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, { 
        name: editingCustomer.name, 
        email: editingCustomer.email, 
        phone: editingCustomer.phone
      })
      setEditingCustomer(null)
    }
  }

  const handleRemoveCustomer = (id: string) => {
    removeCustomer(id)
  }

  const sendMessage = (customer: Customer) => {
    // In a real application, this would send a message to the customer
    console.log(`Sending message to ${customer.name} (${customer.email})`)
  }

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Manage Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="New customer name"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={newCustomerEmail}
              onChange={(e) => setNewCustomerEmail(e.target.value)}
            />
            <Input
              placeholder="Phone"
              value={newCustomerPhone}
              onChange={(e) => setNewCustomerPhone(e.target.value)}
            />
            <Button onClick={handleAddCustomer}>Add</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Customer</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingCustomer?.name || ''}
                              onChange={(e) => setEditingCustomer(prev => prev ? {...prev, name: e.target.value} : null)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="edit-email"
                              value={editingCustomer?.email || ''}
                              onChange={(e) => setEditingCustomer(prev => prev ? {...prev, email: e.target.value} : null)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phone" className="text-right">
                              Phone
                            </Label>
                            <Input
                              id="edit-phone"
                              value={editingCustomer?.phone || ''}
                              onChange={(e) => setEditingCustomer(prev => prev ? {...prev, phone: e.target.value} : null)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={handleUpdateCustomer}>Save Changes</Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" className="mr-2" onClick={() => handleRemoveCustomer(customer.id)}>Remove</Button>
                    <Button variant="outline" size="sm" onClick={() => sendMessage(customer)}>Send Message</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  )
}

