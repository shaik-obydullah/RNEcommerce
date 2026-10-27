import React, { useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useTheme } from '../stores/themeStore'
import { useCartStore } from '../stores'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { radius, spacing, typography } from '../theme'
import type { RootStackParamList } from '../navigation/types'

type Props = {
  navigation: {
    navigate: (screen: keyof RootStackParamList, params?: object) => void
  }
}

const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`

export default function CartScreen({ navigation }: Props) {
  const colors = useTheme()
  const { items, hydrate, updateQuantity, remove } = useCartStore()
  const [error, setError] = useState('')

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const changeQuantity = useCallback(
    async (productId: number, quantity: number) => {
      setError('')
      try {
        await updateQuantity(productId, quantity)
      } catch (e) {
        setError((e as Error).message)
      }
    },
    [updateQuantity],
  )

  const onRemove = useCallback(
    async (productId: number) => {
      setError('')
      try {
        await remove(productId)
      } catch (e) {
        setError((e as Error).message)
      }
    },
    [remove],
  )

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const totalDiscount = items.reduce((sum, i) => {
    const sale = i.product.salePrice ?? i.product.price
    return sum + (i.product.price - sale) * i.quantity
  }, 0)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {items.length === 0 ? (
        <EmptyState
          icon="shopping-bag"
          title="Your cart is empty"
          message="Add a few products to get started."
        />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={i => String(i.product.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {item.product.image ? (
                  <Image source={{ uri: item.product.image }} style={styles.image} resizeMode="cover" />
                ) : (
                  <View style={[styles.image, styles.noImage]} />
                )}
                <View style={styles.itemBody}>
                  <Text numberOfLines={2} style={[styles.itemName, { color: colors.text }]}>
                    {item.product.name}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>
                    {usd(item.product.price)}
                  </Text>
                  <View style={styles.qtyRow}>
                    <Pressable
                      style={[styles.qtyBtn, { borderColor: colors.border }]}
                      onPress={() => changeQuantity(item.product.id, item.quantity - 1)}
                      hitSlop={8}>
                      <Icon name="minus" size={14} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.qty, { color: colors.text }]}>{item.quantity}</Text>
                    <Pressable
                      style={[styles.qtyBtn, { borderColor: colors.border }]}
                      onPress={() => changeQuantity(item.product.id, item.quantity + 1)}
                      hitSlop={8}>
                      <Icon name="plus" size={14} color={colors.text} />
                    </Pressable>
                    <Pressable onPress={() => onRemove(item.product.id)} hitSlop={8} style={styles.removeBtn}>
                      <Icon name="trash-2" size={16} color={colors.danger} />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.summaryRow}>
              <Text style={{ color: colors.textSecondary }}>Subtotal</Text>
              <Text style={{ color: colors.text }}>{usd(subtotal)}</Text>
            </View>
            {totalDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={{ color: colors.success }}>Discount</Text>
                <Text style={{ color: colors.success }}>-{usd(totalDiscount)}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.total, { color: colors.text }]}>Total</Text>
              <Text style={[styles.total, { color: colors.text }]}>
                {usd(subtotal - totalDiscount)}
              </Text>
            </View>
            <Button
              title="Checkout"
              onPress={() => navigation.navigate('Checkout')}
              fullWidth
            />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.lg },
  item: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  image: { width: 72, height: 72, borderRadius: radius.md },
  noImage: { backgroundColor: '#EEE' },
  itemBody: { flex: 1, marginLeft: spacing.md },
  itemName: { ...typography.label, fontSize: 14, marginBottom: 2 },
  itemPrice: { ...typography.caption, marginBottom: spacing.sm },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { marginHorizontal: spacing.md, fontWeight: '600' },
  removeBtn: { marginLeft: 'auto' },
  error: { color: '#DC2626', paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  summary: {
    borderTopWidth: 1,
    padding: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  totalRow: { marginTop: spacing.xs, borderTopWidth: 1, borderTopColor: '#EEF0F3', paddingTop: spacing.md, marginBottom: spacing.md },
  total: { fontSize: 18, fontWeight: '700' },
})