"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useManagement } from "@/contexts/ManagementContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X } from "lucide-react"

export default function ProductsPage() {
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" })
  const { products, addProduct, removeProduct } = useManagement()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      console.error("Please fill in all fields")
      return
    }

    const price = parseFloat(newProduct.price)
    const stock = parseInt(newProduct.stock)
    if (isNaN(price) || isNaN(stock)) {
      console.error("Please enter valid numbers")
      return
    }

    addProduct(newProduct.name, price, stock)
    setNewProduct({ name: "", price: "", stock: "" })
    console.log("Product added successfully")
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Products</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <Input
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <Input
                  placeholder="Stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
              </div>
              <Button type="submit">Add Product</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>Kshs {product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          removeProduct(product.id)
                          console.log("Product removed successfully")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

