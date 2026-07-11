import { formatPrice } from '@lib/utils';
import type { ApiProduct, Product } from './types';

/** Maps the backend payload to the UI product model. */
export const mapApiProduct = (api: ApiProduct): Product => ({
  id: api.id,
  name: api.name,
  description: api.description,
  priceInCents: api.priceInCents,
  formattedPrice: formatPrice(api.priceInCents, api.currency),
  imageUrl: api.imageUrl,
  stock: api.stock,
  currency: api.currency,
  // Tolerates an older backend without the field (renders as 0%).
  taxRatePercent: api.taxRatePercent ?? 0,
  createdAt: api.createdAt,
});
