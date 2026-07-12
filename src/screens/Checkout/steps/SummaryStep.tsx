import React from 'react';
import { Text, View } from 'react-native';
import { PriceText } from '@components/ui';
import { taxFromBase } from '@lib';
import type { CartItem } from '@store';
import type { ShippingFormValues } from './ShippingStep';
import type { TokenizedCardSummary } from './CardStep';
import { bagTaxRate } from './BagStep';
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
}: SummaryStepProps) => {
  const taxRate = bagTaxRate(items);
  // Prices are the base: VAT is added on top of the charged total.
  const taxInCents = taxFromBase(totalInCents, taxRate);

  return (
  <View style={styles.formGap}>
    <Text style={styles.stepTitle}>Resumen</Text>

    <View style={styles.summaryCard}>
      {items.map(item => (
        <View key={item.product.id} style={styles.summaryRow}>
          <Text style={styles.summaryLabel} numberOfLines={1}>
            {`${item.product.name} ×${item.quantity}`}
          </Text>
          <PriceText
            valueInCents={item.product.priceInCents * item.quantity}
            currency={item.product.currency}
            style={styles.summaryValue}
          />
        </View>
      ))}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Envío y tarifas</Text>
        <Text style={styles.summaryValue}>Se confirman al procesar</Text>
      </View>
      {taxRate > 0 ? (
        <>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Precio sin IVA</Text>
            <PriceText
              valueInCents={totalInCents}
              style={styles.summaryValue}
            />
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {`IVA aplicado (${taxRate}%)`}
            </Text>
            <PriceText valueInCents={taxInCents} style={styles.summaryValue} />
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
    </View>

    <View style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Cliente</Text>
        <Text style={styles.summaryValue}>{customerEmail}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Recibe</Text>
        <Text style={styles.summaryValue} numberOfLines={1}>
          {shipping.fullName}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Email de envío</Text>
        <Text style={styles.summaryValue} numberOfLines={1}>
          {shipping.email}
        </Text>
      </View>
      {shipping.phone.trim() ? (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Teléfono</Text>
          <Text style={styles.summaryValue}>{shipping.phone}</Text>
        </View>
      ) : null}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Dirección</Text>
        <Text style={styles.summaryValue} numberOfLines={2}>
          {shipping.address2.trim()
            ? `${shipping.address1}, ${shipping.address2}`
            : shipping.address1}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Ciudad</Text>
        <Text style={styles.summaryValue} numberOfLines={1}>
          {`${shipping.city}, ${shipping.state}`}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Código postal</Text>
        <Text style={styles.summaryValue}>{shipping.zip}</Text>
      </View>
      {shipping.country.trim() ? (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>País</Text>
          <Text style={styles.summaryValue}>{shipping.country}</Text>
        </View>
      ) : null}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Pago</Text>
        <Text style={styles.summaryValue}>
          {card ? `•••• ${card.lastFour}` : '—'}
        </Text>
      </View>
    </View>
  </View>
  );
};
