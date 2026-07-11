import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const FAB_SIZE = moderateScale(56);

export const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.container,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // Ring like the tab bar's search action, in the secondary accent.
    borderWidth: moderateScale(4),
    borderColor: colors.secondary,
    // Elevation level 2: floats above content and the tab bar plane.
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -moderateScale(4),
    right: -moderateScale(4),
    minWidth: moderateScale(20),
    height: moderateScale(20),
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: moderateScale(2),
    // Same ring color as the tab bar's search action.
    borderColor: colors.border,
  },
  badgeText: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    fontSize: moderateScale(10),
    lineHeight: moderateScale(12),
    color: colors.onPrimary,
  },
});
