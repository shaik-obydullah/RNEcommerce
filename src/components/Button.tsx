import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native'
import { radius, spacing, typography } from '../theme'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  style?: object
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isSecondary = variant === 'secondary'
  const isGhost = variant === 'ghost'
  const isDanger = variant === 'danger'

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        pressed && (isSecondary || isGhost) && styles.pressedSubtle,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button">
      {loading ? (
        <ActivityIndicator color={isSecondary || isGhost ? '#4F46E5' : '#fff'} />
      ) : (
        <Text
          style={[
            styles.label,
            isSecondary && styles.labelSecondary,
            isGhost && styles.labelGhost,
            isDanger && styles.labelDanger,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  primary: { backgroundColor: '#4F46E5' },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#C7CDD4',
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: '#DC2626' },
  pressedSubtle: { opacity: 0.6 },
  disabled: { opacity: 0.5 },
  label: {
    ...typography.label,
    color: '#FFFFFF',
    fontSize: 15,
  },
  labelSecondary: { color: '#0F1419' },
  labelGhost: { color: '#4F46E5' },
  labelDanger: { color: '#FFFFFF' },
})