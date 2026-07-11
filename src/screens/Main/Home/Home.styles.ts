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
  // Underline hugs the heading text, brand accent in secondary.
  sectionTitleWrapper: {
    alignSelf: 'flex-start',
    borderBottomWidth: moderateScale(3),
    borderBottomColor: colors.secondary,
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
  },
  // Full-bleed mosaic: tiles span the whole screen width.
  mosaicRow: {
    flexDirection: 'row',
  },
  mosaicCell: {
    flex: 1,
  },
  listContent: {
    gap: 0,
  },
  skeletonRow: {
    flexDirection: 'row',
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
