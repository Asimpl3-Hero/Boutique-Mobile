import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** Cross inside a circle — denied/error feedback. */
export const DeniedIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9.2} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="m8.6 8.6 6.8 6.8m0-6.8-6.8 6.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
