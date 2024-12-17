"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Layout } from "@/components/layout"
import { useManagement } from "@/contexts/ManagementContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductsServicesPage() {
  const { products, services, addProduct, updateProduct, removeProduct, addService, updateService, removeService } = useManagement()

  const [newProductName, setNewProductName] = useState("")
  const [newProductPrice, setNewProductPrice] = useState("")
  const [newProductStock, setNewProductStock] = useState("")
  const [editingProduct, setEditingProduct] = useState<{ id: string; name: string; price: number; stock: number } | null>(null)

  const [newServiceName, setNewServiceName] = useState("")
  const [newServicePrice, setNewServicePrice] = useState("")
  const [editingService, setEditingService] = useState<{ id: string; name: string; price: number } | null>(null)

  const handleAddProduct = () => {
    if (newProductName && newProductPrice && newProductStock) {
      addProduct(
        newProductName,
        parseFloat(newProductPrice),
        parseInt(newProductStock)
      )
      setNewProductName("")
      setNewProductPrice("")
      setNewProductStock("")
    }
  }

  const handleUpdateProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, { 
        name: editingProduct.name, 
        price: editingProduct.price, 
        stock: editingProduct.stock
      })
      setEditingProduct(null)
    }
  }

  const handleRemoveProduct = (id: string) => {
    removeProduct(id)
  }

  const handleAddService = () => {
    if (newServiceName && newServicePrice) {
      addService(newServiceName, parseFloat(newServicePrice))
      setNewServiceName("")
      setNewServicePrice("")
    }
  }

  const handleUpdateService = () => {
    if (editingService) {
      updateService(editingService.id, { 
        name: editingService.name, 
        price: editingService.price
      })
      setEditingService(null)
    }
  }

  const handleRemoveService = (id: string) => {
    removeService(id)
  }

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Manage Products and Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="New product name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                />
                <Input
                  placeholder="Stock"
                  type="number"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                />
                <Button onClick={handleAddProduct}>Add Product</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>Kshs {product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={editingProduct?.name || ''}
                                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, name: e.target.value} : null)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-price" className="text-right">
                                  Price
                                </Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  value={editingProduct?.price || 0}
                                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, price: parseFloat(e.target.value)} : null)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-stock" className="text-right">
                                  Stock
                                </Label>
                                <Input
                                  id="edit-stock"
                                  type="number"
                                  value={editingProduct?.stock || 0}
                                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, stock: parseInt(e.target.value)} : null)}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <Button onClick={handleUpdateProduct}>Save Changes</Button>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveProduct(product.id)}>Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="services">
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="New service name"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                />
                <Button onClick={handleAddService}>Add Service</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>Kshs {service.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Service</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-service-name" className="text-right">
                                  Name
                                </Label>
                                <Input
                                  id="edit-service-name"
                                  value={editingService?.name || ''}
                                  onChange={(e) => setEditingService(prev => prev ? {...prev, name: e.target.value} : null)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-service-price" className="text-right">
                                  Price
                                </Label>
                                <Input
                                  id="edit-service-price"
                                  type="number"
                                  value={editingService?.price || 0}
                                  onChange={(e) => setEditingService(prev => prev ? {...prev, price: parseFloat(e.target.value)} : null)}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <Button onClick={handleUpdateService}>Save Changes</Button>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveService(service.id)}>Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  )
}

