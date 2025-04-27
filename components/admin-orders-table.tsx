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
    customer: "John Doe",
    vendor: "TechGear",
    date: "2023-04-15T10:30:00Z",
    status: "Delivered",
    total: 109.98,
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    vendor: "HomeGoods",
    date: "2023-04-14T14:45:00Z",
    status: "Processing",
    total: 199.99,
  },
  {
    id: "ORD-003",
    customer: "Michael Brown",
    vendor: "EcoApparel",
    date: "2023-04-13T09:15:00Z",
    status: "Shipped",
    total: 59.97,
  },
  {
    id: "ORD-004",
    customer: "Emily Wilson",
    vendor: "LeatherCraft",
    date: "2023-04-12T16:20:00Z",
    status: "Pending",
    total: 149.95,
  },
  {
    id: "ORD-005",
    customer: "David Lee",
    vendor: "AudioTech",
    date: "2023-04-11T11:05:00Z",
    status: "Delivered",
    total: 79.99,
  },
]

export function AdminOrdersTable() {
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
            <TableHead>Customer</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.vendor}</TableCell>
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
                      <Link href={`/dashboard/admin/orders/${order.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                    <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                    <DropdownMenuItem>Contact Vendor</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
