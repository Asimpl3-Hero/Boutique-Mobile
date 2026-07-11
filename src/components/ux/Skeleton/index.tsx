import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { styles } from './Skeleton.styles';

export interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
}

/** Pulsing placeholder block shown while content loads. */
export const Skeleton = ({ style }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityLabel="Loading"
      style={[styles.base, { opacity }, style]}
    />
  );
};
