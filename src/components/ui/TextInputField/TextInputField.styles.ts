import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
  },
  input: {
    ...typography.bodySm,
    color: colors.text,
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    borderWidth: moderateScale(1.5),
    borderColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: moderateScale(44),
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    ...typography.caption,
    color: colors.error,
  },
});
