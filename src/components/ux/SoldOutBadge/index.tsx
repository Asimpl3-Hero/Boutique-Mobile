import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { colors } from '@theme';
import { styles } from './SoldOutBadge.styles';

export interface SoldOutBadgeProps {
  /** Bigger stamp for hero surfaces (e.g. the product detail photo). */
  large?: boolean;
}

/** One-way blend duration; the loop ping-pongs back for a soft drift. */
const BLEND_DURATION_MS = 2000;

/** Tilted "sold out" stamp centered over a product photo, its band
 *  drifting between the two brand colors. */
export const SoldOutBadge = ({ large = false }: SoldOutBadgeProps) => {
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
    <View pointerEvents="none" style={styles.overlay}>
      <Animated.View
        style={[styles.band, large && styles.bandLarge, { backgroundColor }]}
      >
        <Text style={[styles.text, large && styles.textLarge]}>SOLD OUT</Text>
      </Animated.View>
    </View>
  );
};
