import React from 'react';
import { Text, TextProps } from 'react-native';
import { formatPrice } from '@lib/utils';
import { styles } from './PriceText.styles';

export interface PriceTextProps extends TextProps {
  valueInCents: number;
  currency?: string;
  /** Renders the currency code in the surrounding style instead of Oi. */
  plainCode?: boolean;
}

/**
 * Price renderer: the amount inherits the surrounding text style while
 * the currency code is always set in the Oi brand face.
 */
export const PriceText = ({
  valueInCents,
  currency = 'COP',
  plainCode = false,
  style,
  ...textProps
}: PriceTextProps) => {
  const formatted = formatPrice(valueInCents, currency);

  if (plainCode) {
    return (
      <Text style={style} {...textProps}>
        {formatted}
      </Text>
    );
  }

  const suffix = ` ${currency}`;
  const hasSuffix = formatted.endsWith(suffix);
  const amount = hasSuffix
    ? formatted.slice(0, formatted.length - suffix.length)
    : formatted;

  return (
    <Text style={style} {...textProps}>
      {amount}
      {hasSuffix ? <Text style={[style, styles.code]}>{suffix}</Text> : null}
    </Text>
  );
};
