import React from 'react';
import { ImageBackground, ImageSourcePropType, Text, View } from 'react-native';
import { Button } from '@components/ui';
import { styles } from './HeroBanner.styles';

const DEFAULT_IMAGE = require('@/assets/images/Sections/summer-collection.jpg');

export interface HeroBannerProps {
  eyebrow?: string;
  title?: string;
  actionLabel?: string;
  image?: ImageSourcePropType;
  onActionPress?: () => void;
}

/** Home hero: campaign photo with scrim, copy and action. */
export const HeroBanner = ({
  eyebrow = 'Edición Limitada',
  title = 'Colección de Verano',
  actionLabel = 'Comprar el Look',
  image = DEFAULT_IMAGE,
  onActionPress,
}: HeroBannerProps) => (
  <ImageBackground
    source={image}
    style={styles.container}
    resizeMode="cover"
    accessibilityLabel={title}
  >
    <View style={styles.content}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Button
        label={actionLabel}
        variant="primary"
        onPress={onActionPress}
        style={styles.button}
      />
    </View>
  </ImageBackground>
);
