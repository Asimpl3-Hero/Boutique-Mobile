import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Frost tint over the blur so content behind reads as glass.
  tint: {
    backgroundColor: 'rgba(251, 250, 255, 0.35)',
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    paddingHorizontal: spacing.container,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: moderateScale(40),
    height: moderateScale(4),
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  title: {
    ...typography.heading,
    color: colors.text,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemImage: {
    width: moderateScale(48),
    height: moderateScale(48),
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
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.primary,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  qtyButton: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: radius.pill,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyButtonText: {
    ...typography.button,
    fontSize: moderateScale(14),
    color: colors.text,
  },
  qtyValue: {
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
    minWidth: moderateScale(18),
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  clearButton: {
    backgroundColor: colors.error,
  },
  empty: {
    ...typography.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
