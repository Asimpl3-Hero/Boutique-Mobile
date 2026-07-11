import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CartFab } from '@components/features';
import cartReducer, { addItem } from '@store/slices/cartSlice';
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

const makeStore = () => configureStore({ reducer: { cart: cartReducer } });

const renderFab = async (
  store: ReturnType<typeof makeStore>,
  onPress?: jest.Mock,
) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <Provider store={store}>
        <CartFab onPress={onPress} />
      </Provider>,
    );
  });
  return tree;
};

describe('CartFab', () => {
  test('hides the badge when the cart is empty', async () => {
    const tree = await renderFab(makeStore());

    expect(
      tree.root.findAll(node => node.props?.children === '0').length,
    ).toBe(0);
    expect(
      tree.root.findAllByProps({ accessibilityLabel: 'Carrito, 0 artículos' })
        .length,
    ).toBeGreaterThan(0);
    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('badge reflects the cart count from the store', async () => {
    const store = makeStore();
    store.dispatch(addItem(product));
    store.dispatch(addItem(product));
    store.dispatch(addItem(product));

    const tree = await renderFab(store);

    expect(
      tree.root.findAll(node => node.props?.children === 3).length,
    ).toBeGreaterThan(0);
    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('fires onPress', async () => {
    const onPress = jest.fn();
    const tree = await renderFab(makeStore(), onPress);

    const fab = tree.root
      .findAll(node => node.props?.accessibilityRole === 'button')
      .find(node => typeof node.props.onPress === 'function');
    await ReactTestRenderer.act(() => fab!.props.onPress());

    expect(onPress).toHaveBeenCalledTimes(1);
    await ReactTestRenderer.act(() => tree.unmount());
  });
});
