import { StyleSheet } from 'react-native';
import { colors, moderateScale, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  columnWrapper: {
    gap: spacing.gutter,
    paddingHorizontal: spacing.container,
  },
  listContent: {
    gap: spacing.gutter,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: spacing.gutter,
    paddingHorizontal: spacing.container,
    marginBottom: spacing.gutter,
  },
  skeletonCard: {
    flex: 1,
    height: moderateScale(240),
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
