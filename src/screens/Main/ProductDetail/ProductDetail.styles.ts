import { StyleSheet } from 'react-native';
import { WAVE_HEIGHT } from '@components/layout';
import { colors, moderateScale, radius, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Tucks the scroll content behind the header's wave so only the curve shows.
  scroll: {
    marginTop: -WAVE_HEIGHT,
  },
  // The wrapper owns the size so the absolute wave can overlay the photo.
  imageWrap: {
    width: '100%',
    aspectRatio: 0.95,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.muted,
  },
  // Background-colored wave rising over the photo's bottom edge,
  // mirrored so its curve reads opposite to the header's.
  imageWave: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -StyleSheet.hairlineWidth,
    height: WAVE_HEIGHT,
    transform: [{ scaleX: -1 }],
  },
  content: {
    paddingHorizontal: spacing.container,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.secondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  price: {
    ...typography.body,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
  },
  name: {
    ...typography.headingLg,
    color: colors.text,
  },
  stock: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.success,
  },
  description: {
    ...typography.bodySm,
    color: colors.textMuted,
    lineHeight: moderateScale(22),
  },
  sectionLabel: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.md,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  swatch: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  swatchSelected: {
    borderWidth: moderateScale(2),
    borderColor: colors.primary,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sizeButton: {
    minWidth: moderateScale(44),
    height: moderateScale(44),
    borderRadius: radius.md,
    borderWidth: moderateScale(1.5),
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  sizeButtonSelected: {
    borderColor: colors.primary,
    borderWidth: moderateScale(2),
  },
  sizeText: {
    ...typography.bodySm,
    fontFamily: typography.button.fontFamily,
    color: colors.textMuted,
  },
  sizeTextSelected: {
    color: colors.primary,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  qtyButton: {
    width: moderateScale(36),
    height: moderateScale(36),
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
    ...typography.body,
    fontFamily: typography.button.fontFamily,
    color: colors.text,
    minWidth: moderateScale(24),
    textAlign: 'center',
  },
  addButton: {
    marginTop: spacing.xl,
  },
  perksRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.container,
  },
  stateTitle: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
});
