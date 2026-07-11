import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  // Full-bleed cover: edge to edge, square corners, tucked under the wave.
  container: {
    overflow: 'hidden',
    backgroundColor: colors.secondary,
    height: moderateScale(320),
  },
  // Scrim keeps the copy legible over the photo.
  content: {
    flex: 1,
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.headingLg,
    color: colors.onPrimary,
    // Narrow enough to break "Colección de Verano" onto two lines.
    maxWidth: '65%',
  },
});
