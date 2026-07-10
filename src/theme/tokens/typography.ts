import type { TextStyle } from 'react-native';
import { moderateScale } from './scale';

/**
 * Font families bundled in src/assets/fonts.
 * File names match the fonts' PostScript names, so the same string resolves
 * on Android (file name) and iOS (PostScript name).
 */
export const fontFamilies = {
  /** Oi — decorative display face (single Regular weight). */
  display: 'Oi-Regular',
  body: 'InstrumentSans-Regular',
  medium: 'InstrumentSans-Medium',
} as const;

const textStyle = (
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  extra?: TextStyle,
): TextStyle => ({
  fontFamily,
  fontSize: moderateScale(fontSize),
  lineHeight: moderateScale(lineHeight),
  ...extra,
});

/**
 * Typographic roles (sizes from the reference DESIGN.md):
 * Display/Heading → Oi · Body/Caption → Instrument Sans · Button → Medium.
 */
export const typography = {
  displayLg: textStyle(fontFamilies.display, 32, 42),
  display: textStyle(fontFamilies.display, 28, 38),
  headingLg: textStyle(fontFamilies.display, 24, 32),
  heading: textStyle(fontFamilies.display, 20, 28),
  body: textStyle(fontFamilies.body, 16, 24),
  bodySm: textStyle(fontFamilies.body, 14, 20),
  button: textStyle(fontFamilies.medium, 16, 24),
  caption: textStyle(fontFamilies.body, 12, 16),
} as const;

export type TypographyToken = keyof typeof typography;
