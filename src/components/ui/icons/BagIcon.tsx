import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export const BagIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 1.8,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5.5 8.5h13l-1 11.5h-11l-1-11.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 11V6.8a3.5 3.5 0 0 1 7 0V11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
