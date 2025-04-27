"use client"

import { useState, useEffect } from "react"
import { productAPI } from "@/lib/api"
import type { Product } from "@/types"

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const response = await productAPI.getProduct(id)
        setProduct(response.data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, isLoading, error }
}
