import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: radius.card,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.sm,
    overflow: 'hidden',
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
    color: colors.onSecondary,
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  daisy: {
    position: 'absolute',
    right: -moderateScale(20),
    bottom: -moderateScale(20),
    opacity: 0.35,
  },
});
