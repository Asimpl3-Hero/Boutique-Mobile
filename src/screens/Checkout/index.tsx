import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Header } from '@components/layout';
import { ScreenPlaceholder } from '@components/ux';
import { colors } from '@theme';
import type { RootStackScreenProps } from '@/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

type CheckoutProps = RootStackScreenProps<'Cart'>;

/** Cart + 4-step checkout flow. Placeholder shell — the stepper and forms
 *  land in the next blocks of mobile-05. */
export const CheckoutScreen = ({ navigation }: CheckoutProps) => (
  <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    <Header onBackPress={() => navigation.goBack()} />
    <ScreenPlaceholder title="Carrito" subtitle="Checkout próximamente" />
  </SafeAreaView>
);
