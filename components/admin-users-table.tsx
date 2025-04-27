"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MoreHorizontal, User } from "lucide-react"

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
const mockUsers = [
  {
    id: "1",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "CUSTOMER",
    status: "Active",
    joinDate: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    username: "sarahjohnson",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    role: "CUSTOMER",
    status: "Active",
    joinDate: "2023-02-22T14:45:00Z",
  },
  {
    id: "3",
    username: "techgear",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael@techgear.com",
    role: "VENDOR",
    status: "Active",
    joinDate: "2023-01-10T09:15:00Z",
  },
  {
    id: "4",
    username: "emilyw",
    firstName: "Emily",
    lastName: "Wilson",
    email: "emily.w@example.com",
    role: "CUSTOMER",
    status: "Inactive",
    joinDate: "2023-03-05T16:20:00Z",
  },
  {
    id: "5",
    username: "homegoods",
    firstName: "David",
    lastName: "Lee",
    email: "david@homegoods.com",
    role: "VENDOR",
    status: "Active",
    joinDate: "2023-02-18T11:05:00Z",
  },
]

export function AdminUsersTable() {
  const [users, setUsers] = useState<typeof mockUsers>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    const fetchUsers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUsers(mockUsers)
      setIsLoading(false)
    }

    fetchUsers()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "ADMIN" ? "destructive" : user.role === "VENDOR" ? "outline" : "secondary"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
              </TableCell>
              <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
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
                      <Link href={`/dashboard/admin/users/${user.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                    <DropdownMenuItem>{user.status === "Active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
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
