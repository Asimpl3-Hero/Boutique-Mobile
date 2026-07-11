import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { formatPrice } from '@lib';
import type { CartItem } from '@store';
import { styles } from '../Checkout.styles';

export interface BagStepProps {
  items: CartItem[];
  totalInCents: number;
  onIncrease: (item: CartItem) => void;
  onDecrease: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
}

/** Step 1 — review the bag: quantities, per-line totals and grand total. */
export const BagStep = ({
  items,
  totalInCents,
  onIncrease,
  onDecrease,
  onRemove,
}: BagStepProps) => (
  <View style={styles.formGap}>
    <Text style={styles.stepTitle}>Tu bolsa</Text>
    {items.length === 0 ? (
      <View style={styles.emptyState}>
        <Text style={styles.caption}>
          Tu carrito está vacío — agrega productos para continuar.
        </Text>
      </View>
    ) : (
      <>
        {items.map(item => (
          <View key={item.product.id} style={styles.itemRow}>
            <Image
              source={{ uri: item.product.imageUrl }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.itemPrice}>
                {formatPrice(
                  item.product.priceInCents * item.quantity,
                  item.product.currency,
                )}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Eliminar ${item.product.name}`}
                onPress={() => onRemove(item)}
              >
                <Text style={styles.removeLink}>Eliminar</Text>
              </Pressable>
            </View>
            <View style={styles.qtyRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Quitar uno de ${item.product.name}`}
                style={styles.qtyButton}
                onPress={() => onDecrease(item)}
              >
                <Text style={styles.qtyButtonText}>−</Text>
              </Pressable>
              <Text style={styles.qtyValue}>{item.quantity}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Agregar uno de ${item.product.name}`}
                style={styles.qtyButton}
                onPress={() => onIncrease(item)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(totalInCents)}</Text>
        </View>
        <Text style={styles.caption}>
          Cada producto se procesa como una orden independiente.
        </Text>
      </>
    )}
  </View>
);
