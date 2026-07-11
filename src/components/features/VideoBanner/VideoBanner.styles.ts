import { StyleSheet } from 'react-native';
import { colors, moderateScale } from '@theme';

export const styles = StyleSheet.create({
  // Full-bleed strip, flush against the mosaic above (no gaps, no radius).
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.muted,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  // Brand mark flush in the corner: it must cover the clip's watermark.
  // Negative offsets absorb the asset's transparent padding.
  logoBadge: {
    position: 'absolute',
    right: -moderateScale(14),
    bottom: -moderateScale(14),
    width: moderateScale(96),
    height: moderateScale(96),
  },
});
