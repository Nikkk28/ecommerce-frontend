"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { cartAPI } from "@/lib/api"
import type { Cart, CartItem } from "@/types"
import { useAuth } from "./auth-context"

interface CartContextType {
  cart: CartItem[]
  totalItems: number
  totalAmount: number
  isLoading: boolean
  addToCart: (item: Omit<CartItem, "id" | "cartId" | "subtotal">) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Fetch cart from API when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      // If not authenticated, try to load from localStorage
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart.items || [])
          setTotalItems(parsedCart.totalItems || 0)
          setTotalAmount(parsedCart.totalAmount || 0)
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error)
          localStorage.removeItem("cart")
        }
      }
    }
  }, [isAuthenticated])

  // Save cart to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated && cart.length > 0) {
      const cartData = {
        items: cart,
        totalItems,
        totalAmount,
      }
      localStorage.setItem("cart", JSON.stringify(cartData))
    }
  }, [cart, totalItems, totalAmount, isAuthenticated])

  const fetchCart = async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    try {
      const response = await cartAPI.getCart()
      const cartData: Cart = response.data
      setCart(cartData.items || [])
      setTotalItems(cartData.totalItems || 0)
      setTotalAmount(cartData.totalAmount || 0)
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (item: Omit<CartItem, "id" | "cartId" | "subtotal">) => {
    setIsLoading(true)
    try {
      if (isAuthenticated) {
        // Add to server cart
        await cartAPI.addCartItem(item)
        await fetchCart() // Refresh cart from server
      } else {
        // Add to local cart
        const existingItemIndex = cart.findIndex((cartItem) => cartItem.productId === item.productId)

        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedCart = [...cart]
          const existingItem = updatedCart[existingItemIndex]
          const newQuantity = existingItem.quantity + item.quantity

          updatedCart[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
            subtotal: newQuantity * existingItem.price,
          }

          setCart(updatedCart)
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `local-${Date.now()}`,
            cartId: "local-cart",
            ...item,
            subtotal: item.quantity * item.price,
          }

          setCart([...cart, newItem])
        }

        // Update totals
        updateCartTotals([...cart])
      }

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        variant: "destructive",
        title: "Failed to add item",
        description: "There was an error adding the item to your cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (id: string) => {
    setIsLoading(true)
    try {
      if (isAuthenticated) {
        // Remove from server cart
        await cartAPI.removeCartItem(id)
        await fetchCart() // Refresh cart from server
      } else {
        // Remove from local cart
        const updatedCart = cart.filter((item) => item.id !== id)
        setCart(updatedCart)
        updateCartTotals(updatedCart)
      }

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        variant: "destructive",
        title: "Failed to remove item",
        description: "There was an error removing the item from your cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) return

    setIsLoading(true)
    try {
      if (isAuthenticated) {
        // Update server cart
        const item = cart.find((item) => item.id === id)
        if (item) {
          await cartAPI.updateCartItem(id, { ...item, quantity })
          await fetchCart() // Refresh cart from server
        }
      } else {
        // Update local cart
        const updatedCart = cart.map((item) =>
          item.id === id ? { ...item, quantity, subtotal: quantity * item.price } : item,
        )

        setCart(updatedCart)
        updateCartTotals(updatedCart)
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        variant: "destructive",
        title: "Failed to update cart",
        description: "There was an error updating your cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      if (isAuthenticated) {
        // Clear server cart
        await cartAPI.clearCart()
        await fetchCart() // Refresh cart from server
      } else {
        // Clear local cart
        setCart([])
        setTotalItems(0)
        setTotalAmount(0)
        localStorage.removeItem("cart")
      }

      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        variant: "destructive",
        title: "Failed to clear cart",
        description: "There was an error clearing your cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to update cart totals for local cart
  const updateCartTotals = (cartItems: CartItem[]) => {
    const items = cartItems.reduce((total, item) => total + item.quantity, 0)
    const amount = cartItems.reduce((total, item) => total + item.subtotal, 0)

    setTotalItems(items)
    setTotalAmount(amount)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalAmount,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
