export interface Category {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  image: string | null
  stock: number
  averageRating: number
  reviewCount: number
  categories: Category[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartTotals {
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export interface Cart {
  items: CartItem[]
  totals: CartTotals
}

export interface OrderItem {
  productId: number
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: number
  number: string
  status: string
  total: number
  items: OrderItem[]
  createdAt: string
}

export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Paginated<T> {
  data: T[]
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export const API_BASE_URL = 'http://10.0.2.2:8000/api'