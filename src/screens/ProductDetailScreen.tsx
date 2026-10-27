import React, { useEffect, useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/Feather'
import { useTheme } from '../stores/themeStore'
import { useCartStore } from '../stores'
import { api } from '../api/endpoints'
import { Button } from '../components/Button'
import { radius, spacing, typography } from '../theme'
import type { Product } from '../api/types'
import type { RootStackParamList } from '../navigation/types'

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>

const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`

export default function ProductDetailScreen({ route }: Props) {
  const { productId } = route.params
  const colors = useTheme()
  const addToCart = useCartStore(s => s.add)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true
    api.products
      .detail(productId)
      .then(p => {
        if (active) setProduct(p)
      })
      .catch(e => {
        if (active) setError((e as Error).message)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [productId])

  const handleAdd = async () => {
    if (!product) return
    setAdding(true)
    try {
      await addToCart(product)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Icon name="loader" size={28} color={colors.textMuted} />
      </View>
    )
  }

  if (error || !product) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>{error ?? 'Product not found'}</Text>
      </View>
    )
  }

  const hasSale = product.salePrice !== null && product.salePrice < product.price
  const displayPrice =
    product.salePrice !== null && product.salePrice < product.price
      ? product.salePrice
      : product.price

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <View style={[styles.imageWrap, { backgroundColor: colors.surface }]}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.noImage}>
            <Icon name="image" size={48} color={colors.textMuted} />
          </View>
        )}
      </View>

      <View style={styles.body}>
        {product.categories.length > 0 && (
          <Text style={[styles.category, { color: colors.primary }]}>
            {product.categories.map(c => c.name).join(' · ')}
          </Text>
        )}

        <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>

        <View style={styles.ratingRow}>
          <Icon name="star" size={14} color={colors.accent} />
          <Text style={[styles.rating, { color: colors.textSecondary }]}>
            {product.averageRating > 0
              ? `${product.averageRating.toFixed(1)} (${product.reviewCount})`
              : 'No reviews yet'}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text }]}>{usd(displayPrice)}</Text>
          {hasSale && (
            <Text style={[styles.oldPrice, { color: colors.textMuted }]}>
              {usd(product.price)}
            </Text>
          )}
          {hasSale && (
            <View style={[styles.discountBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.discountText}>
                {Math.round((1 - displayPrice / product.price) * 100)}% OFF
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.priceLabel, { color: colors.textMuted }]}>
          {product.stock > 0 ? `In stock · ${product.stock} available` : 'Out of stock'}
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {product.description}
        </Text>

        <View style={styles.buyBar}>
          <Button
            title={added ? 'Added to cart' : 'Add to cart'}
            onPress={handleAdd}
            loading={adding}
            disabled={product.stock <= 0}
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageWrap: { aspectRatio: 1 },
  image: { width: '100%', height: '100%' },
  noImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { padding: spacing.lg },
  category: { ...typography.label, marginBottom: spacing.xs },
  name: { ...typography.h2, marginBottom: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.lg },
  rating: { ...typography.caption },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  price: { ...typography.h1, fontSize: 24 },
  oldPrice: { textDecorationLine: 'line-through', fontSize: 16 },
  discountBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  priceLabel: { ...typography.caption, marginTop: spacing.xs, marginBottom: spacing.lg },
  description: { ...typography.body, lineHeight: 24, marginBottom: spacing.xl },
  buyBar: { marginTop: 'auto' },
})