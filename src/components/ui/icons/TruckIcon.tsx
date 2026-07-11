import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export const TruckIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 1.8,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2.5 6.5h11v10h-11v-10ZM13.5 10h4l3 3v3.5h-7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Circle cx={7} cy={18.5} r={1.7} stroke={color} strokeWidth={strokeWidth} />
    <Circle
      cx={17.5}
      cy={18.5}
      r={1.7}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);
