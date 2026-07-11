import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export const PlusIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 2,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5v14M5 12h14"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
