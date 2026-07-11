import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { HomeScreen } from '@screens';
import productsReducer from '@store/slices/productsSlice';
import cartReducer from '@store/slices/cartSlice';
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
  configureStore({
    reducer: { products: productsReducer, cart: cartReducer },
  });

const renderHome = async (store: ReturnType<typeof makeStore>) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );
  });
  return tree;
};

const flush = () =>
  ReactTestRenderer.act(async () => {
    await Promise.resolve();
  });

const hasText = (
  tree: ReactTestRenderer.ReactTestRenderer,
  text: string,
): boolean =>
  tree.root.findAll(node => node.props?.children === text).length > 0;

describe('HomeScreen', () => {
  afterEach(() => mockedFetch.mockReset());

  test('dispatches the catalog fetch and shows skeletons while loading', async () => {
    mockedFetch.mockReturnValueOnce(new Promise(() => {}));
    const tree = await renderHome(makeStore());

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(
      tree.root.findAllByProps({ accessibilityLabel: 'Loading products' })
        .length,
    ).toBeGreaterThan(0);
    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('renders the grid with products from the store', async () => {
    mockedFetch.mockResolvedValueOnce([product]);
    const tree = await renderHome(makeStore());
    await flush();

    // Category mosaic plus the product carousel under the hero.
    expect(hasText(tree, 'Novedades')).toBe(true);
    expect(hasText(tree, 'Más Vendidos')).toBe(true);
    expect(hasText(tree, 'Camisetas')).toBe(true);
    expect(hasText(tree, 'Total Looks')).toBe(true);
    // Carousel tiles are image-only: the add-to-cart overlay is present,
    // but no name/price text is rendered.
    expect(
      tree.root.findAllByProps({
        accessibilityLabel: 'Agregar Summer Dress al carrito',
      }).length,
    ).toBeGreaterThan(0);
    expect(hasText(tree, '$ 16.800')).toBe(false);
    expect(hasText(tree, 'Categorías')).toBe(true);
    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('shows the error state and retries on demand', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('network down'));
    const tree = await renderHome(makeStore());
    await flush();

    expect(hasText(tree, 'No pudimos cargar el catálogo')).toBe(true);
    expect(hasText(tree, 'network down')).toBe(true);

    mockedFetch.mockResolvedValueOnce([product]);
    const retry = tree.root
      .findAll(node => node.props?.accessibilityRole === 'button')
      .find(
        node =>
          node.findAll(child => child.props?.children === 'Reintentar').length >
          0,
      );
    expect(retry).toBeDefined();
    await ReactTestRenderer.act(() => retry!.props.onPress());
    await flush();

    expect(mockedFetch).toHaveBeenCalledTimes(2);
    expect(hasText(tree, 'Novedades')).toBe(true);
    await ReactTestRenderer.act(() => tree.unmount());
  });
});
