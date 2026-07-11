import { buildOrderRequests } from '@lib/services/orders';
import type { CartItem } from '@store';
import type { Product } from '@lib/services/products';

const product = (id: string, priceInCents: number): Product => ({
  id,
  name: `Producto ${id}`,
  description: '',
  priceInCents,
  formattedPrice: '$ 0',
  imageUrl: `https://cdn.example.com/${id}.jpg`,
  stock: 10,
  currency: 'COP',
  taxRatePercent: 18,
  createdAt: '2026-07-01T00:00:00.000Z',
});

const items: CartItem[] = [
  { product: product('p-1', 10000), quantity: 2 },
  { product: product('p-2', 5000), quantity: 1 },
];

describe('buildOrderRequests', () => {
  test('emits one CreateOrderRequest per cart line, mirroring the DTO', () => {
    const requests = buildOrderRequests(
      items,
      ' cliente@correo.com ',
      {
        fullName: ' Ana Pérez ',
        email: 'ana@correo.com',
        phone: '',
        address1: 'Calle 1 # 2-3',
        address2: '',
        city: 'Bogotá',
        state: 'Cundinamarca',
        zip: '110111',
        country: '',
      },
      'tok_test_123',
    );

    expect(requests).toHaveLength(2);
    expect(requests[0]).toEqual({
      productId: 'p-1',
      quantity: 2,
      customerEmail: 'cliente@correo.com',
      shippingData: {
        fullName: 'Ana Pérez',
        email: 'ana@correo.com',
        address1: 'Calle 1 # 2-3',
        city: 'Bogotá',
        state: 'Cundinamarca',
        zip: '110111',
      },
      paymentMethodData: { cardToken: 'tok_test_123' },
    });
    // Optional blanks are omitted, never sent as empty strings.
    expect(requests[0].shippingData).not.toHaveProperty('phone');
    expect(requests[0].shippingData).not.toHaveProperty('address2');
    expect(requests[0].shippingData).not.toHaveProperty('country');
    expect(requests[1].productId).toBe('p-2');
    expect(requests[1].quantity).toBe(1);
  });

  test('keeps optional fields when provided', () => {
    const [request] = buildOrderRequests(
      [items[0]],
      'cliente@correo.com',
      {
        fullName: 'Ana Pérez',
        email: 'ana@correo.com',
        phone: '3001234567',
        address1: 'Calle 1 # 2-3',
        address2: 'Apto 501',
        city: 'Bogotá',
        state: 'Cundinamarca',
        zip: '110111',
        country: 'CO',
      },
      'tok_test_123',
    );

    expect(request.shippingData.phone).toBe('3001234567');
    expect(request.shippingData.address2).toBe('Apto 501');
    expect(request.shippingData.country).toBe('CO');
  });
});
