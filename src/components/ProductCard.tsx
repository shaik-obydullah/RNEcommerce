import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../stores/themeStore'
import { radius, spacing, typography } from '../theme'
import type { Product } from '../api/types'

interface ProductCardProps {
  product: Product
  onPress?: (id: number) => void
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const colors = useTheme()

  const hasSale = product.salePrice !== null && product.salePrice < product.price
  const displayPrice =
    product.salePrice !== null && product.salePrice < product.price
      ? product.salePrice
      : product.price

  return (
    <Pressable
      onPress={() => onPress?.(product.id)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.imageWrap, { backgroundColor: colors.surface }]}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: colors.textMuted }}>No image</Text>
          </View>
        )}
        {hasSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>SALE</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text }]}>
            {usd(displayPrice)}
          </Text>
          {hasSale && (
            <Text style={[styles.oldPrice, { color: colors.textMuted }]}>
              {usd(product.price)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  )
}

function usd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.9 },
  imageWrap: { aspectRatio: 1 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: '#DC2626',
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saleText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  info: { padding: spacing.md },
  name: { ...typography.label, fontSize: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  price: { ...typography.h3, fontSize: 15 },
  oldPrice: { textDecorationLine: 'line-through', fontSize: 12 },
})