import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  base: {
    minHeight: moderateScale(36),
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
  },
  active: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.onMuted,
  },
  labelActive: {
    color: colors.onPrimary,
  },
});
