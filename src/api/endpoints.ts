import { get, post, del } from './client'
import type {
  AuthResponse,
  Cart,
  Category,
  Order,
  Paginated,
  Product,
} from './types'

const PAGE_SIZE = 20

export const api = {
  auth: {
    login: (email: string, password: string) =>
      post<AuthResponse>('/login', { email, password }),
    register: (name: string, email: string, password: string) =>
      post<AuthResponse>('/register', { name, email, password }),
  },
  categories: {
    list: () => get<Paginated<Category>>('/categories', { per_page: 50 }),
  },
  products: {
    list: (params?: {
      page?: number
      perPage?: number
      category?: number
      search?: string
      sort?: 'latest' | 'price_asc' | 'price_desc'
    }) =>
      get<Paginated<Product>>('/products', {
        page: params?.page ?? 1,
        per_page: params?.perPage ?? PAGE_SIZE,
        category_id: params?.category,
        search: params?.search,
        sort: params?.sort,
      }),
    detail: (id: number) => get<Product>(`/products/${id}`),
  },
  cart: {
    get: () => get<Cart>('/cart'),
    add: (productId: number, quantity: number) =>
      post<Cart>('/cart', { product_id: productId, quantity }),
    update: (productId: number, quantity: number) =>
      post<Cart>('/cart', { product_id: productId, quantity }),
    remove: (productId: number) => del<Cart>(`/cart/${productId}`),
  },
  orders: {
    list: () => get<Paginated<Order>>('/orders', { per_page: 50 }),
    place: (body: {
      address: string
      city: string
      country: string
      paymentMethod: string
    }) => post<Order>('/orders', body),
  },
}