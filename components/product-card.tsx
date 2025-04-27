"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useWishlist } from "@/hooks/use-wishlist"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [isInWishlistState, setIsInWishlistState] = useState(isInWishlist(product.id))

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
      price: product.price,
      productName: product.name,
      productImage: product.imageUrl,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your wishlist",
        variant: "destructive",
      })
      return
    }

    try {
      if (isInWishlistState) {
        await removeFromWishlist(product.id)
        setIsInWishlistState(false)
      } else {
        await addToWishlist(product.id)
        setIsInWishlistState(true)
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <Image
              src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
        {product.inventory <= 0 && <Badge className="absolute left-2 top-2 bg-red-500">Out of Stock</Badge>}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 bg-background/80 hover:bg-background"
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-5 w-5 ${isInWishlistState ? "fill-red-500 text-red-500" : ""}`} />
          <span className="sr-only">{isInWishlistState ? "Remove from wishlist" : "Add to wishlist"}</span>
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{product.vendor?.username || "Unknown Vendor"}</div>
          <div className="flex items-center">
            <Star className="mr-1 h-3 w-3 fill-primary text-primary" />
            <span className="text-sm font-medium">
              {product.reviews && product.reviews.length > 0
                ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
                : "N/A"}
            </span>
          </div>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-2 font-semibold hover:underline">{product.name}</h3>
        </Link>
        <p className="mt-1 font-medium">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full" onClick={handleAddToCart} disabled={product.inventory <= 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  )
}
