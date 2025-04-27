"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  const categories = [
    { id: "electronics", label: "Electronics" },
    { id: "clothing", label: "Clothing" },
    { id: "home", label: "Home & Kitchen" },
    { id: "beauty", label: "Beauty & Personal Care" },
    { id: "sports", label: "Sports & Outdoors" },
    { id: "books", label: "Books" },
    { id: "toys", label: "Toys & Games" },
  ]

  const vendors = [
    { id: "audiotech", label: "AudioTech" },
    { id: "techgear", label: "TechGear" },
    { id: "ecoapparel", label: "EcoApparel" },
    { id: "homegoods", label: "HomeGoods" },
    { id: "leathercraft", label: "LeatherCraft" },
    { id: "ecoliving", label: "EcoLiving" },
  ]

  const ratings = [4, 3, 2, 1]

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors((prev) => (prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]))
  }

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) => (prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]))
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }

  const resetFilters = () => {
    setPriceRange([0, 500])
    setSelectedCategories([])
    setSelectedVendors([])
    setSelectedRatings([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Price Range</h4>
        <Slider defaultValue={[0, 500]} max={500} step={10} value={priceRange} onValueChange={handlePriceChange} />
        <div className="flex items-center justify-between">
          <span className="text-sm">${priceRange[0]}</span>
          <span className="text-sm">${priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["categories", "vendors", "ratings"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm font-normal">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vendors">
          <AccordionTrigger>Vendors</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`vendor-${vendor.id}`}
                    checked={selectedVendors.includes(vendor.id)}
                    onCheckedChange={() => toggleVendor(vendor.id)}
                  />
                  <Label htmlFor={`vendor-${vendor.id}`} className="text-sm font-normal">
                    {vendor.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ratings">
          <AccordionTrigger>Ratings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={() => toggleRating(rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm font-normal flex items-center">
                    {rating}+ Stars
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <Button className="w-full">Apply Filters</Button>
    </div>
  )
}
