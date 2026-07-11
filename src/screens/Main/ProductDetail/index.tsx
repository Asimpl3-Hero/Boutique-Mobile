import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Header, BAR_HEIGHT, WAVE_PATH } from '@components/layout';
import { Button, CheckIcon, ShieldIcon, TruckIcon } from '@components/ui';
import { PerkBadge } from '@components/ux';
import { useAppDispatch, useAppSelector, addItem, selectProductById } from '@store';
import { colors, moderateScale, spacing } from '@theme';
import type { HomeStackScreenProps } from '@/navigation';
import { styles } from './ProductDetail.styles';

/** Decorative sizes (not a backend attribute). */
const SIZES = ['S', 'M', 'L', 'XL'];

// Decorative finish swatches in brand colors (not a backend attribute).
const FINISH_SWATCHES = [
  colors.primary,
  colors.secondary,
  colors.accent,
  colors.onAccent,
  colors.success,
];

/** How long the add button stays locked showing the success feedback. */
const ADDED_FEEDBACK_MS = 1000;

type ProductDetailProps = HomeStackScreenProps<'ProductDetail'>;

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
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current) {
        clearTimeout(addedTimer.current);
      }
    },
    [],
  );

  const handleAdd = () => {
    if (justAdded || !product) {
      return;
    }
    for (let unit = 0; unit < quantity; unit += 1) {
      dispatch(addItem(product));
    }
    setJustAdded(true);
    addedTimer.current = setTimeout(
      () => setJustAdded(false),
      ADDED_FEEDBACK_MS,
    );
  };

  if (!product) {
    // Resilient fallback: never crash on a stale/unknown id.
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
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
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header onBackPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // Clears the floating tab bar and the home indicator.
          paddingBottom: BAR_HEIGHT + insets.bottom + spacing.xl * 2,
        }}
      >
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={product.name}
          />
          {/* Same brand wave as the header, rising from the photo's base. */}
          <Svg
            pointerEvents="none"
            style={styles.imageWave}
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <Path d={WAVE_PATH} fill={colors.background} />
          </Svg>
        </View>
        <View style={styles.content}>
          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrow}>Novedad</Text>
            <Text style={styles.price}>{product.formattedPrice}</Text>
          </View>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.stock}>
            {product.stock > 0
              ? `${product.stock} disponibles en stock`
              : 'Agotado'}
          </Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.perksRow}>
            <PerkBadge
              icon={
                <ShieldIcon size={moderateScale(20)} color={colors.text} />
              }
              title="Garantía"
              text="Si no te vuela la cabeza, te devolvemos tu dinero."
            />
            <PerkBadge
              icon={<TruckIcon size={moderateScale(20)} color={colors.text} />}
              title="Envíos"
              text="Entregas rápidas a todo el país. Tu estilo no puede esperar."
            />
          </View>
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
          <Text style={styles.sectionLabel}>Talla</Text>
          <View style={styles.sizeRow}>
            {SIZES.map(size => (
              <Pressable
                key={size}
                accessibilityRole="button"
                accessibilityLabel={`Talla ${size}`}
                accessibilityState={
                  size === selectedSize ? { selected: true } : {}
                }
                onPress={() => setSelectedSize(size)}
                style={[
                  styles.sizeButton,
                  size === selectedSize && styles.sizeButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.sizeText,
                    size === selectedSize && styles.sizeTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.sectionLabel}>Cantidad</Text>
          <View style={styles.qtyRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Disminuir cantidad"
              style={styles.qtyButton}
              onPress={() => setQuantity(current => Math.max(1, current - 1))}
            >
              <Text style={styles.qtyButtonText}>−</Text>
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Aumentar cantidad"
              style={styles.qtyButton}
              onPress={() =>
                setQuantity(current => Math.min(product.stock, current + 1))
              }
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </Pressable>
          </View>
          <Button
            label={
              justAdded
                ? 'Añadido al carrito'
                : quantity > 1
                  ? `Añadir ${quantity} al Carrito`
                  : 'Añadir al Carrito'
            }
            icon={
              justAdded ? (
                <CheckIcon
                  size={moderateScale(18)}
                  color={colors.onPrimary}
                />
              ) : undefined
            }
            disabled={product.stock === 0}
            onPress={handleAdd}
            style={[styles.addButton, justAdded && styles.addButtonSuccess]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
