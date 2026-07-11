/** Raw product as returned by the backend (`GET /products`). */
export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  imageUrl: string;
  stock: number;
  currency: string;
  /** VAT rate already included in priceInCents (integer percent). */
  taxRatePercent: number;
  createdAt: string;
}

/** Product model consumed by the UI. */
export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  /** Price ready for display (e.g. "$ 16.800"). */
  formattedPrice: string;
  imageUrl: string;
  stock: number;
  currency: string;
  /** VAT rate already included in the price (integer percent). */
  taxRatePercent: number;
  createdAt: string;
}
