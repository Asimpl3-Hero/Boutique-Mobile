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
  test('renders the campaign texts and fires the action', async () => {
    const onActionPress = jest.fn();
    const tree = await render(<HeroBanner onActionPress={onActionPress} />);

    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Limited Edition');
    expect(json).toContain('Summer Collection');
    expect(json).toContain('Shop the Look');

    const button = tree.root.findByProps({ accessibilityRole: 'button' });
    await ReactTestRenderer.act(() => button.props.onPress());
    expect(onActionPress).toHaveBeenCalledTimes(1);
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

  test('add-to-cart dispatches addItem to the cart slice', async () => {
    const store = makeStore();
    const tree = await render(
      <Provider store={store}>
        <ProductCard product={product} />
      </Provider>,
    );

    const addButton = tree.root.findByProps({
      accessibilityLabel: 'Add Summer Dress to cart',
    });
    await ReactTestRenderer.act(() => addButton.props.onPress());
    await ReactTestRenderer.act(() => addButton.props.onPress());

    expect(selectCartCount(store.getState())).toBe(2);
    expect(selectCartItems(store.getState())[0].product.id).toBe('p-1');
  });

  test('wishlist heart toggles its selected state', async () => {
    const tree = await render(
      <Provider store={makeStore()}>
        <ProductCard product={product} />
      </Provider>,
    );

    const heart = tree.root.findByProps({
      accessibilityLabel: 'Add Summer Dress to wishlist',
    });
    expect(heart.props.accessibilityState).toEqual({});

    await ReactTestRenderer.act(() => heart.props.onPress());
    expect(
      tree.root.findByProps({
        accessibilityLabel: 'Add Summer Dress to wishlist',
      }).props.accessibilityState,
    ).toEqual({ selected: true });
  });
});
