import React from 'react';
import { Text, View } from 'react-native';
import { formatPrice } from '@lib';
import type { CartItem } from '@store';
import type { ShippingFormValues } from './ShippingStep';
import type { TokenizedCardSummary } from './CardStep';
import { styles } from '../Checkout.styles';

export interface SummaryStepProps {
  items: CartItem[];
  totalInCents: number;
  customerEmail: string;
  shipping: ShippingFormValues;
  card: TokenizedCardSummary | null;
}

/** Step 4 — final review before paying. Fees are resolved by the backend. */
export const SummaryStep = ({
  items,
  totalInCents,
  customerEmail,
  shipping,
  card,
}: SummaryStepProps) => (
  <View style={styles.formGap}>
    <Text style={styles.stepTitle}>Resumen</Text>

    <View style={styles.summaryCard}>
      {items.map(item => (
        <View key={item.product.id} style={styles.summaryRow}>
          <Text style={styles.summaryLabel} numberOfLines={1}>
            {`${item.product.name} ×${item.quantity}`}
          </Text>
          <Text style={styles.summaryValue}>
            {formatPrice(
              item.product.priceInCents * item.quantity,
              item.product.currency,
            )}
          </Text>
        </View>
      ))}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Envío y tarifas</Text>
        <Text style={styles.summaryValue}>Se confirman al procesar</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(totalInCents)}</Text>
      </View>
    </View>

    <View style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Cliente</Text>
        <Text style={styles.summaryValue}>{customerEmail}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Envía a</Text>
        <Text style={styles.summaryValue} numberOfLines={2}>
          {`${shipping.fullName} — ${shipping.address1}, ${shipping.city}`}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Pago</Text>
        <Text style={styles.summaryValue}>
          {card ? `•••• ${card.lastFour}` : '—'}
        </Text>
      </View>
    </View>
  </View>
);
