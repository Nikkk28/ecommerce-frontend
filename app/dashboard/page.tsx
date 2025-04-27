"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package2, ShoppingBag, User, Settings, Store, Heart, BarChart3, Home } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Browse Store</CardTitle>
                <CardDescription>Explore products and vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start">
                      <Home className="mr-2 h-4 w-4" />
                      Home Page
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="w-full justify-start">
                      <Package2 className="mr-2 h-4 w-4" />
                      All Products
                    </Button>
                  </Link>
                  <Link href="/vendors">
                    <Button variant="outline" className="w-full justify-start">
                      <Store className="mr-2 h-4 w-4" />
                      Vendors
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {user?.role === "CUSTOMER" && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Dashboard</CardTitle>
                  <CardDescription>Manage your orders and wishlist</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/dashboard/customer">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Customer Overview
                      </Button>
                    </Link>
                    <Link href="/dashboard/customer/orders">
                      <Button variant="outline" className="w-full justify-start">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        My Orders
                      </Button>
                    </Link>
                    <Link href="/dashboard/customer/wishlist">
                      <Button variant="outline" className="w-full justify-start">
                        <Heart className="mr-2 h-4 w-4" />
                        My Wishlist
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {user?.role === "VENDOR" && (
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Dashboard</CardTitle>
                  <CardDescription>Manage your products and orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/dashboard/vendor">
                      <Button variant="outline" className="w-full justify-start">
                        <Store className="mr-2 h-4 w-4" />
                        Vendor Overview
                      </Button>
                    </Link>
                    <Link href="/dashboard/vendor/products">
                      <Button variant="outline" className="w-full justify-start">
                        <Package2 className="mr-2 h-4 w-4" />
                        My Products
                      </Button>
                    </Link>
                    <Link href="/dashboard/vendor/orders">
                      <Button variant="outline" className="w-full justify-start">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Orders
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {user?.role === "ADMIN" && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Dashboard</CardTitle>
                  <CardDescription>Manage the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/dashboard/admin">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Admin Overview
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/users">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Users
                      </Button>
                    </Link>
                    <Link href="/dashboard/admin/vendors">
                      <Button variant="outline" className="w-full justify-start">
                        <Store className="mr-2 h-4 w-4" />
                        Vendors
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/cart")}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    View Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
