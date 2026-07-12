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
import { colors, spacing } from '@theme';
import { styles } from '../Checkout.styles';

export interface TokenizedCardSummary {
  cardToken: string;
  lastFour: string;
  brand: CardBrand;
}

export interface CardStepProps {
  /** Saved cards (capped at MAX_CARDS); the selected one pays. */
  cards: TokenizedCardSummary[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onTokenized: (card: TokenizedCardSummary) => void;
}

export const MAX_CARDS = 2;

const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'VISA',
  mastercard: 'MASTERCARD',
  unknown: 'TARJETA',
};

/** Badge tint per detected brand (navy fallback while unknown). */
const BRAND_BADGE: Record<CardBrand, { bg: string; fg: string }> = {
  visa: { bg: colors.primary, fg: colors.onPrimary },
  mastercard: { bg: colors.accent, fg: colors.onAccent },
  unknown: { bg: colors.text, fg: colors.onPrimary },
};

/** Sandbox test cards from the payments provider (approve / decline). */
const TEST_CARDS = {
  approved: '4242 4242 4242 4242',
  declined: '4111 1111 1111 1111',
} as const;

/** Step 3 — card capture in a bottom backdrop; only the token leaves. */
export const CardStep = ({
  cards,
  selectedIndex,
  onSelect,
  onTokenized,
}: CardStepProps) => {
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

  const fillTestCard = (number16: string, holder16: string) => {
    setNumber(number16);
    setHolder(holder16);
    setExpiry('12/29');
    setCvc('123');
    setErrors({});
    setSubmitError(null);
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
      {cards.length === 0 ? (
        <Text style={styles.caption}>
          Agrega una tarjeta para continuar.
        </Text>
      ) : (
        cards.map((card, index) => (
          <Pressable
            key={`${card.cardToken}-${index}`}
            accessibilityRole="button"
            accessibilityLabel={`Tarjeta terminada en ${card.lastFour}`}
            accessibilityState={
              index === selectedIndex ? { selected: true } : {}
            }
            onPress={() => onSelect(index)}
            style={[
              styles.cardSummary,
              index === selectedIndex && styles.cardSummarySelected,
            ]}
          >
            <Text style={styles.cardSummaryText}>
              {`•••• ${card.lastFour}`}
            </Text>
            <View
              style={[
                styles.brandBadge,
                { backgroundColor: BRAND_BADGE[card.brand].bg },
              ]}
            >
              <Text
                style={[
                  styles.brandBadgeText,
                  { color: BRAND_BADGE[card.brand].fg },
                ]}
              >
                {BRAND_LABEL[card.brand]}
              </Text>
            </View>
          </Pressable>
        ))
      )}
      {cards.length < MAX_CARDS ? (
        <Button
          label={cards.length > 0 ? 'Agregar otra tarjeta' : 'Pagar con tarjeta'}
          variant={cards.length > 0 ? 'ghost' : 'primary'}
          onPress={() => setOpen(true)}
        />
      ) : (
        <Text style={styles.caption}>Máximo 2 tarjetas guardadas.</Text>
      )}

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <KeyboardAvoidingView
          style={styles.backdropScrim}
          // Android too: the panel must rise above the numeric keyboard.
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              <View
                style={[
                  styles.brandBadge,
                  { backgroundColor: BRAND_BADGE[brand].bg },
                ]}
              >
                <Text
                  style={[
                    styles.brandBadgeText,
                    { color: BRAND_BADGE[brand].fg },
                  ]}
                >
                  {BRAND_LABEL[brand]}
                </Text>
              </View>
            </View>
            <View style={styles.fieldRow}>
              <View style={styles.fieldFlex}>
                <Button
                  label="Tarjeta aprobada"
                  variant="ghost"
                  onPress={() =>
                    fillTestCard(TEST_CARDS.approved, 'APPROVED TEST')
                  }
                />
              </View>
              <View style={styles.fieldFlex}>
                <Button
                  label="Tarjeta rechazada"
                  variant="ghost"
                  onPress={() =>
                    fillTestCard(TEST_CARDS.declined, 'DECLINED TEST')
                  }
                />
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
