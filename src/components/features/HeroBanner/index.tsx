import React from 'react';
import { ImageBackground, ImageSourcePropType, Text, View } from 'react-native';
import { styles } from './HeroBanner.styles';

const DEFAULT_IMAGE = require('@/assets/images/Sections/summer-collection.jpg');

export interface HeroBannerProps {
  eyebrow?: string;
  title?: string;
  image?: ImageSourcePropType;
}

/** Home hero: campaign photo with scrim and copy (no CTA by design). */
export const HeroBanner = ({
  eyebrow = 'Edición Limitada',
  title = 'Colección de Verano',
  image = DEFAULT_IMAGE,
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
    </View>
  </ImageBackground>
);
