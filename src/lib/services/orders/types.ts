/**
 * Mirrors of the backend order contract (`POST /orders`, `GET /orders/:id`).
 * Field names and optionality must match the DTOs exactly — never invent
 * fields the backend does not accept.
 */

export type OrderStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

export interface ShippingData {
  fullName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface PaymentMethodData {
  cardToken: string;
}

/** Body of `POST /orders` (CreateOrderRequestDto). One order = one product. */
export interface CreateOrderRequest {
  productId: string;
  quantity?: number;
  customerEmail: string;
  shippingData: ShippingData;
  paymentMethodData: PaymentMethodData;
}

/** Response of `POST /orders` (OrderCreatedResponseDto). */
export interface OrderCreatedResponse {
  orderId: string;
  checkoutUrl: string | null;
  status: OrderStatus;
}

/** Response of `GET /orders/:id` (OrderResponseDto). */
export interface OrderResponse {
  id: string;
  productId: string;
  quantity: number;
  baseFeeInCents: number;
  deliveryFeeInCents: number;
  /** VAT rate frozen at order creation (integer percent). */
  taxRatePercent: number;
  /** VAT portion included in amountInCents. */
  taxInCents: number;
  amountInCents: number;
  currency: string;
  status: OrderStatus;
  customerEmail: string | null;
  providerTransactionId: string | null;
  shippingData: ShippingData | null;
  createdAt: string;
}
