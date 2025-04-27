"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Package2, ShoppingCart, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainNav() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()
  const { totalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/products",
      label: "Products",
      active: pathname === "/products",
    },
    {
      href: "/categories",
      label: "Categories",
      active: pathname === "/categories",
    },
    {
      href: "/vendors",
      label: "Vendors",
      active: pathname === "/vendors",
    },
  ]

  return (
    <div className="flex items-center">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="flex h-full flex-col">
            <div className="flex items-center border-b py-4">
              <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
                <Package2 className="h-6 w-6" />
                <span>MultiMart</span>
              </Link>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-4">
              <nav className="grid gap-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${
                      route.active ? "text-primary" : "text-muted-foreground"
                    } hover:text-primary`}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${
                    pathname === "/cart" ? "text-primary" : "text-muted-foreground"
                  } hover:text-primary`}
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                  {totalItems > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </nav>
              <div className="mt-4 border-t pt-4">
                {isAuthenticated ? (
                  <div className="grid gap-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                      {totalItems > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Package2 className="h-6 w-6" />
        <span className="hidden md:inline-block">MultiMart</span>
      </Link>
      <nav className="mx-6 hidden items-center space-x-4 md:flex">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`text-sm font-medium ${
              route.active ? "text-primary" : "text-muted-foreground"
            } hover:text-primary`}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="hidden md:ml-auto md:flex md:items-center md:gap-4">
        <ThemeToggle />
        {isAuthenticated ? (
          <>
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                My Account
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Register</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
