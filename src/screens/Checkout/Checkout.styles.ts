import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  stepper: {
    marginTop: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.container,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  stepTitle: {
    ...typography.heading,
    color: colors.text,
  },
  caption: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
  // --- Bag step ---
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  itemImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: radius.sm,
    backgroundColor: colors.muted,
  },
  itemInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  itemName: {
    ...typography.bodySm,
    color: colors.text,
  },
  itemPrice: {
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.primary,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  qtyButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: radius.pill,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    ...typography.button,
    fontSize: moderateScale(16),
    color: colors.text,
  },
  qtyValue: {
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
    minWidth: moderateScale(20),
    textAlign: 'center',
  },
  removeLink: {
    ...typography.caption,
    color: colors.error,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  totalLabel: {
    ...typography.body,
    color: colors.text,
  },
  totalValue: {
    ...typography.body,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
  },
  // --- Forms ---
  formGap: {
    gap: spacing.md,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  fieldFlex: {
    flex: 1,
  },
  // --- Card step ---
  cardSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: moderateScale(1.5),
    borderColor: colors.border,
  },
  cardSummarySelected: {
    borderColor: colors.primary,
    borderWidth: moderateScale(2),
  },
  cardSummaryText: {
    ...typography.body,
    color: colors.text,
  },
  brandBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.text,
  },
  brandBadgeText: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.onPrimary,
    letterSpacing: 1,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
  },
  // --- Backdrop (card form) ---
  backdropScrim: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  backdropPanel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    paddingHorizontal: spacing.container,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  backdropHandle: {
    alignSelf: 'center',
    width: moderateScale(40),
    height: moderateScale(4),
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  backdropTitle: {
    ...typography.heading,
    color: colors.text,
  },
  // --- Summary step ---
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryLabel: {
    ...typography.bodySm,
    color: colors.textMuted,
    flexShrink: 1,
  },
  summaryValue: {
    ...typography.bodySm,
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  // --- Bottom navigation ---
  navRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.container,
    paddingTop: spacing.sm,
  },
  navButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
});
