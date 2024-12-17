"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useManagement } from "@/contexts/ManagementContext"
import { Layout } from "@/components/layout"
import Image from "next/image"

// Removed the Employee type definition as it was not being used

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, removeEmployee } = useManagement()

  const [newEmployeeName, setNewEmployeeName] = useState("")
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("")
  const [newEmployeePhone, setNewEmployeePhone] = useState("")
  const [newEmployeePhoto, setNewEmployeePhoto] = useState("")
  const [editingEmployee, setEditingEmployee] = useState<{ id: string; name: string; email: string; phone: string; photo: string } | null>(null)

  const handleAddEmployee = () => {
    if (newEmployeeName && newEmployeeEmail && newEmployeePhone) {
      addEmployee({
        name: newEmployeeName,
        email: newEmployeeEmail,
        phone: newEmployeePhone,
        photo: newEmployeePhoto,
      });
      setNewEmployeeName("");
      setNewEmployeeEmail("");
      setNewEmployeePhone("");
      setNewEmployeePhoto("");
    }
  }

  const handleUpdateEmployee = () => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, { 
        name: editingEmployee.name, 
        email: editingEmployee.email, 
        phone: editingEmployee.phone,
        photo: editingEmployee.photo
      })
      setEditingEmployee(null)
    }
  }

  const handleRemoveEmployee = (id: string) => {
    removeEmployee(id)
  }

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Manage Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="New employee name"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
            />
            <Input
              placeholder="Email"
              value={newEmployeeEmail}
              onChange={(e) => setNewEmployeeEmail(e.target.value)}
            />
            <Input
              placeholder="Phone"
              value={newEmployeePhone}
              onChange={(e) => setNewEmployeePhone(e.target.value)}
            />
            <Input
              placeholder="Photo URL"
              value={newEmployeePhoto}
              onChange={(e) => setNewEmployeePhoto(e.target.value)}
            />
            <Button onClick={handleAddEmployee}>Add</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Image
                      src={employee.photo || "/placeholder.svg"}
                      alt={employee.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Employee</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingEmployee?.name || ''}
                              onChange={(e) => setEditingEmployee(prev => prev ? {...prev, name: e.target.value} : null)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="edit-email"
                              value={editingEmployee?.email || ''}
                              onChange={(e) => setEditingEmployee(prev => prev ? {...prev, email: e.target.value} : null)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phone" className="text-right">
                              Phone
                            </Label>
                            <Input
                              id="edit-phone"
                              value={editingEmployee?.phone || ''}
                              onChange={(e) => setEditingEmployee(prev => prev ? {...prev, phone: e.target.value} : null)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-photo" className="text-right">
                              Photo URL
                            </Label>
                            <Input
                              id="edit-photo"
                              value={editingEmployee?.photo || ''}
                              onChange={(e) => setEditingEmployee(prev => prev ? {...prev, photo: e.target.value} : null)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={handleUpdateEmployee}>Save Changes</Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveEmployee(employee.id)}>Remove</Button>
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

