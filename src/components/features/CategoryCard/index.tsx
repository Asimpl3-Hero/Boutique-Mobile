import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';
import { colors } from '@theme';
import { styles } from './CategoryCard.styles';

export type CategoryCardVariant = 'half' | 'wide';

export interface CategoryCardProps {
  title: string;
  /** Solid brand tile color (backdrop while a photo loads, if any). */
  backgroundColor?: string;
  titleColor?: string;
  underlineColor?: string;
  /** Optional photo tile: rendered under a scrim for legibility. */
  image?: ImageSourcePropType;
  /** Small decorative SVG rendered above the title. */
  icon?: React.ReactNode;
  /** 'half' for paired columns, 'wide' for full-width mosaic rows. */
  variant?: CategoryCardVariant;
  onPress?: () => void;
}

/** Mosaic category tile: solid brand color (or photo) with an optional icon
 *  and an underlined single-line Oi title, centered. */
export const CategoryCard = ({
  title,
  backgroundColor = colors.text,
  titleColor = colors.onPrimary,
  underlineColor = colors.secondary,
  image,
  icon,
  variant = 'half',
  onPress,
}: CategoryCardProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={title}
    onPress={onPress}
    style={[
      styles.container,
      variant === 'wide' ? styles.wide : styles.half,
      { backgroundColor },
    ]}
  >
    {image ? (
      <>
        <Image source={image} style={styles.fill} resizeMode="cover" />
        <View style={[styles.fill, styles.scrim]} />
      </>
    ) : null}
    {icon ?? null}
    <View style={[styles.titleWrapper, { borderBottomColor: underlineColor }]}>
      <Text
        style={[styles.title, { color: titleColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
      >
        {title}
      </Text>
    </View>
  </Pressable>
);
