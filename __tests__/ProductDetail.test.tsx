import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProductDetailScreen } from '@screens';
import productsReducer, { fetchProducts } from '@store/slices/productsSlice';
import cartReducer, { selectCartCount } from '@store/slices/cartSlice';
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
  name: 'Nero Crossbody',
  description: 'A study in restraint and architectural form.',
  priceInCents: 85000000,
  formattedPrice: '$ 850.000',
  imageUrl: 'https://cdn.example.com/p-1.jpg',
  stock: 3,
  currency: 'COP',
  taxRatePercent: 18,
  createdAt: '2026-07-01T00:00:00.000Z',
};

const makeStore = async () => {
  const store = configureStore({
    reducer: { products: productsReducer, cart: cartReducer },
  });
  mockedFetch.mockResolvedValueOnce([product]);
  await store.dispatch(fetchProducts());
  return store;
};

const renderDetail = async (
  store: Awaited<ReturnType<typeof makeStore>>,
  productId: string,
  navigation: { goBack?: jest.Mock } = {},
) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <Provider store={store}>
        <ProductDetailScreen
          route={{ params: { productId } } as never}
          navigation={navigation as never}
        />
      </Provider>,
    );
  });
  return tree;
};

const hasText = (
  tree: ReactTestRenderer.ReactTestRenderer,
  text: string,
): boolean =>
  tree.root.findAll(node => node.props?.children === text).length > 0;

describe('ProductDetailScreen', () => {
  afterEach(() => mockedFetch.mockReset());

  test('renders name, price, description and finish swatches', async () => {
    const tree = await renderDetail(await makeStore(), 'p-1');

    expect(hasText(tree, 'Nero Crossbody')).toBe(true);
    expect(hasText(tree, '$ 850.000')).toBe(true);
    expect(
      hasText(tree, 'A study in restraint and architectural form.'),
    ).toBe(true);
    expect(hasText(tree, 'Acabado')).toBe(true);
    expect(
      tree.root.findAllByProps({ accessibilityLabel: 'Acabado 1' })
        .length,
    ).toBeGreaterThan(0);

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('add to cart dispatches into the cart slice', async () => {
    const store = await makeStore();
    const tree = await renderDetail(store, 'p-1');

    const add = tree.root
      .findAll(node => node.props?.accessibilityRole === 'button')
      .find(
        node =>
          node.findAll(child => child.props?.children === 'Añadir al Carrito')
            .length > 0,
      );
    expect(add).toBeDefined();
    await ReactTestRenderer.act(() => add!.props.onPress());

    expect(selectCartCount(store.getState())).toBe(1);
    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('unknown product falls back gracefully with a back action', async () => {
    const goBack = jest.fn();
    const tree = await renderDetail(await makeStore(), 'missing', { goBack });

    expect(hasText(tree, 'Este producto ya no está disponible')).toBe(true);

    const back = tree.root
      .findAll(node => node.props?.accessibilityRole === 'button')
      .find(
        node =>
          node.findAll(child => child.props?.children === 'Volver al catálogo')
            .length > 0,
      );
    await ReactTestRenderer.act(() => back!.props.onPress());

    expect(goBack).toHaveBeenCalled();
    await ReactTestRenderer.act(() => tree.unmount());
  });
});
