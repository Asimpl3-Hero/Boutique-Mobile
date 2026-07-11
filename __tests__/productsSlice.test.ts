import { configureStore } from '@reduxjs/toolkit';
import productsReducer, {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '@store/slices/productsSlice';
import { productsService, type Product } from '@lib/services/products';

jest.mock('@lib/services/products', () => {
  const actual = jest.requireActual('@lib/services/products');
  return {
    ...actual,
    productsService: { fetchProducts: jest.fn() },
  };
});

const mockedFetch = productsService.fetchProducts as jest.Mock;

const product: Product = {
  id: 'p-1',
  name: 'Summer Dress',
  description: 'A light summer dress',
  priceInCents: 1680000,
  formattedPrice: '$ 16.800',
  imageUrl: 'https://cdn.example.com/p-1.jpg',
  stock: 5,
  currency: 'COP',
  taxRatePercent: 18,
  createdAt: '2026-07-01T00:00:00.000Z',
};

const makeStore = () =>
  configureStore({ reducer: { products: productsReducer } });

describe('productsSlice', () => {
  afterEach(() => mockedFetch.mockReset());

  test('starts idle and empty', () => {
    const state = makeStore().getState();
    expect(selectProducts(state)).toEqual([]);
    expect(selectProductsStatus(state)).toBe('idle');
    expect(selectProductsError(state)).toBeNull();
  });

  test('sets loading while the thunk is pending', () => {
    mockedFetch.mockReturnValueOnce(new Promise(() => {}));
    const store = makeStore();

    store.dispatch(fetchProducts());

    expect(selectProductsStatus(store.getState())).toBe('loading');
  });

  test('stores items on fulfilled', async () => {
    mockedFetch.mockResolvedValueOnce([product]);
    const store = makeStore();

    await store.dispatch(fetchProducts());

    const state = store.getState();
    expect(selectProductsStatus(state)).toBe('succeeded');
    expect(selectProducts(state)).toEqual([product]);
    expect(selectProductsError(state)).toBeNull();
  });

  test('stores the error message on rejected', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('network down'));
    const store = makeStore();

    await store.dispatch(fetchProducts());

    const state = store.getState();
    expect(selectProductsStatus(state)).toBe('failed');
    expect(selectProductsError(state)).toBe('network down');
    expect(selectProducts(state)).toEqual([]);
  });
});
