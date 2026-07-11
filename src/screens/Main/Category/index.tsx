import React, { useCallback } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, BAR_HEIGHT } from '@components/layout';
import { ProductCard } from '@components/features';
import { useAppSelector, selectProducts } from '@store';
import { colors, spacing } from '@theme';
import type { Product } from '@lib/services/products';
import type { HomeStackScreenProps } from '@/navigation';
import { styles } from './Category.styles';

type CategoryProps = HomeStackScreenProps<'Category'>;

/** Category catalog: banner themed by the selected category plus the
 *  full product grid. */
export const CategoryScreen = ({ route, navigation }: CategoryProps) => {
  const { title, image, backgroundColor, underlineColor } = route.params;
  const insets = useSafeAreaInsets();
  const products = useAppSelector(selectProducts);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={{ flex: 1 }}>
        <ProductCard
          product={item}
          rounded
          onPress={() =>
            navigation.navigate('ProductDetail', { productId: item.id })
          }
        />
      </View>
    ),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header onBackPress={() => navigation.goBack()} />
      <FlatList
        style={styles.list}
        data={products}
        keyExtractor={product => product.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={[
          styles.listContent,
          // Content must clear the floating tab bar and the home indicator.
          { paddingBottom: BAR_HEIGHT + insets.bottom + spacing.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View
            style={[
              styles.banner,
              backgroundColor ? { backgroundColor } : null,
            ]}
          >
            {image ? (
              <>
                <Image
                  source={image}
                  style={styles.bannerFill}
                  resizeMode="cover"
                />
                <View style={[styles.bannerFill, styles.bannerScrim]} />
              </>
            ) : null}
            <View
              style={[
                styles.bannerTitleWrapper,
                { borderBottomColor: underlineColor ?? colors.secondary },
              ]}
            >
              <Text style={styles.bannerTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Aún no hay productos disponibles.</Text>
        }
      />
    </SafeAreaView>
  );
};
