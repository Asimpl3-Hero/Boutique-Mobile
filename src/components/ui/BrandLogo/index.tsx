import React from 'react';
import { Image } from 'react-native';
import { moderateScale } from '@theme';
import { styles } from './BrandLogo.styles';

const logoSource = require('@/assets/images/logos/Borcelle.png');

export interface BrandLogoProps {
  /** Rendered width in scaled points (the PNG is square). */
  size?: number;
}

/** BORCELLE brand logo (includes the brand name — no extra text needed). */
export const BrandLogo = ({ size = moderateScale(120) }: BrandLogoProps) => (
  <Image
    source={logoSource}
    accessibilityRole="image"
    accessibilityLabel="Borcelle"
    // Explicit box: never fall back to the PNG's intrinsic 2000px size.
    style={[styles.logo, { width: size, height: size }]}
    resizeMode="contain"
  />
);
