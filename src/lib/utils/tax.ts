/**
 * Display-only mirror of the backend's VAT-on-top math: product prices are
 * the taxable base and the tax is ADDED to the total charged. The backend
 * remains the source of truth — persisted invoices use its cents.
 */
export const taxFromBase = (
  baseInCents: number,
  ratePercent: number,
): number => {
  if (baseInCents <= 0 || ratePercent <= 0) {
    return 0;
  }
  return Math.round((baseInCents * ratePercent) / 100);
};
