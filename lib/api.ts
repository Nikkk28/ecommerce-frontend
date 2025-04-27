import axios from "axios"

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken")
        const response = await axios.post("http://localhost:8080/api/auth/refresh-token", { refreshToken })

        // If token refresh is successful
        if (response.status === 200) {
          // Update tokens in localStorage
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("refreshToken", response.data.refreshToken)

          // Update Authorization header
          api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

          // Retry original request
          return api(originalRequest)
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        window.location.href = "/auth/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (username: string, password: string) => api.post("/auth/login", { username, password }),
  register: (userData: any) => {
    console.log("API register called with:", userData)

    // Add timeout to prevent long waiting times on network issues
    return api
      .post("/auth/register", userData, {
        timeout: 10000, // 10 seconds timeout
      })
      .catch((error) => {
        console.error("Registration API error:", error)

        // If in development mode and server is not available, simulate a successful response
        if (process.env.NODE_ENV === "development" && axios.isAxiosError(error) && !error.response) {
          console.log("Development mode: Simulating API response")

          // Return a mock successful response
          return Promise.resolve({
            data: {
              success: true,
              message: "Account created successfully (simulated)",
            },
          })
        }

        // Otherwise, propagate the error
        return Promise.reject(error)
      })
  },
  refreshToken: (refreshToken: string) => api.post("/auth/refresh-token", { refreshToken }),
  validateToken: (token: string) => api.post("/auth/validate", { token }),
}

// User API
export const userAPI = {
  getProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  getUsers: () => api.get("/users"),
}

// Product API
export const productAPI = {
  getProducts: (params?: any) => api.get("/products", { params }),
  searchProducts: (query: string) => api.get(`/products/search?q=${query}`),
  getProduct: (id: string) => api.get(`/products/${id}`),
  createProduct: (productData: any) => api.post("/products", productData),
  updateProduct: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
}

// Category API
export const categoryAPI = {
  getCategories: () => api.get("/categories"),
  getCategory: (id: string) => api.get(`/categories/${id}`),
  createCategory: (categoryData: any) => api.post("/categories", categoryData),
  updateCategory: (id: string, categoryData: any) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
}

// Order API
export const orderAPI = {
  getOrders: (params?: any) => api.get("/orders", { params }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  createOrder: (orderData: any) => api.post("/orders", orderData),
  updateOrderStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
}

// Cart API
export const cartAPI = {
  getCart: () => api.get("/cart"),
  addCartItem: (itemData: any) => api.post("/cart/items", itemData),
  updateCartItem: (itemId: string, itemData: any) => api.put(`/cart/items/${itemId}`, itemData),
  removeCartItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete("/cart"),
}

// Review API
export const reviewAPI = {
  getProductReviews: (productId: string) => api.get(`/products/${productId}/reviews`),
  addReview: (productId: string, reviewData: any) => api.post(`/products/${productId}/reviews`, reviewData),
  updateReview: (id: string, reviewData: any) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
}

// Coupon API
export const couponAPI = {
  getCoupons: () => api.get("/coupons"),
  getCoupon: (id: string) => api.get(`/coupons/${id}`),
  validateCoupon: (code: string) => api.get(`/coupons/validate/${code}`),
  createCoupon: (couponData: any) => api.post("/coupons", couponData),
  updateCoupon: (id: string, couponData: any) => api.put(`/coupons/${id}`, couponData),
  deleteCoupon: (id: string) => api.delete(`/coupons/${id}`),
}

// Shipping API
export const shippingAPI = {
  getShippingMethods: () => api.get("/shipping-methods"),
  getShippingMethod: (id: string) => api.get(`/shipping-methods/${id}`),
  createShippingMethod: (methodData: any) => api.post("/shipping-methods", methodData),
  updateShippingMethod: (id: string, methodData: any) => api.put(`/shipping-methods/${id}`, methodData),
  deleteShippingMethod: (id: string) => api.delete(`/shipping-methods/${id}`),
}

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (productId: string) => api.post(`/wishlist/products/${productId}`),
  removeFromWishlist: (productId: string) => api.delete(`/wishlist/products/${productId}`),
}

export default api
