import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titleWrapper: {
    alignSelf: 'flex-start',
    borderBottomWidth: moderateScale(3),
    borderBottomColor: colors.secondary,
    paddingBottom: spacing.xs,
    marginHorizontal: spacing.container,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  listContent: {
    padding: spacing.container,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  rowInfo: {
    gap: spacing.xs,
    flexShrink: 1,
  },
  rowNumber: {
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
  },
  rowDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  rowTotal: {
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.primary,
  },
  statusChip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  statusChipText: {
    ...typography.caption,
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),
    fontFamily: typography.button.fontFamily,
    color: colors.onPrimary,
  },
  empty: {
    ...typography.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  devEntry: {
    paddingHorizontal: spacing.container,
    paddingBottom: spacing.xl * 4,
  },
});
