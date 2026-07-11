import { StyleSheet } from 'react-native';
import { colors, moderateScale, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    // Flush mosaic: square corners, tiles sit edge to edge.
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    // Elevation level 1, matching ProductCard.
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  // Taller tiles reduce how aggressively portrait photos get cropped.
  half: {
    aspectRatio: 0.75,
  },
  wide: {
    aspectRatio: 1.35,
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Legibility scrim on top of photo tiles.
  scrim: {
    backgroundColor: colors.overlay,
  },
  // Border hugs the text so the underline spans exactly the title width.
  titleWrapper: {
    borderBottomWidth: moderateScale(3),
    paddingBottom: spacing.xs,
    maxWidth: '100%',
  },
  title: {
    ...typography.heading,
    color: colors.onPrimary,
    textAlign: 'center',
  },
});
