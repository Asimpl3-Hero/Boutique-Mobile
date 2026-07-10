import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Home.styles';

/** Placeholder — the product list lands in mobile-03. */
export const HomeScreen = () => (
  <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    <View style={styles.content}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Products coming soon</Text>
    </View>
  </SafeAreaView>
);
