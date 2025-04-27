"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data - would be fetched from API in real implementation
const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 89.99,
    image: "/placeholder.svg?height=40&width=40",
    inventory: 24,
    status: "In Stock",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image: "/placeholder.svg?height=40&width=40",
    inventory: 12,
    status: "In Stock",
    category: "Electronics",
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=40&width=40",
    inventory: 36,
    status: "In Stock",
    category: "Clothing",
  },
  {
    id: "4",
    name: "Ceramic Coffee Mug",
    price: 19.99,
    image: "/placeholder.svg?height=40&width=40",
    inventory: 0,
    status: "Out of Stock",
    category: "Home & Kitchen",
  },
  {
    id: "5",
    name: "Leather Wallet",
    price: 49.99,
    image: "/placeholder.svg?height=40&width=40",
    inventory: 8,
    status: "Low Stock",
    category: "Accessories",
  },
]

export function VendorProductsTable() {
  const [products, setProducts] = useState<typeof mockProducts>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API fetch
    const fetchProducts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProducts(mockProducts)
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully",
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 relative overflow-hidden rounded-md">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <span className="font-medium">{product.name}</span>
                </div>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    product.status === "In Stock" ? "default" : product.status === "Low Stock" ? "outline" : "secondary"
                  }
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell>{product.inventory}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/vendor/products/${product.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
