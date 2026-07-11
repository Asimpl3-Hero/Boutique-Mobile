import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@theme';
import { styles } from './Skeleton.styles';

export interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
}

/** One-way blend duration; the loop ping-pongs back for a soft drift. */
const BLEND_DURATION_MS = 1200;

/** Placeholder block that softly drifts between the two brand colors. */
export const Skeleton = ({ style }: SkeletonProps) => {
  const blend = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timing = (toValue: number) =>
      Animated.timing(blend, {
        toValue,
        duration: BLEND_DURATION_MS,
        easing: Easing.inOut(Easing.ease),
        // Color interpolation cannot run on the native driver.
        useNativeDriver: false,
      });
    const drift = Animated.loop(Animated.sequence([timing(1), timing(0)]));
    drift.start();
    return () => drift.stop();
  }, [blend]);

  const backgroundColor = blend.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, colors.secondary],
  });

  return (
    <Animated.View
      accessibilityLabel="Loading"
      style={[styles.base, { backgroundColor }, style]}
    />
  );
};
