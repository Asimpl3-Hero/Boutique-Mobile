import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const DOT_SIZE = moderateScale(28);

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.container,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPending: {
    backgroundColor: colors.muted,
  },
  dotActive: {
    backgroundColor: colors.surface,
    borderWidth: moderateScale(2),
    borderColor: colors.primary,
  },
  dotCompleted: {
    backgroundColor: colors.primary,
  },
  number: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.textMuted,
  },
  numberActive: {
    color: colors.primary,
  },
  label: {
    ...typography.caption,
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),
    color: colors.textMuted,
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: typography.button.fontFamily,
    color: colors.text,
  },
  // Connector segments between dots, tinted up to the active step.
  connector: {
    flex: 1,
    height: moderateScale(3),
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
    // Aligns the segment with the dot centers (labels sit below).
    marginBottom: moderateScale(18),
  },
  connectorDone: {
    backgroundColor: colors.primary,
  },
});
