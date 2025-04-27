"use client"

import { useState, useEffect } from "react"
import { orderAPI } from "@/lib/api"
import type { Order, OrderStatus } from "@/types"

interface UseOrdersOptions {
  status?: OrderStatus
  page?: number
  limit?: number
}

export function useOrders(options: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await orderAPI.getOrders({
          status: options.status,
          page: options.page || 1,
          limit: options.limit || 10,
        })

        setOrders(response.data.content || [])
        setTotalCount(response.data.totalElements || 0)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [options.status, options.page, options.limit])

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, status)

      // Update the order in the local state
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))

      return response.data
    } catch (error) {
      throw error
    }
  }

  return { orders, totalCount, isLoading, error, updateOrderStatus }
}
