import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@theme';

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
  // Symmetric: equal margins on both sides, field spans the full width.
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
  },
  panelLabel: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowName: {
    ...typography.bodySm,
    color: colors.text,
    flex: 1,
  },
  empty: {
    ...typography.bodySm,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
