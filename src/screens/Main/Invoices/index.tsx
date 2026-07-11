import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BAR_HEIGHT, Header } from '@components/layout';
import { Button } from '@components/ui';
import {
  formatPrice,
  getTransactions,
  type StoredTransaction,
} from '@lib';
import { colors, spacing } from '@theme';
import { navigationRef } from '@/navigation';
import type { InvoicesStackScreenProps } from '@/navigation';
import { styles } from './Invoices.styles';

/** Short human id for an invoice, derived from the first order id. */
export const invoiceNumber = (transaction: StoredTransaction): string =>
  `#${(transaction.orderIds[0] ?? '000000').slice(0, 6).toUpperCase()}`;

export const formatInvoiceDate = (iso: string): string => {
  const date = new Date(iso);
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

type InvoicesProps = InvoicesStackScreenProps<'InvoicesMain'>;

/** Purchase history: every stored transaction, newest first. */
export const InvoicesScreen = ({ navigation }: InvoicesProps) => {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState<StoredTransaction[]>([]);

  // Refresh on every visit: a purchase may have just finished.
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getTransactions().then(history => {
        if (alive) {
          setTransactions(history);
        }
      });
      return () => {
        alive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header />
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Facturas</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(transaction, index) =>
          `${transaction.orderIds[0] ?? index}`
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: BAR_HEIGHT + insets.bottom + spacing.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Factura ${invoiceNumber(item)}`}
            style={styles.row}
            onPress={() =>
              navigation.navigate('InvoiceDetail', { transaction: item })
            }
          >
            <View style={styles.rowInfo}>
              <Text style={styles.rowNumber}>
                {`Factura ${invoiceNumber(item)}`}
              </Text>
              <Text style={styles.rowDate}>
                {formatInvoiceDate(item.createdAt)}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowTotal}>
                {formatPrice(item.amountInCents)}
              </Text>
              <View
                style={[
                  styles.statusChip,
                  {
                    backgroundColor:
                      item.status === 'APPROVED'
                        ? colors.success
                        : colors.error,
                  },
                ]}
              >
                <Text style={styles.statusChipText}>
                  {item.status === 'APPROVED' ? 'APROBADA' : 'RECHAZADA'}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Aún no tienes compras. Cuando pagues tu primera orden, la factura
            aparecerá aquí.
          </Text>
        }
        ListFooterComponent={
          __DEV__ ? (
            <View style={styles.devEntry}>
              <Button
                label="Demo de estados (dev)"
                variant="ghost"
                onPress={() => {
                  if (navigationRef.isReady()) {
                    navigationRef.navigate('StatusDemo');
                  }
                }}
              />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};
