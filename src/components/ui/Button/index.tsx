import React from 'react';
import { Pressable, Text, ViewStyle, StyleProp } from 'react-native';
import { styles } from './Button.styles';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  /** Optional leading adornment (e.g. a success check). */
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const variantStyle = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
} as const;

const labelStyle = {
  primary: styles.labelPrimary,
  secondary: styles.labelSecondary,
  ghost: styles.labelGhost,
} as const;

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  style,
}: ButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={disabled ? { disabled: true } : {}}
    disabled={disabled}
    onPress={onPress}
    style={[styles.base, variantStyle[variant], disabled && styles.disabled, style]}
  >
    {icon ?? null}
    <Text style={[styles.label, labelStyle[variant]]}>{label}</Text>
  </Pressable>
);
