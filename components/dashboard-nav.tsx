"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  Settings,
  Store,
  Heart,
  BarChart3,
  Package2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const vendorRoutes = [
    {
      href: "/dashboard/vendor",
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === "/dashboard/vendor",
    },
    {
      href: "/dashboard/vendor/products",
      label: "Products",
      icon: Package,
      active: pathname === "/dashboard/vendor/products" || pathname.startsWith("/dashboard/vendor/products/"),
    },
    {
      href: "/dashboard/vendor/orders",
      label: "Orders",
      icon: ShoppingBag,
      active: pathname === "/dashboard/vendor/orders" || pathname.startsWith("/dashboard/vendor/orders/"),
    },
    {
      href: "/dashboard/vendor/customers",
      label: "Customers",
      icon: Users,
      active: pathname === "/dashboard/vendor/customers",
    },
    {
      href: "/dashboard/vendor/analytics",
      label: "Analytics",
      icon: BarChart3,
      active: pathname === "/dashboard/vendor/analytics",
    },
    {
      href: "/dashboard/vendor/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/vendor/settings",
    },
  ]

  const adminRoutes = [
    {
      href: "/dashboard/admin",
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === "/dashboard/admin",
    },
    {
      href: "/dashboard/admin/users",
      label: "Users",
      icon: Users,
      active: pathname === "/dashboard/admin/users",
    },
    {
      href: "/dashboard/admin/vendors",
      label: "Vendors",
      icon: Store,
      active: pathname === "/dashboard/admin/vendors",
    },
    {
      href: "/dashboard/admin/products",
      label: "Products",
      icon: Package,
      active: pathname === "/dashboard/admin/products",
    },
    {
      href: "/dashboard/admin/orders",
      label: "Orders",
      icon: ShoppingBag,
      active: pathname === "/dashboard/admin/orders",
    },
    {
      href: "/dashboard/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
      active: pathname === "/dashboard/admin/analytics",
    },
    {
      href: "/dashboard/admin/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/admin/settings",
    },
  ]

  const customerRoutes = [
    {
      href: "/dashboard/customer",
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === "/dashboard/customer",
    },
    {
      href: "/dashboard/customer/orders",
      label: "Orders",
      icon: ShoppingBag,
      active: pathname === "/dashboard/customer/orders",
    },
    {
      href: "/dashboard/customer/wishlist",
      label: "Wishlist",
      icon: Heart,
      active: pathname === "/dashboard/customer/wishlist",
    },
    {
      href: "/dashboard/customer/payment",
      label: "Payment Methods",
      icon: CreditCard,
      active: pathname === "/dashboard/customer/payment",
    },
    {
      href: "/dashboard/customer/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/customer/settings",
    },
  ]

  let routes = customerRoutes
  if (user?.role === "VENDOR") {
    routes = vendorRoutes
  } else if (user?.role === "ADMIN") {
    routes = adminRoutes
  }

  return (
    <nav className="hidden w-64 border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2 p-4">
        <div className="flex-1 overflow-auto py-2">
          <div className="grid gap-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              <Package2 className="h-4 w-4" />
              Back to Store
            </Link>

            <div className="my-2 h-px bg-muted-foreground/20"></div>

            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted",
                  route.active ? "bg-muted text-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
