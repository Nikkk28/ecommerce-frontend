"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Store, ShoppingBag, DollarSign, BarChart3, Home, Package2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminUsersTable } from "@/components/admin-users-table"
import { AdminVendorsTable } from "@/components/admin-vendors-table"
import { AdminOrdersTable } from "@/components/admin-orders-table"
import { useAuth } from "@/context/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (user && user.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, user, router])

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
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {/* Add this section after the title */}
          <div className="mb-6 flex flex-wrap gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Store Home
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="sm">
                <Package2 className="mr-2 h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link href="/vendors">
              <Button variant="outline" size="sm">
                <Store className="mr-2 h-4 w-4" />
                Vendors
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+86 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36</div>
                <p className="text-xs text-muted-foreground">+3 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">528</div>
                <p className="text-xs text-muted-foreground">+42 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$48,325.50</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Revenue and user growth for the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <span className="ml-4 text-muted-foreground">Analytics chart will appear here</span>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="users">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-4">
              <AdminUsersTable />
            </TabsContent>
            <TabsContent value="vendors" className="mt-4">
              <AdminVendorsTable />
            </TabsContent>
            <TabsContent value="orders" className="mt-4">
              <AdminOrdersTable />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
