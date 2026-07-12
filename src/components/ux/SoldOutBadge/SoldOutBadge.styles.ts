import { StyleSheet } from 'react-native';
import { colors, moderateScale, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  // Dim scrim over the photo so the tilted band pops.
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
  },
  // Square brand band, tilted like a stamped label.
  // Background is animated in the component (primary ⇄ secondary drift).
  band: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    transform: [{ rotate: '-12deg' }],
  },
  bandLarge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  text: {
    ...typography.heading,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    letterSpacing: 1.5,
    color: colors.onPrimary,
  },
  textLarge: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(34),
    letterSpacing: 2,
  },
});
