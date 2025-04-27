"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { authAPI, userAPI } from "@/lib/api"
import type { User, RegisterData } from "@/types"
import axios from "axios"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<User>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // Validate token with backend
          try {
            await authAPI.validateToken(token)
            // If token is valid, get user data
            const userData = JSON.parse(localStorage.getItem("user") || "{}")
            if (userData.id) {
              const response = await userAPI.getProfile(userData.id)
              setUser(response.data)
            }
          } catch (error) {
            console.error("Token validation error:", error)
            // If token validation fails, clear storage
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("user")
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Update the register function to better handle network errors
  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      console.log("Registering with data:", data)

      // Try to register with the backend
      try {
        const response = await authAPI.register(data)
        console.log("Registration response:", response)

        toast({
          title: "Registration successful",
          description: "Your account has been created. Please log in.",
        })

        return response.data
      } catch (error) {
        // Handle network errors specifically
        if (axios.isAxiosError(error) && !error.response) {
          console.error("Network error during registration:", error)

          // For demo purposes: simulate successful registration when backend is unavailable
          if (process.env.NODE_ENV === "development") {
            console.log("Development mode: Simulating successful registration")

            toast({
              title: "Development mode",
              description: "Backend connection failed, but registration simulated successfully. Please log in.",
            })

            // Return mock data for development
            return { success: true }
          }

          // In production, show network error
          toast({
            variant: "destructive",
            title: "Connection failed",
            description: "Cannot connect to the server. Please check your internet connection and try again.",
          })
          throw new Error("Network error: Cannot connect to the server")
        }

        // Handle other API errors
        let errorMessage = "Failed to create account. Please try again."

        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 409) {
            errorMessage = "Username or email already exists"
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message
          }
        }

        toast({
          variant: "destructive",
          title: "Registration failed",
          description: errorMessage,
        })
        throw error
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Attempting login for:", username)
      const response = await authAPI.login(username, password)
      console.log("Login response:", response)

      // Log the full response structure to debug
      console.log("Full login response structure:", JSON.stringify(response))

      // Handle different response formats
      let userData
      let token
      let refreshToken

      // Check if the response has the expected structure
      if (response.data?.user) {
        // Standard format with user object
        userData = response.data.user
        token = response.data.token
        refreshToken = response.data.refreshToken
      } else if (response.data?.id) {
        // Alternative format where user data is directly in the response
        userData = response.data
        token = response.data.token || response.headers?.authorization?.replace("Bearer ", "")
        refreshToken = response.data.refreshToken
      } else if (process.env.NODE_ENV === "development") {
        // In development, create mock data if response format is unexpected
        console.log("Development mode: Creating mock user data")
        userData = {
          id: "dev-user-id",
          username: username,
          firstName: username,
          lastName: "User",
          email: `${username}@example.com`,
          role: "CUSTOMER",
          createdAt: new Date().toISOString(),
        }
        token = "mock-jwt-token"
        refreshToken = "mock-refresh-token"
      } else {
        throw new Error("Unexpected response format from server")
      }

      if (!userData) {
        throw new Error("Invalid response format: missing user data")
      }

      // Store tokens and user data
      localStorage.setItem("token", token)
      localStorage.setItem("refreshToken", refreshToken || "")
      localStorage.setItem("user", JSON.stringify(userData))

      setUser(userData)

      // Safely access firstName with fallback to username
      const displayName = userData.firstName || username

      toast({
        title: "Login successful",
        description: `Welcome back, ${displayName}!`,
      })

      return userData
    } catch (error) {
      console.error("Login error:", error)

      // Handle network errors specifically
      if (axios.isAxiosError(error) && !error.response) {
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: "Cannot connect to the server. Please check your internet connection and try again.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return

    try {
      const response = await userAPI.updateProfile(user.id, userData)
      setUser(response.data)
      localStorage.setItem("user", JSON.stringify(response.data))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Update profile error:", error)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile",
      })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
