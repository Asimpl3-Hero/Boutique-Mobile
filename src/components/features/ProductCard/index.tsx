import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { colors, moderateScale } from '@theme';
import { CheckIcon, PlusIcon } from '@components/ui';
import { useAppDispatch, addItem } from '@store';
import type { Product } from '@lib/services/products';
import { styles } from './ProductCard.styles';

export type ProductCardVariant = 'half' | 'wide' | 'tile';

export interface ProductCardProps {
  product: Product;
  /** 'half' for paired columns, 'wide' for full-width rows, 'tile' for
   *  image-only strips (no info footer, add button over the image). */
  variant?: ProductCardVariant;
  /** Rounded corners (category grids); flat by default for flush strips. */
  rounded?: boolean;
  /** Fired when the card body is pressed (e.g. open the product detail). */
  onPress?: () => void;
}

// 32/36pt controls + hitSlop keep touch targets at ≥44pt.
const HIT_SLOP = moderateScale(6);
/** How long the button stays locked showing the success feedback. */
const ADDED_FEEDBACK_MS = 3000;

/** Catalog card: image, name, price and add-to-cart with success feedback. */
export const ProductCard = ({
  product,
  variant = 'half',
  rounded = false,
  onPress,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const handleAdd = () => {
    if (justAdded) {
      return;
    }
    dispatch(addItem(product));
    setJustAdded(true);
    timerRef.current = setTimeout(
      () => setJustAdded(false),
      ADDED_FEEDBACK_MS,
    );
  };

  const addButton = (overlay: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        justAdded
          ? `${product.name} agregado al carrito`
          : `Agregar ${product.name} al carrito`
      }
      accessibilityState={justAdded ? { disabled: true } : {}}
      disabled={justAdded}
      hitSlop={HIT_SLOP}
      onPress={handleAdd}
      style={[
        styles.addButton,
        overlay && styles.addButtonOverlay,
        justAdded && styles.addButtonSuccess,
      ]}
    >
      {justAdded ? (
        <CheckIcon size={moderateScale(18)} color={colors.onPrimary} />
      ) : (
        <PlusIcon size={moderateScale(18)} color={colors.onPrimary} />
      )}
    </Pressable>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver ${product.name}`}
      onPress={onPress}
      style={[styles.container, rounded && styles.containerRounded]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.imageUrl }}
          style={variant === 'wide' ? styles.imageWide : styles.image}
          resizeMode="cover"
          accessibilityLabel={product.name}
        />
        {variant === 'tile' ? addButton(true) : null}
      </View>
      {variant !== 'tile' ? (
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.row}>
            <Text style={styles.price}>{product.formattedPrice}</Text>
            {addButton(false)}
          </View>
        </View>
      ) : null}
    </Pressable>
  );
};
