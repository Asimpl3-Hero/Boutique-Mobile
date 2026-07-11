import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { HeroBanner, ProductCard } from '@components/features';
import cartReducer, { selectCartCount, selectCartItems } from '@store/slices/cartSlice';
import type { Product } from '@lib/services/products';

const product: Product = {
  id: 'p-1',
  name: 'Summer Dress',
  description: 'A light summer dress',
  priceInCents: 1680000,
  formattedPrice: '$ 16.800',
  imageUrl: 'https://cdn.example.com/p-1.jpg',
  stock: 5,
  currency: 'COP',
  createdAt: '2026-07-01T00:00:00.000Z',
};

const render = async (element: React.ReactElement) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(element);
  });
  return tree;
};

describe('HeroBanner', () => {
  test('renders the campaign copy without a CTA', async () => {
    const tree = await render(<HeroBanner />);

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Edición Limitada');
    expect(json).toContain('Colección de Verano');
    expect(json).not.toContain('Comprar el Look');
  });
});

describe('ProductCard', () => {
  const makeStore = () => configureStore({ reducer: { cart: cartReducer } });

  test('shows name, price and image', async () => {
    const tree = await render(
      <Provider store={makeStore()}>
        <ProductCard product={product} />
      </Provider>,
    );

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Summer Dress');
    expect(json).toContain('16.800');

    const image = tree.root.findByProps({ accessibilityLabel: 'Summer Dress' });
    expect(image.props.source).toEqual({ uri: product.imageUrl });
  });

  test('add-to-cart dispatches once, locks with success feedback for 3s', async () => {
    jest.useFakeTimers();
    const store = makeStore();
    const tree = await render(
      <Provider store={store}>
        <ProductCard product={product} />
      </Provider>,
    );

    const addButton = tree.root.findByProps({
      accessibilityLabel: 'Agregar Summer Dress al carrito',
    });
    await ReactTestRenderer.act(() => addButton.props.onPress());

    expect(selectCartCount(store.getState())).toBe(1);
    expect(selectCartItems(store.getState())[0].product.id).toBe('p-1');

    // While locked: success state shown, presses are ignored.
    const locked = tree.root.findByProps({
      accessibilityLabel: 'Summer Dress agregado al carrito',
    });
    expect(locked.props.accessibilityState).toEqual({ disabled: true });
    await ReactTestRenderer.act(() => locked.props.onPress());
    expect(selectCartCount(store.getState())).toBe(1);

    // After the feedback window it accepts presses again.
    await ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(3000);
    });
    const unlocked = tree.root.findByProps({
      accessibilityLabel: 'Agregar Summer Dress al carrito',
    });
    await ReactTestRenderer.act(() => unlocked.props.onPress());
    expect(selectCartCount(store.getState())).toBe(2);

    jest.useRealTimers();
  });

});
