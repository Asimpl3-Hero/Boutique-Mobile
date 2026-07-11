import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '@components/ui';
import { styles } from './HeroBanner.styles';

export interface HeroBannerProps {
  eyebrow?: string;
  title?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

/** Decorative Home hero ("Summer Collection"), static by design. */
export const HeroBanner = ({
  eyebrow = 'Limited Edition',
  title = 'Summer Collection',
  actionLabel = 'Shop the Look',
  onActionPress,
}: HeroBannerProps) => (
  <View style={styles.container}>
    <Text style={styles.eyebrow}>{eyebrow}</Text>
    <Text style={styles.title}>{title}</Text>
    <Button
      label={actionLabel}
      variant="primary"
      onPress={onActionPress}
      style={styles.button}
    />
  </View>
);
