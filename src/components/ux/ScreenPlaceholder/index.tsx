import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './ScreenPlaceholder.styles';

export interface ScreenPlaceholderProps {
  title: string;
  subtitle?: string;
}

/** Centered placeholder for screens whose real content lands in a later task. */
export const ScreenPlaceholder = ({
  title,
  subtitle,
}: ScreenPlaceholderProps) => (
  <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  </SafeAreaView>
);
