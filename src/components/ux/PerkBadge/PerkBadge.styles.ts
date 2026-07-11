import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  body: {
    ...typography.caption,
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),
    color: colors.textMuted,
  },
});
