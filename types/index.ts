// User related types
export type Role = "ADMIN" | "VENDOR" | "CUSTOMER"

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: Role
  address: Address
  storeDetails?: StoreDetails
  reviews?: Review[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  userId: string
}

export interface StoreDetails {
  id: string
  name: string
  description: string
  address: string
  logo?: string
  rating?: number
  createdAt: string
  userId: string
}

// Product related types
export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: Category
  inventory: number
  imageUrl: string
  vendor: User
  reviews?: Review[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  parentCategory?: Category
  products?: Product[]
}

// Cart related types
export interface Cart {
  id: string
  user: User
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  subtotal: number
  // Transient fields
  productName?: string
  imageUrl?: string
}

// Order related types
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface Order {
  id: string
  orderDate: string
  status: OrderStatus
  totalAmount: number
  shippingAddress: Address
  items: OrderItem[]
  customer: User
  coupon?: Coupon
  shippingMethod: ShippingMethod
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  subtotal: number
  imageUrl?: string
  // Transient fields
  productName?: string
}

// Payment related types
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

export interface Payment {
  id: string
  amount: number
  status: PaymentStatus
  transactionId?: string
  order: Order
  createdAt: string
}

// Review related types
export interface Review {
  id: string
  rating: number
  comment: string
  product: Product
  user: User
  createdAt: string
  updatedAt: string
}

// Coupon related types
export type DiscountType = "PERCENTAGE" | "FLAT"

export interface Coupon {
  id: string
  code: string
  discountType: DiscountType
  value: number
  expiryDate: string
  applicableProducts?: Product[]
}

// Shipping related types
export interface ShippingMethod {
  id: string
  name: string
  cost: number
  supportedRegions: string[]
}

// Wishlist related types
export interface Wishlist {
  id: string
  createdAt: string
  user: User
  products: Product[]
}

// Registration data type
export interface RegisterData {
  username: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  role: Role
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  storeDetails?: {
    name: string
    description: string
    address: string
  }
}
