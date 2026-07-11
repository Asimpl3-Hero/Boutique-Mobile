import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export interface HeartIconProps extends IconProps {
  filled?: boolean;
}

export const HeartIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 1.8,
  filled = false,
}: HeartIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 20.5S4 15.5 4 9.8C4 6.9 6.2 5 8.5 5c1.5 0 2.8.8 3.5 2 .7-1.2 2-2 3.5-2C17.8 5 20 6.9 20 9.8c0 5.7-8 10.7-8 10.7Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      fill={filled ? color : 'none'}
    />
  </Svg>
);
