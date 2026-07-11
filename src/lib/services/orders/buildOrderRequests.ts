import type { CartItem } from '@store/slices/cartSlice';
import type { CreateOrderRequest, ShippingData } from './types';

/**
 * Maps the cart to `POST /orders` payloads. The backend accepts a single
 * product per order, so a cart with N distinct products becomes N requests
 * (documented mapping — see mobile-05 audit notes). Optional shipping
 * fields are omitted (not sent as empty strings) to match the DTO.
 */
export const buildOrderRequests = (
  items: CartItem[],
  customerEmail: string,
  shipping: ShippingData,
  cardToken: string,
): CreateOrderRequest[] => {
  const shippingData: ShippingData = {
    fullName: shipping.fullName.trim(),
    email: shipping.email.trim(),
    address1: shipping.address1.trim(),
    city: shipping.city.trim(),
    state: shipping.state.trim(),
    zip: shipping.zip.trim(),
    ...(shipping.phone?.trim() ? { phone: shipping.phone.trim() } : {}),
    ...(shipping.address2?.trim()
      ? { address2: shipping.address2.trim() }
      : {}),
    ...(shipping.country?.trim() ? { country: shipping.country.trim() } : {}),
  };

  return items.map(item => ({
    productId: item.product.id,
    quantity: item.quantity,
    customerEmail: customerEmail.trim(),
    shippingData,
    paymentMethodData: { cardToken },
  }));
};
