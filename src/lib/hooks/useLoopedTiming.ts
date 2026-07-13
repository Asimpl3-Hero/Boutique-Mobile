import { useEffect, useRef } from 'react';
import { Animated, Easing, EasingFunction } from 'react-native';

export interface LoopedTimingOptions {
  /** Curve of each pass; must be referentially stable. Linear by default. */
  easing?: EasingFunction;
  /** Pause/resume the loop (e.g. only while indeterminate). */
  enabled?: boolean;
}

/**
 * Animated value that sweeps 0 → 1 forever, one pass per `durationMs`,
 * on the native driver — the primitive behind spinners and sweeps.
 *
 * Returns the raw `Animated.Value` so callers can interpolate it into
 * transforms (rotate, translate) or reset it (`setValue(0)`).
 */
export const useLoopedTiming = (
  durationMs: number,
  { easing = Easing.linear, enabled = true }: LoopedTimingOptions = {},
): Animated.Value => {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const loop = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration: durationMs,
        easing,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [value, durationMs, easing, enabled]);

  return value;
};
