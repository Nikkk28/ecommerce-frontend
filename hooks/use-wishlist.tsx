"use client"

import { useState, useEffect } from "react"
import { wishlistAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/types"

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    setIsLoading(true)
    try {
      const response = await wishlistAPI.getWishlist()
      setWishlistItems(response.data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      console.error("Error fetching wishlist:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    try {
      await wishlistAPI.addToWishlist(productId)
      await fetchWishlist() // Refresh wishlist

      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist",
      })
    } catch (err) {
      console.error("Error adding to wishlist:", err)
      toast({
        variant: "destructive",
        title: "Failed to add to wishlist",
        description: "There was an error adding the product to your wishlist",
      })
      throw err
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      await wishlistAPI.removeFromWishlist(productId)
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId))

      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist",
      })
    } catch (err) {
      console.error("Error removing from wishlist:", err)
      toast({
        variant: "destructive",
        title: "Failed to remove from wishlist",
        description: "There was an error removing the product from your wishlist",
      })
      throw err
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  return {
    wishlistItems,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
  }
}
