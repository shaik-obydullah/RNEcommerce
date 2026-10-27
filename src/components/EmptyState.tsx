import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useTheme } from '../stores/themeStore'
import { spacing, typography } from '../theme'

interface EmptyStateProps {
  icon: string
  title: string
  message?: string
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  const colors = useTheme()
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
        <Icon name={icon} size={32} color={colors.textMuted} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message ? <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: spacing.xl * 2 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.h3, marginBottom: spacing.xs },
  message: { ...typography.caption, textAlign: 'center' },
})