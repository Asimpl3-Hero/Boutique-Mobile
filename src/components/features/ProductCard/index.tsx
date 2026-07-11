import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { colors, moderateScale } from '@theme';
import { PlusIcon } from '@components/ui';
import { useAppDispatch, addItem } from '@store';
import type { Product } from '@lib/services/products';
import { styles } from './ProductCard.styles';

export type ProductCardVariant = 'half' | 'wide' | 'tile';

export interface ProductCardProps {
  product: Product;
  /** 'half' for paired columns, 'wide' for full-width rows, 'tile' for
   *  image-only strips (no info footer, add button over the image). */
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
        {variant === 'tile' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Agregar ${product.name} al carrito`}
            hitSlop={HIT_SLOP}
            onPress={() => dispatch(addItem(product))}
            style={[styles.addButton, styles.addButtonOverlay]}
          >
            <PlusIcon size={moderateScale(18)} color={colors.onPrimary} />
          </Pressable>
        ) : null}
      </View>
      {variant !== 'tile' ? (
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
      ) : null}
    </Pressable>
  );
};
