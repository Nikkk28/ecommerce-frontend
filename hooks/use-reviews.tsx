"use client"

import { useState, useEffect } from "react"
import { reviewAPI } from "@/lib/api"
import type { Review } from "@/types"

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        const response = await reviewAPI.getProductReviews(productId)
        setReviews(response.data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchReviews()
    }
  }, [productId])

  const addReview = async (reviewData: Omit<Review, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await reviewAPI.addReview(productId, reviewData)
      setReviews((prev) => [response.data, ...prev])
      return response.data
    } catch (error) {
      throw error
    }
  }

  return { reviews, isLoading, error, addReview }
}
