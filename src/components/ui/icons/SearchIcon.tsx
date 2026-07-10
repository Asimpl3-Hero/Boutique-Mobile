import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export const SearchIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 1.8,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={11}
      cy={11}
      r={6.5}
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="m20.5 20.5-4.9-4.9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
