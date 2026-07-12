import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { PriceText } from '@components/ui';
import { taxFromBase } from '@lib';
import type { CartItem } from '@store';
import { styles } from '../Checkout.styles';

/** Single backend-configured rate: any product in the bag carries it. */
export const bagTaxRate = (items: CartItem[]): number =>
  items[0]?.product.taxRatePercent ?? 0;

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
}: BagStepProps) => {
  const taxRate = bagTaxRate(items);
  // Prices are the base: VAT is added on top of the charged total.
  const taxInCents = taxFromBase(totalInCents, taxRate);

  return (
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
              <PriceText
                valueInCents={item.product.priceInCents * item.quantity}
                currency={item.product.currency}
                style={styles.itemPrice}
              />
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
        {taxRate > 0 ? (
          <>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <PriceText
                valueInCents={totalInCents}
                style={styles.summaryValue}
              />
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{`IVA (${taxRate}%)`}</Text>
              <PriceText
                valueInCents={taxInCents}
                style={styles.summaryValue}
              />
            </View>
          </>
        ) : null}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            {taxRate > 0 ? 'Total con IVA' : 'Total'}
          </Text>
          <PriceText
            valueInCents={totalInCents + taxInCents}
            style={styles.totalValue}
          />
        </View>
        <Text style={styles.caption}>
          Tu privacidad es lo primero: tus datos personales y de pago se
          procesan de forma segura y cifrada.
        </Text>
      </>
    )}
  </View>
  );
};
