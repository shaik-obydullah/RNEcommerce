import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../stores/themeStore'
import { api } from '../api/endpoints'
import { EmptyState } from '../components/EmptyState'
import { spacing, typography } from '../theme'
import type { Order } from '../api/types'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { HomeTabParamList } from '../navigation/types'

type Props = BottomTabScreenProps<HomeTabParamList, 'Orders'>

const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function OrdersScreen(_props: Props) {
  const colors = useTheme()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await api.orders.list()
      setOrders(res.data)
      setError('')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onRefresh = () => {
    setRefreshing(true)
    load()
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textMuted }}>Loading orders…</Text>
      </View>
    )
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={orders}
      keyExtractor={o => String(o.id)}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListEmptyComponent={
        error ? (
          <EmptyState icon="alert-circle" title="Couldn't load orders" message={error} />
        ) : (
          <EmptyState icon="inbox" title="No orders yet" message="Your placed orders will appear here." />
        )
      }
      renderItem={({ item }) => (
        <View style={[styles.order, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={[styles.orderNumber, { color: colors.text }]}>{item.number}</Text>
              <Text style={{ color: colors.textMuted }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View>
              <Text style={[styles.orderTotal, { color: colors.text }]}>{usd(item.total)}</Text>
              <Text style={[styles.status, { color: colors.primary }]}>
                {STATUS_LABEL[item.status] ?? item.status}
              </Text>
            </View>
          </View>
          <View style={styles.items}>
            {item.items.map((ii, idx) => (
              <Text key={idx} numberOfLines={1} style={{ color: colors.textSecondary }}>
                {ii.quantity}× {ii.name}
              </Text>
            ))}
          </View>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.lg },
  order: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  orderNumber: { ...typography.h3, fontSize: 16 },
  orderTotal: { ...typography.h3, fontSize: 16, textAlign: 'right' },
  status: { ...typography.label, textAlign: 'right' },
  items: { gap: 2 },
})