"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Layout } from "@/components/layout"

type Product = {
  id: string
  name: string
  price: number
  stock: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  // Removed toast functionality

  const [newProductName, setNewProductName] = useState("")
  const [newProductPrice, setNewProductPrice] = useState("")
  const [newProductStock, setNewProductStock] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { id: Date.now().toString(), ...product }
    setProducts([...products, newProduct])
  }

  const updateProduct = (id: string, updatedProduct: Omit<Product, 'id'>) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ))
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const handleAddProduct = () => {
    if (newProductName && newProductPrice && newProductStock) {
      addProduct({ 
        name: newProductName, 
        price: parseFloat(newProductPrice), 
        stock: parseInt(newProductStock) 
      })
      setNewProductName("")
      setNewProductPrice("")
      setNewProductStock("")
      // Removed toast functionality
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
      // Removed toast functionality
    }
  }

  const handleRemoveProduct = (id: string) => {
    removeProduct(id)
    // Removed toast functionality
  }

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
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
            <Button onClick={handleAddProduct}>Add</Button>
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
                  <TableCell>${product.price.toFixed(2)}</TableCell>
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
        </CardContent>
      </Card>
    </Layout>
  )
}

