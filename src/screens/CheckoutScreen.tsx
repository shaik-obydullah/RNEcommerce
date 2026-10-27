import React, { useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useTheme } from '../stores/themeStore'
import { useCartStore } from '../stores'
import { api } from '../api/endpoints'
import { Button } from '../components/Button'
import { radius, spacing, typography } from '../theme'
import type { RootStackParamList } from '../navigation/types'

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>

const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`

export default function CheckoutScreen({ navigation }: Props) {
  const colors = useTheme()
  const { items, clear } = useCartStore()
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [paymentMethod] = useState('cod')
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const totalDiscount = items.reduce((sum, i) => {
    const sale = i.product.salePrice ?? i.product.price
    return sum + (i.product.price - sale) * i.quantity
  }, 0)
  const shipping = subtotal - totalDiscount > 10000 ? 0 : 500
  const total = subtotal - totalDiscount + shipping

  const placeOrder = async () => {
    if (!address || !city || !country) {
      setError('Please fill in all shipping details.')
      return
    }
    setError('')
    setPlacing(true)
    try {
      await api.orders.place({ address, city, country, paymentMethod })
      clear()
      Alert.alert('Order placed!', 'Your order has been confirmed.', [
        { text: 'OK', onPress: () => navigation.navigate('Tabs') },
      ])
    } catch (e) {
      setError((e as Error).message)
      setPlacing(false)
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipping</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Address</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
        value={address}
        onChangeText={setAddress}
        placeholder="Street address"
        placeholderTextColor={colors.textMuted}
      />
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>City</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            value={city}
            onChangeText={setCity}
            placeholder="City"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.rowItem}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Country</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            value={country}
            onChangeText={setCountry}
            placeholder="Country"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment</Text>
      <View style={[styles.paymentBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={{ color: colors.textSecondary }}>Cash on delivery</Text>
      </View>

      <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
        <View style={styles.summaryRow}>
          <Text style={{ color: colors.textSecondary }}>Shipping</Text>
          <Text style={{ color: colors.text }}>{shipping === 0 ? 'Free' : usd(shipping)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={[styles.total, { color: colors.text }]}>Total</Text>
          <Text style={[styles.total, { color: colors.text }]}>{usd(total)}</Text>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title={`Place order · ${usd(total)}`} onPress={placeOrder} loading={placing} fullWidth />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { ...typography.h2, fontSize: 20, marginBottom: spacing.md },
  label: { ...typography.label, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: 'row', gap: spacing.md },
  rowItem: { flex: 1 },
  paymentBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  summary: { borderWidth: 1, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.xl },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  totalRow: { borderTopWidth: 1, borderTopColor: '#C7CDD4', paddingTop: spacing.md, marginBottom: 0 },
  total: { fontSize: 18, fontWeight: '700' },
  error: { color: '#DC2626', marginBottom: spacing.md },
})