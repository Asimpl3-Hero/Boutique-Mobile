import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export const ReceiptIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 1.8,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 8.5h5M9.5 12h5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
