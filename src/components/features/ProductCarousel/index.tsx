import React, { useEffect, useMemo, useRef } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import type { Product } from '@lib/services/products';
import { ProductCard } from '../ProductCard';

export interface ProductCarouselProps {
  products: Product[];
  onPressProduct?: (productId: string) => void;
  /** Auto-advance cadence; the loop pauses while the user is dragging. */
  intervalMs?: number;
}

/** How many tiles are visible at once in the strip. */
const VISIBLE_TILES = 3;
/** Time the scroll animation needs before the silent loop reset. */
const RESET_DELAY_MS = 450;

/** Image-only strip of flush product tiles with an infinite auto-loop:
 *  the first tiles are cloned at the tail, and crossing the seam snaps
 *  back to the real start without animation. */
export const ProductCarousel = ({
  products,
  onPressProduct,
  intervalMs = 3000,
}: ProductCarouselProps) => {
  const { width } = useWindowDimensions();
  const itemWidth = width / VISIBLE_TILES;
  const loops = products.length > VISIBLE_TILES;

  const data = useMemo(
    () => (loops ? [...products, ...products.slice(0, VISIBLE_TILES)] : products),
    [products, loops],
  );

  const listRef = useRef<FlatList<Product>>(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!loops) {
      return;
    }
    const timer = setInterval(() => {
      if (pausedRef.current) {
        return;
      }
      const next = indexRef.current + 1;
      indexRef.current = next;
      listRef.current?.scrollToOffset({
        offset: next * itemWidth,
        animated: true,
      });
      if (next >= products.length) {
        // We just animated onto the cloned head: snap back silently.
        resetTimerRef.current = setTimeout(() => {
          indexRef.current = 0;
          listRef.current?.scrollToOffset({ offset: 0, animated: false });
        }, RESET_DELAY_MS);
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [loops, products.length, intervalMs, itemWidth]);

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={data}
      keyExtractor={(product, index) => `${product.id}-${index}`}
      showsHorizontalScrollIndicator={false}
      onScrollBeginDrag={() => {
        pausedRef.current = true;
      }}
      onMomentumScrollEnd={event => {
        // Resync the loop with wherever the user left the strip; if they
        // landed on the cloned seam, snap to the equivalent real tile.
        let index = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
        if (loops && index >= products.length) {
          index -= products.length;
          listRef.current?.scrollToOffset({
            offset: index * itemWidth,
            animated: false,
          });
        }
        indexRef.current = index;
        pausedRef.current = false;
      }}
      renderItem={({ item }) => (
        <View style={{ width: itemWidth }}>
          <ProductCard
            product={item}
            variant="tile"
            onPress={onPressProduct ? () => onPressProduct(item.id) : undefined}
          />
        </View>
      )}
    />
  );
};
