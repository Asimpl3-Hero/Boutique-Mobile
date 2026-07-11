import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@components/layout';
import { Button } from '@components/ui';
import { Stepper } from '@components/ux';
import {
  useAppDispatch,
  useAppSelector,
  addItem,
  removeItem,
  removeLine,
  selectCartItems,
  selectCartTotal,
} from '@store';
import {
  validateEmail,
  validateOptionalPhone,
  validateRequired,
} from '@lib';
import { spacing } from '@theme';
import type { RootStackScreenProps } from '@/navigation';
import { styles } from './Checkout.styles';
import { BagStep } from './steps/BagStep';
import {
  ShippingStep,
  type ShippingErrors,
  type ShippingFormValues,
} from './steps/ShippingStep';
import { CardStep, type TokenizedCardSummary } from './steps/CardStep';
import { SummaryStep } from './steps/SummaryStep';

const STEPS = ['Bolsa', 'Envío', 'Tarjeta', 'Resumen'];

const EMPTY_SHIPPING: ShippingFormValues = {
  fullName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: '',
};

/** Validation aligned with CreateOrderRequestDto (required vs optional). */
export const validateShippingStep = (
  customerEmail: string,
  values: ShippingFormValues,
): ShippingErrors => {
  const errors: ShippingErrors = {};
  const customerEmailError = validateEmail(customerEmail);
  const fullNameError = validateRequired(values.fullName, 'El nombre');
  const emailError = validateEmail(values.email);
  const phoneError = validateOptionalPhone(values.phone);
  const address1Error = validateRequired(values.address1, 'La dirección');
  const cityError = validateRequired(values.city, 'La ciudad');
  const stateError = validateRequired(values.state, 'El departamento');
  const zipError = validateRequired(values.zip, 'El código postal');

  if (customerEmailError) {
    errors.customerEmail = customerEmailError;
  }
  if (fullNameError) {
    errors.fullName = fullNameError;
  }
  if (emailError) {
    errors.email = emailError;
  }
  if (phoneError) {
    errors.phone = phoneError;
  }
  if (address1Error) {
    errors.address1 = address1Error;
  }
  if (cityError) {
    errors.city = cityError;
  }
  if (stateError) {
    errors.state = stateError;
  }
  if (zipError) {
    errors.zip = zipError;
  }
  return errors;
};

type CheckoutProps = RootStackScreenProps<'Cart'>;

/** Cart + four-step checkout (Bolsa → Envío → Tarjeta → Resumen). */
export const CheckoutScreen = ({ navigation }: CheckoutProps) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const [step, setStep] = useState(0);
  const [customerEmail, setCustomerEmail] = useState('');
  const [shipping, setShipping] = useState<ShippingFormValues>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [card, setCard] = useState<TokenizedCardSummary | null>(null);

  const goBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }
    setStep(current => current - 1);
  };

  const goNext = () => {
    if (step === 1) {
      const nextErrors = validateShippingStep(customerEmail, shipping);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        return;
      }
    }
    setStep(current => Math.min(current + 1, STEPS.length - 1));
  };

  const continueDisabled =
    (step === 0 && items.length === 0) || (step === 2 && card === null);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header onBackPress={() => navigation.goBack()} />
      <View style={styles.stepper}>
        <Stepper steps={STEPS} current={step} />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 0 ? (
          <BagStep
            items={items}
            totalInCents={total}
            onIncrease={item => dispatch(addItem(item.product))}
            onDecrease={item =>
              item.quantity > 1
                ? dispatch(removeItem(item.product.id))
                : dispatch(removeLine(item.product.id))
            }
            onRemove={item => dispatch(removeLine(item.product.id))}
          />
        ) : null}
        {step === 1 ? (
          <ShippingStep
            customerEmail={customerEmail}
            onCustomerEmail={setCustomerEmail}
            values={shipping}
            onChange={(field, value) =>
              setShipping(current => ({ ...current, [field]: value }))
            }
            errors={errors}
          />
        ) : null}
        {step === 2 ? <CardStep card={card} onTokenized={setCard} /> : null}
        {step === 3 ? (
          <SummaryStep
            items={items}
            totalInCents={total}
            customerEmail={customerEmail}
            shipping={shipping}
            card={card}
          />
        ) : null}
      </ScrollView>
      <View
        style={[styles.navRow, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <Button
          label="Atrás"
          variant="ghost"
          onPress={goBack}
          style={styles.navButton}
        />
        {step < STEPS.length - 1 ? (
          <Button
            label="Continuar"
            onPress={goNext}
            disabled={continueDisabled}
            style={styles.navButton}
          />
        ) : (
          // Payment submission is wired in the final block of mobile-05.
          <Button label="Pagar" disabled style={styles.navButton} />
        )}
      </View>
    </SafeAreaView>
  );
};
