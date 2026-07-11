import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export const CartIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 1.8,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 4.5h2.2l2 10.5h11l2-8.5H6.1"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={9} cy={19.3} r={1.6} stroke={color} strokeWidth={strokeWidth} />
    <Circle
      cx={16.6}
      cy={19.3}
      r={1.6}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);
