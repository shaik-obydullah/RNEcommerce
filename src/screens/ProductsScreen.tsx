import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet } from 'react-native'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useTheme } from '../stores/themeStore'
import { api } from '../api/endpoints'
import { ProductCard } from '../components/ProductCard'
import { SkeletonCard } from '../components/SkeletonCard'
import { EmptyState } from '../components/EmptyState'
import { spacing } from '../theme'
import type { Product } from '../api/types'
import type { HomeTabParamList, RootStackParamList } from '../navigation/types'

type Props = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, 'Products'>,
  NativeStackScreenProps<RootStackParamList>
>

export default function ProductsScreen({ navigation }: Props) {
  const colors = useTheme()
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (pageToLoad: number, replace: boolean) => {
    try {
      const res = await api.products.list({ page: pageToLoad })
      setProducts(prev => (replace ? res.data : [...prev, ...res.data]))
      setHasMore(pageToLoad < res.lastPage)
      setPage(pageToLoad)
      setError('')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load(1, true)
  }, [load])

  const onRefresh = () => {
    setRefreshing(true)
    load(1, true)
  }

  const onEndReached = () => {
    if (!loading && hasMore) {
      load(page + 1, false)
    }
  }

  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3, 4]}
        keyExtractor={n => String(n)}
        renderItem={() => <SkeletonCard />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
      />
    )
  }

  return (
    <FlatList
      data={products}
      keyExtractor={p => String(p.id)}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={id => navigation.navigate('ProductDetail', { productId: id })}
        />
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListEmptyComponent={
        error ? (
          <EmptyState icon="alert-circle" title="Couldn't load products" message={error} />
        ) : (
          <EmptyState icon="package" title="No products found" />
        )
      }
    />
  )
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  row: { gap: spacing.md, marginBottom: spacing.md },
})