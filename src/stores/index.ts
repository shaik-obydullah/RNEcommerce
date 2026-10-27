import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from '../api/endpoints'
import { setAuthToken } from '../api/client'
import type { Cart, Product, User } from '../api/types'

const TOKEN_KEY = 'ecommerce.token'
const USER_KEY = 'ecommerce.user'

interface CartState {
  items: Cart['items']
  loading: boolean
  hydrate: () => Promise<void>
  add: (product: Product, quantity?: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  remove: (productId: number) => Promise<void>
  clear: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  hydrate: async () => {
    try {
      const cart = await api.cart.get()
      set({ items: cart.items })
    } catch {
      set({ items: [] })
    }
  },
  add: async (product, quantity = 1) => {
    const current = get().items.find(i => i.product.id === product.id)
    const nextQuantity = (current?.quantity ?? 0) + quantity
    const cart = await api.cart.add(product.id, nextQuantity)
    set({ items: cart.items })
  },
  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      await api.cart.remove(productId)
    } else {
      await api.cart.update(productId, quantity)
    }
    const cart = await api.cart.get()
    set({ items: cart.items })
  },
  remove: async productId => {
    await api.cart.remove(productId)
    const cart = await api.cart.get()
    set({ items: cart.items })
  },
  clear: () => set({ items: [] }),
}))

interface AuthState {
  user: User | null
  token: string | null
  initialized: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  initialized: false,
  login: async (email, password) => {
    const data = await api.auth.login(email, password)
    setAuthToken(data.token)
    await AsyncStorage.setItem(TOKEN_KEY, data.token)
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user))
    set({ user: data.user, token: data.token, initialized: true })
  },
  register: async (name, email, password) => {
    const data = await api.auth.register(name, email, password)
    setAuthToken(data.token)
    await AsyncStorage.setItem(TOKEN_KEY, data.token)
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user))
    set({ user: data.user, token: data.token, initialized: true })
  },
  logout: async () => {
    setAuthToken(null)
    await AsyncStorage.removeItem(TOKEN_KEY)
    await AsyncStorage.removeItem(USER_KEY)
    set({ user: null, token: null, initialized: true })
  },
  hydrate: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY)
    const userRaw = await AsyncStorage.getItem(USER_KEY)
    if (token && userRaw) {
      setAuthToken(token)
      set({ token, user: JSON.parse(userRaw), initialized: true })
      return
    }
    set({ initialized: true })
  },
}))