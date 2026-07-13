import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Loops an interpolated color along `palette` — each leg blends into the
 * next color over `legMs`, and the last stop blends back into the first.
 *
 * A single animated value drives the whole cycle: no re-renders and no
 * mid-flight resets, so the drift never flickers. With two colors it
 * behaves as the classic ping-pong (a → b → a).
 *
 * `palette` must be referentially stable (a module-level constant), or the
 * loop restarts on every render.
 */
export const useColorCycle = (palette: readonly string[], legMs: number) => {
  const blend = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const legs = palette.map((_, index) =>
      Animated.timing(blend, {
        toValue: index + 1,
        duration: legMs,
        easing: Easing.inOut(Easing.ease),
        // Color interpolation cannot run on the native driver.
        useNativeDriver: false,
      }),
    );
    // The loop resets to 0 between iterations; 0 and the last stop map to
    // the same color, so the wrap-around is seamless.
    const animation = Animated.loop(Animated.sequence(legs));
    animation.start();
    return () => animation.stop();
  }, [blend, palette, legMs]);

  return blend.interpolate({
    inputRange: [...palette.map((_, index) => index), palette.length],
    outputRange: [...palette, palette[0]],
  });
};
