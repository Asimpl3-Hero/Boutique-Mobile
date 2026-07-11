import React, { useEffect, useRef } from 'react';
import { Animated, Easing, useWindowDimensions } from 'react-native';
import { styles } from './CircularReveal.styles';

export interface CircularRevealProps {
  /** Fill color of the reveal. */
  color: string;
  /** Grows to cover the screen when true; collapses back when false. */
  active: boolean;
  durationMs?: number;
  onFinish?: () => void;
}

/** Solid-color circle that scales from the center until it covers the
 *  whole screen (diameter ≥ screen diagonal). Purely presentational. */
export const CircularReveal = ({
  color,
  active,
  durationMs = 600,
  onFinish,
}: CircularRevealProps) => {
  const { width, height } = useWindowDimensions();
  // Always born collapsed so mounting with `active` animates the reveal.
  const scale = useRef(new Animated.Value(0)).current;

  // Covers every corner regardless of aspect ratio.
  const diameter = Math.ceil(Math.hypot(width, height));

  useEffect(() => {
    const animation = Animated.timing(scale, {
      toValue: active ? 1 : 0,
      duration: durationMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished && active) {
        onFinish?.();
      }
    });
    return () => animation.stop();
  }, [active, durationMs, scale, onFinish]);

  return (
    <Animated.View pointerEvents="none" style={styles.wrapper}>
      <Animated.View
        accessibilityLabel="Revelado circular"
        style={{
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: color,
          transform: [{ scale }],
        }}
      />
    </Animated.View>
  );
};
