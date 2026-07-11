import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius } from '@theme';

export const BAR_THICKNESS = moderateScale(4);
/** Fraction of the track the indeterminate segment occupies. */
export const SEGMENT_RATIO = 0.4;

export const styles = StyleSheet.create({
  track: {
    height: BAR_THICKNESS,
    borderRadius: radius.pill,
    backgroundColor: colors.muted,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
