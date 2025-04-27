import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

// Mock data - would be fetched from API in real implementation
const categories = [
  {
    id: "1",
    name: "Electronics",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 128,
  },
  {
    id: "2",
    name: "Clothing",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 256,
  },
  {
    id: "3",
    name: "Home & Kitchen",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 192,
  },
  {
    id: "4",
    name: "Beauty & Personal Care",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 164,
  },
  {
    id: "5",
    name: "Sports & Outdoors",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 112,
  },
  {
    id: "6",
    name: "Books",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 320,
  },
]

export function CategoryShowcase() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-square overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={200}
                height={200}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-4 text-center">
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.productCount} products</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
