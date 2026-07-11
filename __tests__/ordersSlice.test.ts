import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, {
  createOrder,
  pollOrderStatus,
  resetOrderFlow,
  selectOrderError,
  selectOrderFlowStatus,
  selectOrderId,
} from '@store/slices/ordersSlice';
import {
  ordersService,
  type CreateOrderRequest,
} from '@lib/services/orders';

jest.mock('@lib/services/orders', () => {
  const actual = jest.requireActual('@lib/services/orders');
  return {
    ...actual,
    ordersService: { createOrder: jest.fn(), getOrder: jest.fn() },
  };
});

const mockedCreate = ordersService.createOrder as jest.Mock;
const mockedGet = ordersService.getOrder as jest.Mock;

const request = {
  productId: 'p-1',
  customerEmail: 'cliente@correo.com',
  shippingData: {
    fullName: 'Ana Pérez',
    email: 'cliente@correo.com',
    address1: 'Calle 1 # 2-3',
    city: 'Bogotá',
    state: 'Cundinamarca',
    zip: '110111',
  },
  paymentMethodData: { cardToken: 'tok_test_123' },
} satisfies CreateOrderRequest;

const makeStore = () => configureStore({ reducer: { orders: ordersReducer } });

describe('ordersSlice', () => {
  afterEach(() => {
    mockedCreate.mockReset();
    mockedGet.mockReset();
  });

  test('createOrder lands on pending with the order id', async () => {
    mockedCreate.mockResolvedValueOnce({
      orderId: 'o-1',
      checkoutUrl: null,
      status: 'PENDING',
    });
    const store = makeStore();

    await store.dispatch(createOrder(request));

    expect(selectOrderFlowStatus(store.getState())).toBe('pending');
    expect(selectOrderId(store.getState())).toBe('o-1');
  });

  test('createOrder failure lands on error with a message', async () => {
    mockedCreate.mockRejectedValueOnce(new Error('Network request failed'));
    const store = makeStore();

    await store.dispatch(createOrder(request));

    expect(selectOrderFlowStatus(store.getState())).toBe('error');
    expect(selectOrderError(store.getState())).toBe('Network request failed');
  });

  test('polling resolves to approved after pending responses', async () => {
    mockedGet
      .mockResolvedValueOnce({ id: 'o-1', status: 'PENDING' })
      .mockResolvedValueOnce({ id: 'o-1', status: 'PENDING' })
      .mockResolvedValueOnce({ id: 'o-1', status: 'APPROVED' });
    const store = makeStore();

    await store.dispatch(
      pollOrderStatus({ orderId: 'o-1', intervalMs: 0 }),
    );

    expect(mockedGet).toHaveBeenCalledTimes(3);
    expect(selectOrderFlowStatus(store.getState())).toBe('approved');
  });

  test('polling resolves to declined', async () => {
    mockedGet.mockResolvedValueOnce({ id: 'o-1', status: 'DECLINED' });
    const store = makeStore();

    await store.dispatch(pollOrderStatus({ orderId: 'o-1', intervalMs: 0 }));

    expect(selectOrderFlowStatus(store.getState())).toBe('declined');
  });

  test('polling times out into error after maxAttempts', async () => {
    mockedGet.mockResolvedValue({ id: 'o-1', status: 'PENDING' });
    const store = makeStore();

    await store.dispatch(
      pollOrderStatus({ orderId: 'o-1', intervalMs: 0, maxAttempts: 3 }),
    );

    expect(mockedGet).toHaveBeenCalledTimes(3);
    expect(selectOrderFlowStatus(store.getState())).toBe('error');
    expect(selectOrderError(store.getState())).toContain('pendiente');
  });

  test('resetOrderFlow returns to idle', async () => {
    mockedCreate.mockResolvedValueOnce({
      orderId: 'o-1',
      checkoutUrl: null,
      status: 'PENDING',
    });
    const store = makeStore();
    await store.dispatch(createOrder(request));

    store.dispatch(resetOrderFlow());

    expect(selectOrderFlowStatus(store.getState())).toBe('idle');
    expect(selectOrderId(store.getState())).toBeNull();
  });
});
