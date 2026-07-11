import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

/** Check inside a circle — success feedback. */
export const DoneIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9.2} stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="m7.8 12.3 2.8 2.8 5.6-6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
