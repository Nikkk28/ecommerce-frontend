"use client"

import { useState, useEffect } from "react"
import { productAPI } from "@/lib/api"
import type { Product } from "@/types"

interface UseProductsOptions {
  category?: string
  search?: string
  page?: number
  limit?: number
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await productAPI.getProducts({
          category: options.category,
          q: options.search,
          page: options.page || 1,
          limit: options.limit || 12,
        })

        setProducts(response.data.content || [])
        setTotalCount(response.data.totalElements || 0)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [options.category, options.search, options.page, options.limit])

  return { products, totalCount, isLoading, error }
}
