"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MoreHorizontal, Store } from "lucide-react"

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
const mockVendors = [
  {
    id: "1",
    storeName: "TechGear",
    ownerName: "Michael Brown",
    email: "michael@techgear.com",
    productCount: 48,
    status: "Approved",
    joinDate: "2023-01-10T09:15:00Z",
  },
  {
    id: "2",
    storeName: "HomeGoods",
    ownerName: "David Lee",
    email: "david@homegoods.com",
    productCount: 36,
    status: "Approved",
    joinDate: "2023-02-18T11:05:00Z",
  },
  {
    id: "3",
    storeName: "EcoApparel",
    ownerName: "Lisa Chen",
    email: "lisa@ecoapparel.com",
    productCount: 24,
    status: "Approved",
    joinDate: "2023-03-05T14:30:00Z",
  },
  {
    id: "4",
    storeName: "LeatherCraft",
    ownerName: "Robert Johnson",
    email: "robert@leathercraft.com",
    productCount: 18,
    status: "Pending",
    joinDate: "2023-04-12T10:15:00Z",
  },
  {
    id: "5",
    storeName: "AudioTech",
    ownerName: "Jennifer Smith",
    email: "jennifer@audiotech.com",
    productCount: 32,
    status: "Approved",
    joinDate: "2023-02-25T09:45:00Z",
  },
]

export function AdminVendorsTable() {
  const [vendors, setVendors] = useState<typeof mockVendors>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    const fetchVendors = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setVendors(mockVendors)
      setIsLoading(false)
    }

    fetchVendors()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Store className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{vendor.storeName}</p>
                    <p className="text-sm text-muted-foreground">{vendor.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{vendor.ownerName}</TableCell>
              <TableCell>{vendor.productCount}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    vendor.status === "Approved" ? "default" : vendor.status === "Pending" ? "outline" : "secondary"
                  }
                >
                  {vendor.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(vendor.joinDate).toLocaleDateString()}</TableCell>
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
                      <Link href={`/dashboard/admin/vendors/${vendor.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Products</DropdownMenuItem>
                    {vendor.status === "Pending" ? (
                      <DropdownMenuItem>Approve Vendor</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        Suspend Vendor
                      </DropdownMenuItem>
                    )}
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
