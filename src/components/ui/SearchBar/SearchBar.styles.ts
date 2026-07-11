import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: moderateScale(48),
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.muted,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: 0,
  },
});
