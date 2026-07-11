import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export const ShieldIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 1.8,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3.5 5 6v5.5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6l-7-2.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="m9.2 12 2 2 3.6-3.8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
