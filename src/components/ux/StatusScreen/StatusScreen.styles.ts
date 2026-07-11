import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.container,
    gap: spacing.lg,
  },
  iconCircle: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLoading: {
    backgroundColor: colors.muted,
  },
  iconDone: {
    backgroundColor: colors.success,
  },
  iconDenied: {
    backgroundColor: colors.error,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    ...typography.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
});
