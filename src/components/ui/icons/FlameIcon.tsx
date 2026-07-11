import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './HomeIcon';

export const FlameIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 1.8,
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3.5c1.2 3.2-2.8 4.8-2.8 8a4.8 4.8 0 0 0 9.6 0c0-1.8-.8-3.2-1.8-4.3-.4 1.2-1 1.9-1.8 2.4.3-2.2-.8-4.6-3.2-6.1Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M9.2 11.5c-1.4 1-2.2 2.4-2.2 4a5 5 0 0 0 5 4.9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
