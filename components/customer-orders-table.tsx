"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data - would be fetched from API in real implementation
const mockOrders = [
  {
    id: "ORD-001",
    date: "2023-04-15T10:30:00Z",
    status: "Delivered",
    items: 2,
    total: 109.98,
  },
  {
    id: "ORD-002",
    date: "2023-04-14T14:45:00Z",
    status: "Processing",
    items: 1,
    total: 199.99,
  },
  {
    id: "ORD-003",
    date: "2023-04-13T09:15:00Z",
    status: "Shipped",
    items: 3,
    total: 59.97,
  },
  {
    id: "ORD-004",
    date: "2023-04-12T16:20:00Z",
    status: "Pending",
    items: 2,
    total: 149.95,
  },
]

export function CustomerOrdersTable() {
  const [orders, setOrders] = useState<typeof mockOrders>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    const fetchOrders = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOrders(mockOrders)
      setIsLoading(false)
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                You haven&apos;t placed any orders yet.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Delivered"
                        ? "default"
                        : order.status === "Shipped"
                          ? "outline"
                          : order.status === "Processing"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/orders/${order.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Track Order</DropdownMenuItem>
                      {order.status !== "Delivered" && <DropdownMenuItem>Cancel Order</DropdownMenuItem>}
                      {order.status === "Delivered" && <DropdownMenuItem>Write Review</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
