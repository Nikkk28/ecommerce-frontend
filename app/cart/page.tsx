"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { orderAPI } from "@/lib/api"
import type { OrderStatus } from "@/types"

export default function CartPage() {
  const { cart, totalItems, totalAmount, updateQuantity, removeFromCart, clearCart, isLoading: cartLoading } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const shipping = 5.99
  const tax = totalAmount * 0.07
  const total = totalAmount + shipping + tax

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to proceed with checkout",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    setIsCheckingOut(true)
    try {
      // Create order data structure to match backend
      const orderData = {
        customerId: user?.id,
        status: "PENDING" as OrderStatus,
        totalAmount: total,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: user?.addresses[0], // Use first address as shipping address
      }

      // Create order via API
      const response = await orderAPI.createOrder(orderData)

      // Clear cart after successful order
      await clearCart()

      toast({
        title: "Order placed successfully",
        description: "Your order has been placed successfully",
      })

      // Redirect to order confirmation page
      router.push(`/orders/${response.data.id}`)
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue shopping
          </Link>

          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

          {cartLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : totalItems === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven&apos;t added any products to your cart yet.
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="rounded-lg border shadow-sm">
                  <div className="p-6 space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={item.productImage || "/placeholder.svg?height=96&width=96"}
                            alt={item.productName || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.productName}</h3>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                className="h-8 w-12 text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-lg border shadow-sm">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-6" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Checkout"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
