import React from 'react';
import { Text, View } from 'react-native';
import { TextInputField } from '@components/ui';
import { styles } from '../Checkout.styles';

/** Editable shipping form values (mirrors ShippingData, all as strings). */
export interface ShippingFormValues {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type ShippingErrors = Partial<
  Record<keyof ShippingFormValues | 'customerEmail', string>
>;

export interface ShippingStepProps {
  customerEmail: string;
  onCustomerEmail: (value: string) => void;
  values: ShippingFormValues;
  onChange: (field: keyof ShippingFormValues, value: string) => void;
  errors: ShippingErrors;
}

/** Step 2 — customer email + shipping data, aligned with the backend DTO. */
export const ShippingStep = ({
  customerEmail,
  onCustomerEmail,
  values,
  onChange,
  errors,
}: ShippingStepProps) => (
  <View style={styles.formGap}>
    <Text style={styles.stepTitle}>Envío</Text>
    <TextInputField
      label="Email del cliente"
      value={customerEmail}
      onChangeText={onCustomerEmail}
      error={errors.customerEmail}
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
    />
    <TextInputField
      label="Nombre completo"
      value={values.fullName}
      onChangeText={value => onChange('fullName', value)}
      error={errors.fullName}
      autoComplete="name"
    />
    <TextInputField
      label="Email de envío"
      value={values.email}
      onChangeText={value => onChange('email', value)}
      error={errors.email}
      keyboardType="email-address"
      autoCapitalize="none"
    />
    <TextInputField
      label="Teléfono (opcional)"
      value={values.phone}
      onChangeText={value => onChange('phone', value)}
      error={errors.phone}
      keyboardType="phone-pad"
    />
    <TextInputField
      label="Dirección"
      value={values.address1}
      onChangeText={value => onChange('address1', value)}
      error={errors.address1}
    />
    <TextInputField
      label="Dirección 2 (opcional)"
      value={values.address2}
      onChangeText={value => onChange('address2', value)}
    />
    <View style={styles.fieldRow}>
      <View style={styles.fieldFlex}>
        <TextInputField
          label="Ciudad"
          value={values.city}
          onChangeText={value => onChange('city', value)}
          error={errors.city}
        />
      </View>
      <View style={styles.fieldFlex}>
        <TextInputField
          label="Departamento"
          value={values.state}
          onChangeText={value => onChange('state', value)}
          error={errors.state}
        />
      </View>
    </View>
    <View style={styles.fieldRow}>
      <View style={styles.fieldFlex}>
        <TextInputField
          label="Código postal"
          value={values.zip}
          onChangeText={value => onChange('zip', value)}
          error={errors.zip}
          keyboardType="number-pad"
        />
      </View>
      <View style={styles.fieldFlex}>
        <TextInputField
          label="País (opcional)"
          value={values.country}
          onChangeText={value => onChange('country', value)}
        />
      </View>
    </View>
  </View>
);
