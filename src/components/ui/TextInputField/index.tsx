import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '@theme';
import { styles } from './TextInputField.styles';

export interface TextInputFieldProps extends TextInputProps {
  label: string;
  /** Validation message; renders the error state when present. */
  error?: string | null;
}

/** Labeled input with inline validation error, themed with tokens. */
export const TextInputField = ({
  label,
  error,
  ...inputProps
}: TextInputFieldProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      accessibilityLabel={label}
      placeholderTextColor={colors.textMuted}
      style={[styles.input, error ? styles.inputError : null]}
      {...inputProps}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);
