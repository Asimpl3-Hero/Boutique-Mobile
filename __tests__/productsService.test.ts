import { apiClient, NetworkError } from '@lib/services/api';
import {
  mapApiProduct,
  productsService,
  type ApiProduct,
} from '@lib/services/products';

jest.mock('@lib/services/api', () => {
  const actual = jest.requireActual('@lib/services/api');
  return {
    ...actual,
    apiClient: { ...actual.apiClient, get: jest.fn() },
  };
});

const mockedGet = apiClient.get as jest.Mock;

const apiProduct: ApiProduct = {
  id: 'p-1',
  name: 'Summer Dress',
  description: 'A light summer dress',
  priceInCents: 1680000,
  imageUrl: 'https://cdn.example.com/p-1.jpg',
  stock: 5,
  currency: 'COP',
  createdAt: '2026-07-01T00:00:00.000Z',
};

describe('productsService.fetchProducts', () => {
  afterEach(() => {
    mockedGet.mockReset();
  });

  test('fetches /products and maps the payload to UI products', async () => {
    mockedGet.mockResolvedValueOnce([apiProduct]);

    const products = await productsService.fetchProducts();

    expect(mockedGet).toHaveBeenCalledWith('/products');
    expect(products).toHaveLength(1);
    expect(products[0]).toEqual(mapApiProduct(apiProduct));
    expect(products[0].formattedPrice).toContain('16.800');
  });

  test('propagates typed errors from the base client', async () => {
    mockedGet.mockRejectedValueOnce(new NetworkError('timeout'));

    await expect(productsService.fetchProducts()).rejects.toBeInstanceOf(
      NetworkError,
    );
  });
});
