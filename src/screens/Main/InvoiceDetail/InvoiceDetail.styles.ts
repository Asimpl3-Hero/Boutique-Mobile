import { StyleSheet } from 'react-native';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.container,
  },
  // Square corners: reads as a paper receipt, torn edge below.
  card: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  tornEdge: {
    width: '100%',
    height: moderateScale(12),
    // Tucks under the card so no seam shows between them.
    marginTop: -StyleSheet.hairlineWidth,
  },
  shippingLabel: {
    ...typography.caption,
    letterSpacing: 1,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  // Label left, value right — receipt-style aligned field rows.
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.xs / 2,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.bodySm,
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  // Letterhead: small monochrome brand stamp (pre-grayscaled asset).
  logo: {
    width: moderateScale(44),
    height: moderateScale(44),
    alignSelf: 'center',
    marginTop: spacing.sm,
    opacity: 0.85,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    ...typography.body,
    fontFamily: typography.button.fontFamily,
    letterSpacing: 2.5,
    color: colors.text,
  },
  number: {
    ...typography.body,
    color: colors.textMuted,
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  details: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  headerCell: {
    ...typography.caption,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cellProduct: {
    flex: 3,
  },
  cellUnit: {
    flex: 1,
    textAlign: 'center',
  },
  cellPrice: {
    flex: 2,
    textAlign: 'right',
  },
  cellText: {
    ...typography.bodySm,
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  // Oi runs wide: the label yields most of the row to the price.
  totalLabel: {
    flex: 1,
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
  },
  // Total rendered in the Oi brand display face.
  totalValue: {
    flex: 2,
    ...typography.heading,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    color: colors.text,
    textAlign: 'right',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  statusBadgeText: {
    ...typography.caption,
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),
    fontFamily: typography.button.fontFamily,
    color: colors.onPrimary,
  },
});
