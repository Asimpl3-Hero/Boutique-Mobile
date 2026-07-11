/**
 * Formats a price expressed in cents as a display string (COP by default,
 * no decimals — e.g. 1680000 → "$ 16.800").
 */
export const formatPrice = (priceInCents: number, currency = 'COP'): string => {
  const amount = priceInCents / 100;
  try {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Hermes builds without Intl: manual thousands separator fallback.
    const rounded = Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$ ${rounded}`;
  }
};
