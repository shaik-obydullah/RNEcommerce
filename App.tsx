import React, { useEffect } from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AppNavigator from './src/navigation/AppNavigator'
import { useAuthStore } from './src/stores'
import { useThemeStore } from './src/stores/themeStore'

function App() {
  const hydrateAuth = useAuthStore(s => s.hydrate)
  const hydrateTheme = useThemeStore(s => s.hydrate)
  const mode = useThemeStore(s => s.mode)

  useEffect(() => {
    hydrateAuth()
    hydrateTheme()
  }, [hydrateAuth, hydrateTheme])

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})

export default App