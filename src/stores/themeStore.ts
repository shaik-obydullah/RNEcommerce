import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getColors, type ThemeMode } from '../theme'

const THEME_KEY = 'ecommerce.theme'

interface ThemeState {
  mode: ThemeMode
  toggle: () => void
  setMode: (mode: ThemeMode) => void
  hydrate: () => Promise<void>
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light',
  toggle: () => {
    const next = get().mode === 'light' ? 'dark' : 'light'
    set({ mode: next })
    AsyncStorage.setItem(THEME_KEY, next)
  },
  setMode: mode => {
    set({ mode })
    AsyncStorage.setItem(THEME_KEY, mode)
  },
  hydrate: async () => {
    const saved = await AsyncStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') {
      set({ mode: saved })
    }
  },
}))

export function useTheme() {
  const mode = useThemeStore(s => s.mode)
  return getColors(mode)
}

export function useIsDark() {
  const mode = useThemeStore(s => s.mode)
  return mode === 'dark'
}