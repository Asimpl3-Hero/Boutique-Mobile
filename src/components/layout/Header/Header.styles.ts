import { StyleSheet } from 'react-native';
import { colors, moderateScale, spacing, typography } from '@theme';
import { touchTarget } from '@theme';

/** Height of the wave edge — content can offset by this to sit behind it. */
export const WAVE_HEIGHT = moderateScale(28);

export const styles = StyleSheet.create({
  // Paints above the sibling content so the wave can overlap it.
  wrapper: {
    zIndex: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  iconButton: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.heading,
    fontSize: moderateScale(18),
    lineHeight: moderateScale(26),
    color: colors.onPrimary,
    letterSpacing: 1,
  },
  // Inverted wave hanging below the band (flipped vertically so the fill
  // attaches to the header and the curve flows downward).
  wave: {
    width: '100%',
    height: WAVE_HEIGHT,
    transform: [{ scaleY: -1 }],
    marginTop: -StyleSheet.hairlineWidth,
  },
});
