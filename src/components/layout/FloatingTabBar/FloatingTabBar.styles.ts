import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const BAR_HEIGHT = moderateScale(64);
/** Larger than BAR_HEIGHT on purpose: it overflows the pill evenly, centered. */
export const ACTION_SIZE = moderateScale(80);

export const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.container,
    right: spacing.container,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_HEIGHT,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionSlot: {
    flex: 1,
    alignItems: 'center',
  },
  action: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
    borderWidth: moderateScale(4),
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
  },
  actionActive: {
    backgroundColor: colors.primary,
  },
});
