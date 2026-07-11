import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { colors, moderateScale } from '@theme';
import { HeartIcon, PlusIcon } from '@components/ui';
import { useAppDispatch, addItem } from '@store';
import type { Product } from '@lib/services/products';
import { styles } from './ProductCard.styles';

export type ProductCardVariant = 'half' | 'wide';

export interface ProductCardProps {
  product: Product;
  /** 'half' for paired columns, 'wide' for full-width mosaic rows. */
  variant?: ProductCardVariant;
  /** Fired when the card body is pressed (e.g. open the product detail). */
  onPress?: () => void;
}

// 32/36pt controls + hitSlop keep touch targets at ≥44pt.
const HIT_SLOP = moderateScale(6);

/** Catalog card: image, wishlist heart, name, price and add-to-cart. */
export const ProductCard = ({
  product,
  variant = 'half',
  onPress,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver ${product.name}`}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.imageUrl }}
          style={variant === 'wide' ? styles.imageWide : styles.image}
          resizeMode="cover"
          accessibilityLabel={product.name}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Agregar ${product.name} a favoritos`}
          accessibilityState={wishlisted ? { selected: true } : {}}
          hitSlop={HIT_SLOP}
          onPress={() => setWishlisted(current => !current)}
          style={styles.wishlist}
        >
          <HeartIcon
            size={moderateScale(18)}
            color={wishlisted ? colors.secondary : colors.textMuted}
            filled={wishlisted}
          />
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>{product.formattedPrice}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Agregar ${product.name} al carrito`}
            hitSlop={HIT_SLOP}
            onPress={() => dispatch(addItem(product))}
            style={styles.addButton}
          >
            <PlusIcon size={moderateScale(18)} color={colors.onPrimary} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};
