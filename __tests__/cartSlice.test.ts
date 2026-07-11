import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addItem,
  clear,
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from '@store/slices/cartSlice';
import type { Product } from '@lib/services/products';

const product = (id: string, priceInCents: number): Product => ({
  id,
  name: `Product ${id}`,
  description: 'desc',
  priceInCents,
  formattedPrice: '$ 1.000',
  imageUrl: `https://cdn.example.com/${id}.jpg`,
  stock: 10,
  currency: 'COP',
  createdAt: '2026-07-01T00:00:00.000Z',
});

const makeStore = () => configureStore({ reducer: { cart: cartReducer } });

describe('cartSlice', () => {
  test('adds items and increments quantity for repeated products', () => {
    const store = makeStore();
    const dress = product('p-1', 100000);

    store.dispatch(addItem(dress));
    store.dispatch(addItem(dress));
    store.dispatch(addItem(product('p-2', 250000)));

    const state = store.getState();
    expect(selectCartItems(state)).toHaveLength(2);
    expect(selectCartItems(state)[0].quantity).toBe(2);
    expect(selectCartCount(state)).toBe(3);
  });

  test('removes one unit and drops the entry on the last one', () => {
    const store = makeStore();
    const dress = product('p-1', 100000);
    store.dispatch(addItem(dress));
    store.dispatch(addItem(dress));

    store.dispatch(removeItem('p-1'));
    expect(selectCartCount(store.getState())).toBe(1);

    store.dispatch(removeItem('p-1'));
    expect(selectCartItems(store.getState())).toHaveLength(0);

    // Removing a missing product is a no-op, not a crash.
    store.dispatch(removeItem('ghost'));
    expect(selectCartItems(store.getState())).toHaveLength(0);
  });

  test('computes the total in cents across quantities', () => {
    const store = makeStore();
    store.dispatch(addItem(product('p-1', 100000)));
    store.dispatch(addItem(product('p-1', 100000)));
    store.dispatch(addItem(product('p-2', 250000)));

    expect(selectCartTotal(store.getState())).toBe(450000);
  });

  test('clear empties the cart', () => {
    const store = makeStore();
    store.dispatch(addItem(product('p-1', 100000)));

    store.dispatch(clear());

    expect(selectCartItems(store.getState())).toEqual([]);
    expect(selectCartCount(store.getState())).toBe(0);
    expect(selectCartTotal(store.getState())).toBe(0);
  });
});
