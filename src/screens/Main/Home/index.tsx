import React, { useCallback, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, BAR_HEIGHT, WAVE_HEIGHT } from '@components/layout';
import { Button, HangerIcon, ShirtIcon } from '@components/ui';
import {
  CartFab,
  CategoryCard,
  HeroBanner,
  ProductCarousel,
} from '@components/features';
import { Skeleton } from '@components/ux';
import {
  useAppDispatch,
  useAppSelector,
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '@store';
import { colors, moderateScale, spacing } from '@theme';
import { navigationRef } from '@/navigation';
import { styles } from './Home.styles';

interface MosaicItem {
  title: string;
  backgroundColor: string;
  titleColor: string;
  underlineColor: string;
  /** Optional — some tiles are icon+text, others text only (by design). */
  Icon?: React.ComponentType<{ size?: number; color?: string }>;
  /** Optional photo tile (wide rows). */
  image?: number;
}

/** Home mosaic categories: photo tiles on wide rows, solid tiles on pairs. */
const HOME_CATEGORIES: MosaicItem[] = [
  {
    title: 'Novedades',
    backgroundColor: colors.primary,
    titleColor: colors.onPrimary,
    underlineColor: colors.accent,
    image: require('@/assets/images/Sections/new-merch.jpg'),
  },
  {
    title: 'Más Vendidos',
    backgroundColor: colors.secondary,
    titleColor: colors.onSecondary,
    underlineColor: colors.accent,
    Icon: HangerIcon,
    image: require('@/assets/images/Sections/top-trending.jpg'),
  },
  {
    title: 'Camisetas',
    backgroundColor: colors.accent,
    titleColor: colors.onPrimary,
    underlineColor: colors.secondary,
    Icon: ShirtIcon,
    image: require('@/assets/images/Sections/shirts.jpg'),
  },
  {
    title: 'Total Looks',
    backgroundColor: colors.text,
    titleColor: colors.onPrimary,
    underlineColor: colors.secondary,
    image: require('@/assets/images/Sections/total-looks.jpg'),
  },
];

interface MosaicRow {
  key: string;
  items: MosaicItem[];
}

/** Bento pattern: alternating full-width row and half-and-half pair. */
const buildMosaicRows = (items: MosaicItem[]): MosaicRow[] => {
  const rows: MosaicRow[] = [];
  let index = 0;
  let wide = true;
  while (index < items.length) {
    const take = wide ? 1 : Math.min(2, items.length - index);
    rows.push({
      key: items[index].title,
      items: items.slice(index, index + take),
    });
    index += take;
    wide = !wide;
  }
  return rows;
};

/** Home: brand header, search, categories, hero and the product grid. */
export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const retry = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: MosaicRow }) => (
      <View style={styles.mosaicRow}>
        {item.items.map(category => (
          <View key={category.title} style={styles.mosaicCell}>
            <CategoryCard
              title={category.title}
              backgroundColor={category.backgroundColor}
              titleColor={category.titleColor}
              underlineColor={category.underlineColor}
              image={category.image}
              icon={
                category.Icon ? (
                  <category.Icon
                    size={moderateScale(28)}
                    color={category.underlineColor}
                  />
                ) : undefined
              }
              variant={item.items.length === 1 ? 'wide' : 'half'}
            />
          </View>
        ))}
      </View>
    ),
    [],
  );

  const listEmpty = () => {
    if (status === 'loading' || status === 'idle') {
      // Skeletons mirror the mosaic: wide row, then a pair, then wide.
      return (
        <View accessibilityLabel="Loading products">
          <View style={styles.skeletonRow}>
            <Skeleton style={styles.skeletonWide} />
          </View>
          <View style={styles.skeletonRow}>
            <Skeleton style={styles.skeletonCard} />
            <Skeleton style={styles.skeletonCard} />
          </View>
          <View style={styles.skeletonRow}>
            <Skeleton style={styles.skeletonWide} />
          </View>
        </View>
      );
    }
    if (status === 'failed') {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>No pudimos cargar el catálogo</Text>
          <Text style={styles.stateCaption}>{error}</Text>
          <Button label="Reintentar" onPress={retry} />
        </View>
      );
    }
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>Aún no hay productos</Text>
        <Text style={styles.stateCaption}>
          Las novedades están en camino — vuelve pronto.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header />
      <FlatList
        style={styles.list}
        data={status === 'succeeded' ? buildMosaicRows(HOME_CATEGORIES) : []}
        keyExtractor={row => row.key}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          // Content must clear the floating tab bar and the home indicator.
          // No top padding: the hero starts right under the header's wave.
          { paddingBottom: BAR_HEIGHT + insets.bottom + spacing.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={listEmpty}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <HeroBanner />
            <View style={styles.sectionRow}>
              <View style={styles.sectionTitleWrapper}>
                <Text style={styles.sectionTitle}>Moda</Text>
              </View>
            </View>
            {products.length > 0 ? (
              <ProductCarousel
                products={products}
                onPressProduct={productId => {
                  if (navigationRef.isReady()) {
                    navigationRef.navigate('ProductDetail', { productId });
                  }
                }}
              />
            ) : null}
            <View style={styles.sectionRow}>
              <View style={styles.sectionTitleWrapper}>
                <Text style={styles.sectionTitle}>Categorías</Text>
              </View>
            </View>
          </View>
        }
      />
      <CartFab
        onPress={() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate('Cart');
          }
        }}
      />
    </SafeAreaView>
  );
};
