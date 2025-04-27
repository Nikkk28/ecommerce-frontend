"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data - would be fetched from API in real implementation
const mockProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 89.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviewCount: 128,
    vendor: "AudioTech",
    isNew: true,
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.2,
    reviewCount: 85,
    vendor: "TechGear",
    isNew: false,
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviewCount: 42,
    vendor: "EcoApparel",
    isNew: false,
  },
  {
    id: "4",
    name: "Ceramic Coffee Mug",
    price: 19.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviewCount: 67,
    vendor: "HomeGoods",
    isNew: true,
  },
  {
    id: "5",
    name: "Leather Wallet",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.4,
    reviewCount: 36,
    vendor: "LeatherCraft",
    isNew: false,
  },
  {
    id: "6",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviewCount: 93,
    vendor: "EcoLiving",
    isNew: false,
  },
  {
    id: "7",
    name: "Wireless Charging Pad",
    price: 34.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    reviewCount: 54,
    vendor: "TechGear",
    isNew: true,
  },
  {
    id: "8",
    name: "Bamboo Cutting Board",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviewCount: 28,
    vendor: "HomeGoods",
    isNew: false,
  },
]

export function FeaturedProducts() {
  const [products, setProducts] = useState<typeof mockProducts>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
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

  const handleAddToCart = (product: (typeof mockProducts)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </Link>
            {product.isNew && <Badge className="absolute left-2 top-2">New</Badge>}
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{product.vendor}</div>
              <div className="flex items-center">
                <Star className="mr-1 h-3 w-3 fill-primary text-primary" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
            </div>
            <Link href={`/products/${product.id}`}>
              <h3 className="mt-2 font-semibold hover:underline">{product.name}</h3>
            </Link>
            <p className="mt-1 font-medium">${product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button variant="outline" className="w-full" onClick={() => handleAddToCart(product)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
