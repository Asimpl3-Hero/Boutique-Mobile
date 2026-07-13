import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CheckoutScreen, validateShippingStep } from '@screens';
import { Button, TextInputField } from '@components/ui';
import cartReducer, { addItem, selectCartItems } from '@store/slices/cartSlice';
import ordersReducer from '@store/slices/ordersSlice';
import productsReducer from '@store/slices/productsSlice';
import { ordersService } from '@lib/services/orders';
import { paymentsService } from '@lib/services/payments';
import { productsService } from '@lib/services/products';
import type { Product } from '@lib/services/products';

jest.mock('@lib/services/orders', () => {
  const actual = jest.requireActual('@lib/services/orders');
  return {
    ...actual,
    ordersService: { createOrder: jest.fn(), getOrder: jest.fn() },
  };
});

jest.mock('@lib/services/payments', () => {
  const actual = jest.requireActual('@lib/services/payments');
  return {
    ...actual,
    paymentsService: { tokenizeCard: jest.fn() },
  };
});

jest.mock('@lib/services/products', () => {
  const actual = jest.requireActual('@lib/services/products');
  return {
    ...actual,
    productsService: { fetchProducts: jest.fn() },
  };
});

const mockedCreateOrder = ordersService.createOrder as jest.Mock;
const mockedGetOrder = ordersService.getOrder as jest.Mock;
const mockedTokenize = paymentsService.tokenizeCard as jest.Mock;
const mockedFetchProducts = productsService.fetchProducts as jest.Mock;

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

const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      orders: ordersReducer,
      products: productsReducer,
    },
  });

type Store = ReturnType<typeof makeStore>;

const renderCheckout = async (
  store: Store,
  navigation: { goBack?: jest.Mock; popTo?: jest.Mock } = {},
) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <Provider store={store}>
        <CheckoutScreen
          route={{ params: undefined } as never}
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

const findButton = (
  tree: ReactTestRenderer.ReactTestRenderer,
  label: string,
) => {
  const button = tree.root
    .findAllByType(Button)
    .find(node => node.props.label === label);
  expect(button).toBeDefined();
  return button!;
};

const press = async (
  tree: ReactTestRenderer.ReactTestRenderer,
  label: string,
) => {
  const button = findButton(tree, label);
  await ReactTestRenderer.act(async () => {
    button.props.onPress();
  });
};

const pressA11y = async (
  tree: ReactTestRenderer.ReactTestRenderer,
  accessibilityLabel: string,
) => {
  const target = tree.root.findByProps({ accessibilityLabel });
  await ReactTestRenderer.act(async () => {
    target.props.onPress();
  });
};

/** Drives the flow from the bag to the summary with a tokenized card. */
const walkToSummary = async (tree: ReactTestRenderer.ReactTestRenderer) => {
  await press(tree, 'Continuar');
  await press(tree, 'Autorellenar datos de prueba');
  await press(tree, 'Continuar');
  await press(tree, 'Agregar una tarjeta');
  await press(tree, 'Tarjeta aprobada');
  mockedTokenize.mockResolvedValueOnce({
    cardToken: 'tok_visa_1',
    lastFour: '4242',
  });
  await press(tree, 'Guardar tarjeta');
  await press(tree, 'Continuar');
  expect(hasText(tree, 'Resumen')).toBe(true);
};

