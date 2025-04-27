import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data - would be fetched from API in real implementation
const vendors = [
  {
    id: "1",
    name: "TechGear",
    image: "/placeholder.svg?height=100&width=100",
    productCount: 48,
    rating: 4.8,
    isFeatured: true,
  },
  {
    id: "2",
    name: "HomeGoods",
    image: "/placeholder.svg?height=100&width=100",
    productCount: 36,
    rating: 4.6,
    isFeatured: true,
  },
  {
    id: "3",
    name: "EcoApparel",
    image: "/placeholder.svg?height=100&width=100",
    productCount: 24,
    rating: 4.7,
    isFeatured: true,
  },
  {
    id: "4",
    name: "LeatherCraft",
    image: "/placeholder.svg?height=100&width=100",
    productCount: 18,
    rating: 4.9,
    isFeatured: true,
  },
]

export function VendorShowcase() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
      {vendors.map((vendor) => (
        <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full">
                  <Image src={vendor.image || "/placeholder.svg"} alt={vendor.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold">{vendor.name}</h3>
                <div className="mt-1 flex items-center">
                  <span className="text-sm font-medium">{vendor.rating}</span>
                  <span className="mx-1 text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{vendor.productCount} products</span>
                </div>
                {vendor.isFeatured && (
                  <Badge variant="outline" className="mt-3">
                    Featured Vendor
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
