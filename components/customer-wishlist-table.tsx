"use client"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useWishlist } from "@/hooks/use-wishlist"
import type { Product } from "@/types"

export function CustomerWishlistTable() {
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleRemove = async (id: string) => {
    try {
      await removeFromWishlist(id)
      toast({
        title: "Item removed",
        description: "Item has been removed from your wishlist",
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  const handleAddToCart = (product: Product) => {
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

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wishlistItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Your wishlist is empty.
              </TableCell>
            </TableRow>
          ) : (
            wishlistItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 relative overflow-hidden rounded-md">
                      <Image
                        src={item.imageUrl || "/placeholder.svg?height=40&width=40"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Link href={`/products/${item.id}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.vendor?.username || "Unknown Vendor"}</TableCell>
                <TableCell>
                  <span className={item.inventory > 0 ? "text-green-600" : "text-red-600"}>
                    {item.inventory > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddToCart(item)}
                      disabled={item.inventory <= 0}
                      title="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
