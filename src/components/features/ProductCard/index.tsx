import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { colors, moderateScale } from '@theme';
import { HeartIcon, PlusIcon } from '@components/ui';
import { useAppDispatch, addItem } from '@store';
import type { Product } from '@lib/services/products';
import { styles } from './ProductCard.styles';

export interface ProductCardProps {
  product: Product;
}

// 32/36pt controls + hitSlop keep touch targets at ≥44pt.
const HIT_SLOP = moderateScale(6);

/** Catalog card: image, wishlist heart, name, price and add-to-cart. */
export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={product.name}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name} to wishlist`}
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
            accessibilityLabel={`Add ${product.name} to cart`}
            hitSlop={HIT_SLOP}
            onPress={() => dispatch(addItem(product))}
            style={styles.addButton}
          >
            <PlusIcon size={moderateScale(18)} color={colors.onPrimary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
