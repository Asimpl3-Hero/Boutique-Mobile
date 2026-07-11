import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  // Flat tile: square corners so cards can sit flush in strips/grids.
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    // Elevation level 1: subtle lift over the background.
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
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
  // Tile variant: the add button floats on the image's lower corner.
  addButtonOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
  },
});
