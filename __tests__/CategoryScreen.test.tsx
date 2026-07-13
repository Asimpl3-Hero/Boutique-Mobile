import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CategoryScreen } from '@screens';
import { ProductCard } from '@components/features';
import cartReducer from '@store/slices/cartSlice';
import productsReducer, { fetchProducts } from '@store/slices/productsSlice';
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
  name: 'Conjunto Scarlet Club',
  description: 'Vintage con corte de calle.',
  priceInCents: 14990000,
  formattedPrice: '$ 149.900',
  imageUrl: 'https://cdn.example.com/p-1.jpg',
  stock: 5,
  currency: 'COP',
  taxRatePercent: 18,
  createdAt: '2026-07-01T00:00:00.000Z',
};

const makeStore = async (products: Product[]) => {
  const store = configureStore({
    reducer: { products: productsReducer, cart: cartReducer },
  });
  mockedFetch.mockResolvedValueOnce(products);
  await store.dispatch(fetchProducts());
  return store;
};

const renderCategory = async (
  store: Awaited<ReturnType<typeof makeStore>>,
  params: Record<string, unknown>,
  navigation: { navigate?: jest.Mock; goBack?: jest.Mock } = {},
) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <Provider store={store}>
        <CategoryScreen
          route={{ params } as never}
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

describe('CategoryScreen', () => {
  afterEach(() => mockedFetch.mockReset());

  test('renders the themed banner and the product grid', async () => {
    const navigate = jest.fn();
    const tree = await renderCategory(
      await makeStore([product]),
      {
        title: 'Camisetas',
        image: { uri: 'https://cdn.example.com/banner.jpg' },
        backgroundColor: '#112244',
        underlineColor: '#FF3366',
      },
      { navigate },
    );

    expect(hasText(tree, 'Camisetas')).toBe(true);
    expect(hasText(tree, 'Conjunto Scarlet Club')).toBe(true);

    // Tapping a card opens its product detail.
    const card = tree.root.findAllByType(ProductCard)[0];
    await ReactTestRenderer.act(async () => {
      card.props.onPress();
    });
    expect(navigate).toHaveBeenCalledWith('ProductDetail', {
      productId: 'p-1',
    });

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('back action and empty catalog fallback', async () => {
    const goBack = jest.fn();
    const tree = await renderCategory(
      await makeStore([]),
      { title: 'Novedades' },
      { goBack },
    );

    expect(hasText(tree, 'Aún no hay productos disponibles.')).toBe(true);

    const back = tree.root.findByProps({ accessibilityLabel: 'Volver' });
    await ReactTestRenderer.act(async () => {
      back.props.onPress();
    });
    expect(goBack).toHaveBeenCalled();

    await ReactTestRenderer.act(() => tree.unmount());
  });
});
