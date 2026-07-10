import { Dimensions } from 'react-native';

/**
 * Responsive scale helpers — the ONLY source of "px" values outside tokens.
 * Design base: 375 x 812 pt (iPhone X frame; min supported device iPhone SE).
 * The scale factor is clamped so text/spacing never shrinks below readability
 * on small phones nor balloons on tablets.
 */
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const MIN_FACTOR = 0.85;
const MAX_FACTOR = 1.25;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const widthFactor = (): number => {
  const { width, height } = Dimensions.get('window');
  return clamp(Math.min(width, height) / BASE_WIDTH, MIN_FACTOR, MAX_FACTOR);
};

const heightFactor = (): number => {
  const { width, height } = Dimensions.get('window');
  return clamp(Math.max(width, height) / BASE_HEIGHT, MIN_FACTOR, MAX_FACTOR);
};

/** Scales a size proportionally to the window width (horizontal sizes). */
export const scale = (size: number): number =>
  Math.round(size * widthFactor());

/** Scales a size proportionally to the window height (vertical sizes). */
export const verticalScale = (size: number): number =>
  Math.round(size * heightFactor());

/**
 * Scales a size by a fraction of the width factor (default 0.5).
 * Preferred for fontSize / spacing so they grow gently across devices.
 */
export const moderateScale = (size: number, factor = 0.5): number =>
  Math.round(size + (scale(size) - size) * factor);
