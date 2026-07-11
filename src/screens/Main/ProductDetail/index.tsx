import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@components/layout';
import { Button } from '@components/ui';
import { useAppDispatch, useAppSelector, addItem, selectProductById } from '@store';
import { colors, spacing } from '@theme';
import type { RootStackScreenProps } from '@/navigation';
import { styles } from './ProductDetail.styles';

// Decorative finish swatches in brand colors (not a backend attribute).
const FINISH_SWATCHES = [
  colors.primary,
  colors.secondary,
  colors.accent,
  colors.onAccent,
  colors.success,
];

type ProductDetailProps = RootStackScreenProps<'ProductDetail'>;

/** Product detail: large image, story copy and add-to-cart (flow screen 3). */
export const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailProps) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const product = useAppSelector(state =>
    selectProductById(state, route.params.productId),
  );
  const [selectedFinish, setSelectedFinish] = useState(0);

  if (!product) {
    // Resilient fallback: never crash on a stale/unknown id.
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Header onBackPress={() => navigation.goBack()} />
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>
            Este producto ya no está disponible
          </Text>
          <Button
            label="Volver al catálogo"
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header onBackPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xl,
        }}
      >
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={product.name}
        />
        <View style={styles.content}>
          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrow}>Novedad</Text>
            <Text style={styles.price}>{product.formattedPrice}</Text>
          </View>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.sectionLabel}>Acabado</Text>
          <View style={styles.swatchRow}>
            {FINISH_SWATCHES.map((swatch, index) => (
              <Pressable
                key={swatch}
                accessibilityRole="button"
                accessibilityLabel={`Acabado ${index + 1}`}
                accessibilityState={
                  index === selectedFinish ? { selected: true } : {}
                }
                hitSlop={spacing.sm}
                onPress={() => setSelectedFinish(index)}
                style={[
                  styles.swatch,
                  { backgroundColor: swatch },
                  index === selectedFinish && styles.swatchSelected,
                ]}
              />
            ))}
          </View>
          <Button
            label="Añadir al Carrito"
            onPress={() => dispatch(addItem(product))}
            style={styles.addButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
