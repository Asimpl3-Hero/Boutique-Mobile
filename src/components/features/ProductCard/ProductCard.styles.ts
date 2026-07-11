import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    // Elevation level 1: subtle lift over the background.
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.muted,
  },
  image: {
    width: '100%',
    aspectRatio: 0.8,
  },
  imageWide: {
    width: '100%',
    aspectRatio: 1.5,
  },
  wishlist: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  name: {
    ...typography.bodySm,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
  },
  addButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
