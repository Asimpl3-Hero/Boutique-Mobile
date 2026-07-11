import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, BAR_HEIGHT } from '@components/layout';
import { SearchBar, Button } from '@components/ui';
import { CategoryChips, HeroBanner, ProductCard } from '@components/features';
import { Skeleton } from '@components/ux';
import {
  useAppDispatch,
  useAppSelector,
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '@store';
import { spacing } from '@theme';
import type { Product } from '@lib/services/products';
import { styles } from './Home.styles';

const SKELETON_ROWS = 2;

/** Home: brand header, search, categories, hero and the product grid. */
export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const retry = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard product={item} />,
    [],
  );

  const listEmpty = () => {
    if (status === 'loading' || status === 'idle') {
      return (
        <View accessibilityLabel="Loading products">
          {Array.from({ length: SKELETON_ROWS }).map((_, row) => (
            <View key={row} style={styles.skeletonRow}>
              <Skeleton style={styles.skeletonCard} />
              <Skeleton style={styles.skeletonCard} />
            </View>
          ))}
        </View>
      );
    }
    if (status === 'failed') {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>We couldn't load the catalog</Text>
          <Text style={styles.stateCaption}>{error}</Text>
          <Button label="Try again" onPress={retry} />
        </View>
      );
    }
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>No products yet</Text>
        <Text style={styles.stateCaption}>
          New arrivals are on their way — check back soon.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header />
      <FlatList
        data={status === 'succeeded' ? products : []}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          // Content must clear the floating tab bar and the home indicator.
          { paddingBottom: BAR_HEIGHT + insets.bottom + spacing.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={listEmpty}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.padded}>
              <SearchBar />
            </View>
            <CategoryChips
              active={activeCategory}
              onSelect={setActiveCategory}
            />
            <View style={styles.padded}>
              <HeroBanner />
            </View>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <Pressable accessibilityRole="button" hitSlop={spacing.sm}>
                <Text style={styles.seeAll}>See All</Text>
              </Pressable>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};
