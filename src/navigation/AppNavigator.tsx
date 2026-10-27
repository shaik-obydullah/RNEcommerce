import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import ProductDetailScreen from '../screens/ProductDetailScreen'
import CheckoutScreen from '../screens/CheckoutScreen'
import HomeTabs from './HomeTabs'
import { useAuthStore } from '../stores'
import { useTheme } from '../stores/themeStore'
import type { RootStackParamList } from './types'

const RootStack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  const colors = useTheme()
  const { user, initialized } = useAuthStore()

  const isLight = colors.background === '#FFFFFF'
  const baseTheme = isLight ? DefaultTheme : DarkTheme
  const navTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  }

  if (!initialized) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
        }}>
        {user ? (
          <>
            <RootStack.Screen name="Tabs" component={HomeTabs} options={{ headerShown: false }} />
            <RootStack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{ title: '' }}
            />
            <RootStack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ title: 'Checkout' }}
            />
          </>
        ) : (
          <>
            <RootStack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen name="Register" component={RegisterScreen} options={{ title: '' }} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})