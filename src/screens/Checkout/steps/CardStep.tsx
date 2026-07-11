import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, TextInputField } from '@components/ui';
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  paymentsService,
  validateCardNumber,
  validateCvc,
  validateExpiry,
  validateRequired,
  type CardBrand,
} from '@lib';
import { spacing } from '@theme';
import { styles } from '../Checkout.styles';

export interface TokenizedCardSummary {
  cardToken: string;
  lastFour: string;
  brand: CardBrand;
}

export interface CardStepProps {
  card: TokenizedCardSummary | null;
  onTokenized: (card: TokenizedCardSummary) => void;
}

const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'VISA',
  mastercard: 'MASTERCARD',
  unknown: 'TARJETA',
};

/** Step 3 — card capture in a bottom backdrop; only the token leaves. */
export const CardStep = ({ card, onTokenized }: CardStepProps) => {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const brand = detectCardBrand(number);

  const close = () => {
    setOpen(false);
    setErrors({});
    setSubmitError(null);
    setNumber('');
    setHolder('');
    setExpiry('');
    setCvc('');
  };

  const save = async () => {
    const nextErrors: Record<string, string> = {};
    const numberError = validateCardNumber(number);
    const holderError = validateRequired(holder, 'El nombre');
    const expiryError = validateExpiry(expiry);
    const cvcError = validateCvc(cvc);
    if (numberError) {
      nextErrors.number = numberError;
    }
    if (holderError) {
      nextErrors.holder = holderError;
    }
    if (expiryError) {
      nextErrors.expiry = expiryError;
    }
    if (cvcError) {
      nextErrors.cvc = cvcError;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const [expMonth, expYear] = expiry.split('/');
      const tokenized = await paymentsService.tokenizeCard({
        number,
        cardHolder: holder,
        expMonth,
        expYear,
        cvc,
      });
      onTokenized({ ...tokenized, brand });
      close();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No pudimos guardar la tarjeta',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.formGap}>
      <Text style={styles.stepTitle}>Pago con tarjeta</Text>
      {card ? (
        <View style={styles.cardSummary}>
          <Text style={styles.cardSummaryText}>
            {`•••• ${card.lastFour}`}
          </Text>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>
              {BRAND_LABEL[card.brand]}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.caption}>
          Agrega una tarjeta para continuar. Solo guardamos el token — nunca
          el número.
        </Text>
      )}
      <Button
        label={card ? 'Cambiar tarjeta' : 'Pagar con tarjeta'}
        variant={card ? 'ghost' : 'primary'}
        onPress={() => setOpen(true)}
      />

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <KeyboardAvoidingView
          style={styles.backdropScrim}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            accessibilityLabel="Cerrar formulario de tarjeta"
            style={{ flex: 1 }}
            onPress={close}
          />
          <View
            style={[
              styles.backdropPanel,
              { paddingBottom: insets.bottom + spacing.lg },
            ]}
          >
            <View style={styles.backdropHandle} />
            <View style={styles.summaryRow}>
              <Text style={styles.backdropTitle}>Datos de tarjeta</Text>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>{BRAND_LABEL[brand]}</Text>
              </View>
            </View>
            <TextInputField
              label="Número de tarjeta"
              value={number}
              onChangeText={value => setNumber(formatCardNumber(value))}
              error={errors.number}
              keyboardType="number-pad"
              maxLength={23}
            />
            <TextInputField
              label="Nombre en la tarjeta"
              value={holder}
              onChangeText={setHolder}
              error={errors.holder}
              autoCapitalize="characters"
            />
            <View style={styles.fieldRow}>
              <View style={styles.fieldFlex}>
                <TextInputField
                  label="Vence (MM/AA)"
                  value={expiry}
                  onChangeText={value => setExpiry(formatExpiry(value))}
                  error={errors.expiry}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={styles.fieldFlex}>
                <TextInputField
                  label="CVC"
                  value={cvc}
                  onChangeText={setCvc}
                  error={errors.cvc}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
            {submitError ? (
              <Text style={styles.errorText}>{submitError}</Text>
            ) : null}
            <Button
              label={submitting ? 'Guardando…' : 'Guardar tarjeta'}
              onPress={save}
              disabled={submitting}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
