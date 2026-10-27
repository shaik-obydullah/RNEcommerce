import React, { useCallback, useEffect, useState } from 'react'
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useTheme } from '../stores/themeStore'
import { api } from '../api/endpoints'
import { ProductCard } from '../components/ProductCard'
import { SkeletonCard } from '../components/SkeletonCard'
import { EmptyState } from '../components/EmptyState'
import { radius, spacing, typography } from '../theme'
import type { Category, Product } from '../api/types'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { HomeTabParamList, RootStackParamList } from '../navigation/types'

type Props = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>

export default function HomeScreen({ navigation }: Props) {
  const colors = useTheme()
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.categories.list(),
        api.products.list({ perPage: 10 }),
      ])
      setCategories(catRes.data)
      setFeatured(prodRes.data)
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

  const openCategory = (_slug: string) => {
    navigation.navigate('Products')
  }

  if (loading) {
    return (
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View style={styles.skeletonHeader}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
        <View style={styles.grid}>
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }>
      <Text style={[styles.heading, { color: colors.text }]}>Store</Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>
        Shop by category
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesRow}>
        {categories.map(cat => (
          <Pressable
            key={cat.id}
            onPress={() => openCategory(cat.slug)}
            style={[styles.categoryChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured</Text>

      {featured.length === 0 ? (
        <EmptyState
          icon={error ? 'alert-circle' : 'package'}
          title={error ? "Couldn't load products" : 'No products to show'}
          message={error}
        />
      ) : (
        <View style={styles.grid}>
          {featured.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={id => navigation.navigate('ProductDetail', { productId: id })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  heading: { ...typography.h1 },
  subheading: { ...typography.caption, marginTop: spacing.xs, marginBottom: spacing.lg },
  categoriesRow: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  categoryText: { ...typography.label, fontSize: 14 },
  sectionTitle: { ...typography.h2, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  skeletonHeader: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
})