import { StyleSheet } from 'react-native';
import { colors, moderateScale, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    // Tucks under the header's wave, like Home.
    marginTop: -moderateScale(28),
  },
  banner: {
    height: moderateScale(180),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.text,
  },
  bannerFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerScrim: {
    backgroundColor: colors.overlay,
  },
  bannerTitleWrapper: {
    borderBottomWidth: moderateScale(3),
    paddingBottom: spacing.xs,
    maxWidth: '85%',
  },
  bannerTitle: {
    ...typography.headingLg,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  gridRow: {
    gap: spacing.gutter,
    paddingHorizontal: spacing.container,
  },
  // No top padding: the banner sits flush under the header's wave.
  listContent: {
    gap: spacing.gutter,
  },
  empty: {
    ...typography.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
