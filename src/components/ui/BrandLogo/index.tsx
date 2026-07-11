import React from 'react';
import { Image } from 'react-native';
import { moderateScale } from '@theme';
import { styles } from './BrandLogo.styles';

const logoSource = require('@/assets/images/borcelle-logo.png');

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
    style={[styles.logo, { width: size }]}
    resizeMode="contain"
  />
);
