import React from 'react';
import { Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useLoopedTiming } from '@lib';
import type { IconProps } from './HomeIcon';

/** Full revolution duration of the spinning arc. */
const SPIN_DURATION_MS = 900;

/** Self-spinning arc — loading feedback. */
export const LoadingIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 2.4,
}: IconProps) => {
  const spin = useLoopedTiming(SPIN_DURATION_MS);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      accessibilityLabel="Cargando"
      style={{ width: size, height: size, transform: [{ rotate }] }}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21.2 12a9.2 9.2 0 1 1-4.6-7.97"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
};
