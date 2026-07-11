import { StyleSheet } from 'react-native';
import { WAVE_HEIGHT } from '@components/layout';
import { colors, moderateScale, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // List tucks behind the header's wave; the content padding restores the
  // resting position so items only slide under the curve while scrolling.
  list: {
    marginTop: -WAVE_HEIGHT,
  },
  listHeader: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  padded: {
    paddingHorizontal: spacing.container,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.container,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
  },
  seeAll: {
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.primary,
  },
  mosaicRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.container,
  },
  mosaicCell: {
    flex: 1,
  },
  listContent: {
    gap: 0,
  },
  skeletonRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.container,
  },
  skeletonCard: {
    flex: 1,
    height: moderateScale(240),
  },
  skeletonWide: {
    flex: 1,
    height: moderateScale(200),
  },
  stateContainer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.xl,
  },
  stateTitle: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  stateCaption: {
    ...typography.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
