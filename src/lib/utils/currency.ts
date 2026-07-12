/**
 * Formats a price expressed in cents as a display string with the local
 * currency code (COP by default, no decimals — e.g. 1680000 → "$ 16.800 COP").
 */
export const formatPrice = (priceInCents: number, currency = 'COP'): string => {
  const amount = priceInCents / 100;
  try {
    const formatted = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
    // The es-CO symbol is just "$": make the local currency explicit.
    return formatted.includes(currency)
      ? formatted
      : `${formatted} ${currency}`;
  } catch {
    // Hermes builds without Intl: manual thousands separator fallback.
    const rounded = Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$ ${rounded} ${currency}`;
  }
};
