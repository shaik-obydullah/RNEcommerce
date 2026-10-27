export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F7F8FA',
    card: '#FFFFFF',
    border: '#EEF0F3',
    text: '#0F1419',
    textSecondary: '#5B6472',
    textMuted: '#9AA3B0',
    primary: '#4F46E5',
    primaryPressed: '#4338CA',
    accent: '#F59E0B',
    success: '#16A34A',
    danger: '#DC2626',
    skeleton: '#E5E7EB',
    overlay: 'rgba(15, 20, 25, 0.5)',
  },
  dark: {
    background: '#0F1117',
    surface: '#171A22',
    card: '#1B1F28',
    border: '#262B36',
    text: '#F1F5F9',
    textSecondary: '#A0A8B8',
    textMuted: '#6B7280',
    primary: '#818CF8',
    primaryPressed: '#A5B4FC',
    accent: '#FBBF24',
    success: '#22C55E',
    danger: '#F87171',
    skeleton: '#2A2F3A',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
}

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
}

export const typography = {
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  h3: { fontSize: 17, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
}

export type ThemeMode = 'light' | 'dark'

export interface ThemeColors {
  background: string
  surface: string
  card: string
  border: string
  text: string
  textSecondary: string
  textMuted: string
  primary: string
  primaryPressed: string
  accent: string
  success: string
  danger: string
  skeleton: string
  overlay: string
}

export const getColors = (mode: ThemeMode): ThemeColors =>
  mode === 'dark' ? colors.dark : colors.light

export const formatPrice = (cents: number): string =>
  `$${(cents / 100).toFixed(2)}`