import { moderateScale } from './scale';

/**
 * Spacing scale — 4pt base grid, responsively scaled.
 * Layout spacing comes from these tokens (or flex/%/gap), never loose px.
 */
export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(24),
  /** Default horizontal screen margin. */
  container: moderateScale(20),
  /** Gap between grid/list items. */
  gutter: moderateScale(12),
} as const;

export const radius = {
  sm: moderateScale(8),
  md: moderateScale(12),
  card: moderateScale(16),
  pill: 999,
} as const;

/** Minimum touch target size (accessibility). */
export const touchTarget = 44;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
