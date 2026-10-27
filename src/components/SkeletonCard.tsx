import React from 'react'
import { Animated, StyleSheet, useWindowDimensions } from 'react-native'
import { useTheme } from '../stores/themeStore'
import { radius, spacing } from '../theme'

export function SkeletonCard() {
  const colors = useTheme()
  const { width } = useWindowDimensions()
  const cardWidth = (width - spacing.lg * 2 - spacing.md) / 2

  return (
    <Animated.View
      style={[
        styles.card,
        { width: cardWidth, backgroundColor: colors.card, borderColor: colors.border },
      ]}>
      <ViewSpark style={[styles.image, { backgroundColor: colors.skeleton }]} />
      <ViewSpark style={[styles.line, styles.lineFull, { backgroundColor: colors.skeleton }]} />
      <ViewSpark style={[styles.line, styles.lineHalf, { backgroundColor: colors.skeleton }]} />
    </Animated.View>
  )
}

function ViewSpark({ style }: { style: object }) {
  const opacity = React.useRef(new Animated.Value(0.4)).current
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])
  return <Animated.View style={[style, { opacity }]} />
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  image: { aspectRatio: 1, borderRadius: radius.md, marginBottom: spacing.sm },
  line: { height: 12, borderRadius: 6, marginBottom: spacing.sm },
  lineFull: { width: '80%' },
  lineHalf: { width: '40%' },
})