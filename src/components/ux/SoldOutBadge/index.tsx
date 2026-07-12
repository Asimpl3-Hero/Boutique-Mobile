import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './SoldOutBadge.styles';

/** Tilted "sold out" stamp centered over a product photo. */
export const SoldOutBadge = () => (
  <View pointerEvents="none" style={styles.overlay}>
    <View style={styles.band}>
      <Text style={styles.text}>SOLD OUT</Text>
    </View>
  </View>
);
