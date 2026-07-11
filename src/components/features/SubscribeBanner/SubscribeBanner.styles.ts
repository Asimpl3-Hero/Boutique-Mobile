import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  // Full-bleed brand band, flush between the mosaic and the video strip.
  // Background is animated in the component (secondary ⇄ primary drift).
  container: {
    width: '100%',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  titleWrapper: {
    alignSelf: 'flex-start',
    borderBottomWidth: moderateScale(3),
    borderBottomColor: colors.accent,
    paddingBottom: spacing.xs,
  },
  title: {
    ...typography.heading,
    color: colors.onPrimary,
  },
  caption: {
    ...typography.bodySm,
    color: colors.onPrimary,
    opacity: 0.85,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    flex: 1,
    height: moderateScale(48),
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
    ...typography.bodySm,
  },
  button: {
    height: moderateScale(48),
    minWidth: moderateScale(120),
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  buttonText: {
    ...typography.button,
    fontSize: moderateScale(14),
    color: colors.onAccent,
  },
  buttonTextSuccess: {
    color: colors.onSuccess,
  },
  error: {
    ...typography.caption,
    color: colors.accent,
  },
});
