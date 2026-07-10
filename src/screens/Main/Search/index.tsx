import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './Search.styles';

/** Placeholder — product search lands in a later task. */
export const SearchScreen = () => (
  <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    <View style={styles.content}>
      <Text style={styles.title}>Search</Text>
      <Text style={styles.subtitle}>Search coming soon</Text>
    </View>
  </SafeAreaView>
);
