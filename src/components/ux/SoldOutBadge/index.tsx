import React from 'react';
import { Animated, Text, View } from 'react-native';
import { useColorCycle } from '@lib';
import { colors } from '@theme';
import { styles } from './SoldOutBadge.styles';

export interface SoldOutBadgeProps {
  /** Bigger stamp for hero surfaces (e.g. the product detail photo). */
  large?: boolean;
}

/** One-way blend duration; the cycle drifts back for a soft ping-pong. */
const BLEND_DURATION_MS = 2000;

/** Brand pair the stamp band drifts between. */
const BLEND_PALETTE = [colors.primary, colors.secondary];

/** Tilted "sold out" stamp centered over a product photo, its band
 *  drifting between the two brand colors. */
export const SoldOutBadge = ({ large = false }: SoldOutBadgeProps) => {
  const backgroundColor = useColorCycle(BLEND_PALETTE, BLEND_DURATION_MS);

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