describe('CheckoutScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedFetchProducts.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
    mockedCreateOrder.mockReset();
    mockedGetOrder.mockReset();
    mockedTokenize.mockReset();
    mockedFetchProducts.mockReset();
  });

  test('validateShippingStep flags every required field', () => {
    const errors = validateShippingStep('not-an-email', {
      fullName: '',
      email: '',
      phone: 'abc',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'address1',
      'city',
      'customerEmail',
      'email',
      'fullName',
      'phone',
      'state',
      'zip',
    ]);
  });

  test('bag step edits quantities and blocks an empty cart', async () => {
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderCheckout(store);

    expect(hasText(tree, 'Tu bolsa')).toBe(true);

    await pressA11y(tree, `Agregar uno de ${product.name}`);
    expect(selectCartItems(store.getState())[0].quantity).toBe(2);

    await pressA11y(tree, `Quitar uno de ${product.name}`);
    expect(selectCartItems(store.getState())[0].quantity).toBe(1);

    // Decreasing at quantity 1 removes the line entirely.
    await pressA11y(tree, `Quitar uno de ${product.name}`);
    expect(selectCartItems(store.getState())).toHaveLength(0);
    expect(
      hasText(tree, 'Tu carrito está vacío — agrega productos para continuar.'),
    ).toBe(true);
    expect(findButton(tree, 'Continuar').props.disabled).toBe(true);

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('remove link deletes the line from the bag', async () => {
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderCheckout(store);

    await pressA11y(tree, `Eliminar ${product.name}`);
    expect(selectCartItems(store.getState())).toHaveLength(0);

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('back button leaves the flow on step 0 and steps back after', async () => {
    const goBack = jest.fn();
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderCheckout(store, { goBack });

    await press(tree, 'Continuar');
    expect(hasText(tree, 'Envío')).toBe(true);
    await press(tree, 'Atrás');
    expect(hasText(tree, 'Tu bolsa')).toBe(true);
    await press(tree, 'Atrás');
    expect(goBack).toHaveBeenCalled();

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('shipping validation keeps the user on the step until valid', async () => {
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderCheckout(store);

    await press(tree, 'Continuar');
    // Empty form: validation errors keep the flow on the shipping step.
    await press(tree, 'Continuar');
    expect(hasText(tree, 'Envío')).toBe(true);

    // Manual edits flow through the change handlers.
    const email = tree.root
      .findAllByType(TextInputField)
      .find(node => node.props.label === 'Email del cliente');
    const fullName = tree.root
      .findAllByType(TextInputField)
      .find(node => node.props.label === 'Nombre completo');
    await ReactTestRenderer.act(async () => {
      email!.props.onChangeText('cliente@correo.com');
      fullName!.props.onChangeText('Ana Pérez');
    });

    await press(tree, 'Autorellenar datos de prueba');
    await press(tree, 'Continuar');
    expect(hasText(tree, 'Pago con tarjeta')).toBe(true);

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('card step validates, tokenizes and lists the saved card', async () => {
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderCheckout(store);

    await press(tree, 'Continuar');
    await press(tree, 'Autorellenar datos de prueba');
    await press(tree, 'Continuar');

    // Continue is blocked until a card exists.
    expect(findButton(tree, 'Continuar').props.disabled).toBe(true);

    await press(tree, 'Agregar una tarjeta');
    // Empty form: field validation stops the save.
    await press(tree, 'Guardar tarjeta');
    expect(mockedTokenize).not.toHaveBeenCalled();

    // Tokenization failure surfaces the provider error.
    await press(tree, 'Tarjeta rechazada');
    mockedTokenize.mockRejectedValueOnce(new Error('Proveedor caído'));
    await press(tree, 'Guardar tarjeta');
    expect(hasText(tree, 'Proveedor caído')).toBe(true);

    // Closing the sheet resets the form; reopen and save the test card.
    await pressA11y(tree, 'Cerrar formulario de tarjeta');
    await press(tree, 'Agregar una tarjeta');
    await press(tree, 'Tarjeta aprobada');
    mockedTokenize.mockResolvedValueOnce({
      cardToken: 'tok_visa_1',
      lastFour: '4242',
    });
    await press(tree, 'Guardar tarjeta');

    expect(hasText(tree, '•••• 4242')).toBe(true);
    await pressA11y(tree, 'Tarjeta terminada en 4242');
    expect(findButton(tree, 'Continuar').props.disabled).toBe(false);

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('approved payment clears the cart and lands on the invoice', async () => {
    const popTo = jest.fn();
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderCheckout(store, { popTo });

    await walkToSummary(tree);

    mockedCreateOrder.mockResolvedValueOnce({
      orderId: 'ord-1',
      status: 'APPROVED',
    });
    mockedGetOrder.mockResolvedValueOnce({
      id: 'ord-1',
      status: 'APPROVED',
      amountInCents: 11800000,
      taxInCents: 1800000,
      taxRatePercent: 18,
    });

    await press(tree, 'Pagar');

    expect(hasText(tree, '¡Compra realizada!')).toBe(true);
    expect(selectCartItems(store.getState())).toHaveLength(0);
    expect(mockedFetchProducts).toHaveBeenCalled();

    // Success auto-fires onDone and navigates to the fresh invoice.
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(2600);
    });
    expect(popTo).toHaveBeenCalledWith(
      'Main',
      expect.objectContaining({ screen: 'Invoices' }),
    );

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('declined payment keeps the cart and goes back on close', async () => {
    const goBack = jest.fn();
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderCheckout(store, { goBack });

    await walkToSummary(tree);

    mockedCreateOrder.mockResolvedValueOnce({
      orderId: 'ord-2',
      status: 'DECLINED',
    });
    mockedGetOrder.mockResolvedValueOnce({
      id: 'ord-2',
      status: 'DECLINED',
      amountInCents: 11800000,
      taxInCents: 1800000,
      taxRatePercent: 18,
    });

    await press(tree, 'Pagar');

    expect(hasText(tree, 'Pago rechazado')).toBe(true);
    expect(selectCartItems(store.getState())).toHaveLength(1);

    await press(tree, 'Volver al inicio');
    expect(goBack).toHaveBeenCalled();

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('order failure shows the error state with a retry', async () => {
    const store = makeStore();
    store.dispatch(addItem(product));
    const tree = await renderCheckout(store);

    await walkToSummary(tree);

    mockedCreateOrder.mockRejectedValueOnce(new Error('Backend caído'));
    await press(tree, 'Pagar');

    expect(hasText(tree, 'Algo salió mal')).toBe(true);

    // Retry re-runs the payment; this time it approves.
    mockedCreateOrder.mockResolvedValueOnce({
      orderId: 'ord-3',
      status: 'APPROVED',
    });
    mockedGetOrder.mockResolvedValueOnce({
      id: 'ord-3',
      status: 'APPROVED',
      amountInCents: 11800000,
      taxInCents: 1800000,
      taxRatePercent: 18,
    });
    await press(tree, 'Reintentar');
    expect(hasText(tree, '¡Compra realizada!')).toBe(true);

    await ReactTestRenderer.act(() => tree.unmount());
  });
});
