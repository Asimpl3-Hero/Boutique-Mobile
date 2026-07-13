import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CartModal } from '@components/features';
import { Button } from '@components/ui';
import cartReducer, {
  addItem,
  selectCartItems,
} from '@store/slices/cartSlice';
import type { Product } from '@lib/services/products';

const product: Product = {
  id: 'p-1',
  name: 'Conjunto Royal',
  description: 'Camiseta azul royal.',
  priceInCents: 10000000,
  formattedPrice: '$ 100.000',
  imageUrl: 'https://cdn.example.com/p-1.jpg',
  stock: 2,
  currency: 'COP',
  taxRatePercent: 18,
  createdAt: '2026-07-01T00:00:00.000Z',
};

const makeStore = () => configureStore({ reducer: { cart: cartReducer } });

const renderModal = async (
  store: ReturnType<typeof makeStore>,
  props: { onClose?: jest.Mock; onCheckout?: jest.Mock } = {},
) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <Provider store={store}>
        <CartModal
          visible
          onClose={props.onClose ?? jest.fn()}
          onCheckout={props.onCheckout}
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

const pressButton = async (
  tree: ReactTestRenderer.ReactTestRenderer,
  label: string,
) => {
  const button = tree.root
    .findAllByType(Button)
    .find(node => node.props.label === label);
  expect(button).toBeDefined();
  await ReactTestRenderer.act(async () => {
    button!.props.onPress();
  });
};

describe('CartModal', () => {
  test('shows the empty state without items', async () => {
    const tree = await renderModal(makeStore());
    expect(hasText(tree, 'Tu carrito está vacío')).toBe(true);
    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('edits quantities and clears the cart', async () => {
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderModal(store);

    expect(hasText(tree, 'Conjunto Royal')).toBe(true);

    const plus = tree.root.findByProps({
      accessibilityLabel: `Agregar uno de ${product.name}`,
    });
    await ReactTestRenderer.act(async () => {
      plus.props.onPress();
    });
    expect(selectCartItems(store.getState())[0].quantity).toBe(2);

    const minus = tree.root.findByProps({
      accessibilityLabel: `Quitar uno de ${product.name}`,
    });
    await ReactTestRenderer.act(async () => {
      minus.props.onPress();
    });
    expect(selectCartItems(store.getState())[0].quantity).toBe(1);

    // Decreasing at quantity 1 removes the whole line.
    await ReactTestRenderer.act(async () => {
      minus.props.onPress();
    });
    expect(selectCartItems(store.getState())).toHaveLength(0);

    await ReactTestRenderer.act(async () => {
      store.dispatch(addItem(product));
    });
    await pressButton(tree, 'Limpiar carrito');
    expect(selectCartItems(store.getState())).toHaveLength(0);

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('checkout closes the modal first, then fires the callback', async () => {
    const onClose = jest.fn();
    const onCheckout = jest.fn();
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderModal(store, { onClose, onCheckout });

    await pressButton(tree, 'Finalizar compra');
    expect(onClose).toHaveBeenCalled();
    expect(onCheckout).toHaveBeenCalled();

    // The scrim also closes the sheet.
    const scrim = tree.root.findByProps({
      accessibilityLabel: 'Cerrar carrito',
    });
    await ReactTestRenderer.act(async () => {
      scrim.props.onPress();
    });
    expect(onClose).toHaveBeenCalledTimes(2);

    await ReactTestRenderer.act(() => tree.unmount());
  });
});
