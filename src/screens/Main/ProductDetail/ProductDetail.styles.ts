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
  image: {
    width: '100%',
    aspectRatio: 0.95,
    backgroundColor: colors.muted,
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
  addButton: {
    marginTop: spacing.xl,
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
