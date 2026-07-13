import React from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { useColorCycle } from '@lib';
import { colors } from '@theme';
import { styles } from './Skeleton.styles';

export interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
}

/** One-way blend duration; the cycle drifts back for a soft ping-pong. */
const BLEND_DURATION_MS = 1200;

/** Brand pair the placeholder drifts between. */
const BLEND_PALETTE = [colors.primary, colors.secondary];

/** Placeholder block that softly drifts between the two brand colors. */
export const Skeleton = ({ style }: SkeletonProps) => {
  const backgroundColor = useColorCycle(BLEND_PALETTE, BLEND_DURATION_MS);

  return (
    <Animated.View
      accessibilityLabel="Loading"
      style={[styles.base, { backgroundColor }, style]}
    />
  );
};
