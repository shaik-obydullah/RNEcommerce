import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import { useTheme, useThemeStore } from '../stores/themeStore'
import { useAuthStore } from '../stores'
import { Button } from '../components/Button'
import { spacing, typography } from '../theme'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { HomeTabParamList } from '../navigation/types'

type Props = BottomTabScreenProps<HomeTabParamList, 'Profile'>

export default function ProfileScreen(_props: Props) {
  const colors = useTheme()
  const { user, logout } = useAuthStore()
  const { mode, toggle } = useThemeStore()

  const darkMode = mode === 'dark'

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user ? user.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name ?? 'Guest'}</Text>
          <Text style={{ color: colors.textSecondary }}>{user?.email}</Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Dark mode</Text>
            <Text style={{ color: colors.textMuted }}>Toggle the app theme</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggle}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Log out" variant="ghost" onPress={() => logout()} fullWidth />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  headerText: { marginLeft: spacing.lg },
  name: { ...typography.h2, fontSize: 20 },
  section: { borderWidth: 1, borderRadius: 14, marginBottom: spacing.lg },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  settingTitle: { ...typography.h3, fontSize: 16 },
  settingText: { gap: 2 },
  footer: { marginTop: 'auto' },
})