import React from 'react';
import { Animated, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Header } from '@components/layout';
import { PriceText } from '@components/ui';
import { useColorCycle } from '@lib';
import { colors } from '@theme';
import type { InvoicesStackScreenProps } from '@/navigation';
import { formatInvoiceDate, invoiceNumber } from '../Invoices';
import { styles } from './InvoiceDetail.styles';

// Grayscale variant: tintColor would flatten the artwork to a blob.
const LOGO = require('@/assets/images/logos/app-icon-bw.png');

/** Receipt torn edge: a strip of downward triangles closing the card. */
const TEETH = 18;
const TOOTH_WIDTH = 20;
const TORN_PATH = `M0 0 ${Array.from(
  { length: TEETH },
  (_, index) =>
    `L${index * TOOTH_WIDTH + TOOTH_WIDTH / 2} 12 L${
      (index + 1) * TOOTH_WIDTH
    } 0`,
).join(' ')} Z`;

/** Backdrop mood colors cycled softly behind the white receipt. */
const BACKDROP_PALETTE: string[] = [
  colors.onAccent,
  colors.secondary,
  colors.accent,
];

/** Duration of each color-to-color leg of the backdrop cycle. */
const BACKDROP_LEG_MS = 3500;

type InvoiceDetailProps = InvoicesStackScreenProps<'InvoiceDetail'>;

/** Invoice render: brand-styled receipt with the purchase line items. */
export const InvoiceDetailScreen = ({
  route,
  navigation,
}: InvoiceDetailProps) => {
  const { transaction } = route.params;
  const approved = transaction.status === 'APPROVED';
  const shipping = transaction.shipping;
  // Backend-authoritative breakdown; older records predate the fields.
  const taxInCents = transaction.taxInCents;
  const hasTax = typeof taxInCents === 'number' && taxInCents > 0;

  // Soft flicker-free color drift behind the receipt.
  const backdrop = useColorCycle(BACKDROP_PALETTE, BACKDROP_LEG_MS);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Animated.View
        pointerEvents="none"
        style={[styles.backdrop, { backgroundColor: backdrop }]}
      />
      <Header onBackPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.card}>
            <Image
              source={LOGO}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Borcelle"
            />
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>FACTURA BORCELLE</Text>
              <Text style={styles.number}>{invoiceNumber(transaction)}</Text>
            </View>
            <Text style={styles.date}>
              {formatInvoiceDate(transaction.createdAt)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: approved ? colors.success : colors.error,
                },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {approved ? 'APROBADA' : 'RECHAZADA'}
              </Text>
            </View>

            <View>
              <Text style={styles.shippingLabel}>ENVÍO</Text>
              {shipping ? (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>A nombre de</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>
                      {shipping.fullName}
                    </Text>
                  </View>
                  {shipping.email ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Email</Text>
                      <Text style={styles.infoValue} numberOfLines={1}>
                        {shipping.email}
                      </Text>
                    </View>
                  ) : null}
                  {shipping.phone ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Teléfono</Text>
                      <Text style={styles.infoValue} numberOfLines={1}>
                        {shipping.phone}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Dirección</Text>
                    <Text style={styles.infoValue} numberOfLines={2}>
                      {shipping.address2
                        ? `${shipping.address1}, ${shipping.address2}`
                        : shipping.address1}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ciudad</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>
                      {`${shipping.city}, ${shipping.state}`}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Código postal</Text>
                    <Text style={styles.infoValue}>{shipping.zip}</Text>
                  </View>
                  {shipping.country ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>País</Text>
                      <Text style={styles.infoValue}>{shipping.country}</Text>
                    </View>
                  ) : null}
                </>
              ) : null}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tarjeta</Text>
                <Text style={styles.infoValue}>
                  {`•••• ${transaction.cardLastFour}`}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.headerRow}>
                <Text style={[styles.headerCell, styles.cellProduct]}>
                  PRODUCTO
                </Text>
                <Text style={[styles.headerCell, styles.cellUnit]}>CANT</Text>
                <Text style={[styles.headerCell, styles.cellPrice]}>
                  PRECIO
                </Text>
              </View>
              {transaction.items.map((item, index) => (
                <View key={`${item.name}-${index}`} style={styles.row}>
                  <Text
                    style={[styles.cellText, styles.cellProduct]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text style={[styles.cellText, styles.cellUnit]}>
                    {item.quantity}
                  </Text>
                  <PriceText
                    valueInCents={item.priceInCents * item.quantity}
                    currency={item.currency}
                    plainCode
                    style={[styles.cellText, styles.cellPrice]}
                  />
                </View>
              ))}
              {hasTax ? (
                <>
                  <View style={styles.row}>
                    <Text style={[styles.cellText, styles.cellProduct]}>
                      Precio sin IVA
                    </Text>
                    <PriceText
                      valueInCents={transaction.amountInCents - taxInCents}
                      plainCode
                      style={[styles.cellText, styles.cellPrice]}
                    />
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.cellText, styles.cellProduct]}>
                      {`IVA aplicado (${transaction.taxRatePercent ?? 0}%)`}
                    </Text>
                    <PriceText
                      valueInCents={taxInCents}
                      plainCode
                      style={[styles.cellText, styles.cellPrice]}
                    />
                  </View>
                </>
              ) : null}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Precio Total</Text>
                <PriceText
                  valueInCents={transaction.amountInCents}
                  style={styles.totalValue}
                />
              </View>
            </View>

          </View>
          <Svg
            pointerEvents="none"
            style={styles.tornEdge}
            viewBox={`0 0 ${TEETH * TOOTH_WIDTH} 12`}
            preserveAspectRatio="none"
          >
            <Path d={TORN_PATH} fill={colors.surface} />
          </Svg>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
