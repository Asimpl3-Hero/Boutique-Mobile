import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, {
  createOrder,
  pollOrderStatus,
  resetOrderFlow,
  selectOrderError,
  selectOrderFlowStatus,
  selectOrderId,
  submitOrders,
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

  test('submitOrders approves when every order approves', async () => {
    mockedCreate
      .mockResolvedValueOnce({ orderId: 'o-1', checkoutUrl: null, status: 'PENDING' })
      .mockResolvedValueOnce({ orderId: 'o-2', checkoutUrl: null, status: 'APPROVED' });
    mockedGet
      .mockResolvedValueOnce({
        id: 'o-1',
        status: 'APPROVED',
        taxRatePercent: 18,
        taxInCents: 1800,
        amountInCents: 11800,
      })
      // o-2 is terminal at creation: fetched once for its breakdown.
      .mockResolvedValueOnce({
        id: 'o-2',
        status: 'APPROVED',
        taxRatePercent: 18,
        taxInCents: 1500,
        amountInCents: 9800,
      });
    const store = makeStore();

    const result = await store
      .dispatch(
        submitOrders({ requests: [request, request], intervalMs: 0 }),
      )
      .unwrap();

    expect(result).toEqual({
      finalStatus: 'APPROVED',
      orderIds: ['o-1', 'o-2'],
      amountInCents: 21600,
      taxRatePercent: 18,
      taxInCents: 3300,
    });
    expect(mockedCreate).toHaveBeenCalledTimes(2);
    expect(selectOrderFlowStatus(store.getState())).toBe('approved');
  });

  test('submitOrders stops on the first decline', async () => {
    mockedCreate.mockResolvedValueOnce({
      orderId: 'o-1',
      checkoutUrl: null,
      status: 'PENDING',
    });
    mockedGet.mockResolvedValueOnce({ id: 'o-1', status: 'DECLINED' });
    const store = makeStore();

    const result = await store
      .dispatch(
        submitOrders({ requests: [request, request], intervalMs: 0 }),
      )
      .unwrap();

    expect(result.finalStatus).toBe('DECLINED');
    expect(mockedCreate).toHaveBeenCalledTimes(1);
    expect(selectOrderFlowStatus(store.getState())).toBe('declined');
  });

  test('submitOrders times out into error when stuck pending', async () => {
    mockedCreate.mockResolvedValueOnce({
      orderId: 'o-1',
      checkoutUrl: null,
      status: 'PENDING',
    });
    mockedGet.mockResolvedValue({ id: 'o-1', status: 'PENDING' });
    const store = makeStore();

    await store.dispatch(
      submitOrders({ requests: [request], intervalMs: 0, maxAttempts: 2 }),
    );

    expect(selectOrderFlowStatus(store.getState())).toBe('error');
  });

  test('submitOrders retry skips lines already approved', async () => {
    // First run: line 1 approves, line 2 stays pending until the cap.
    mockedCreate
      .mockResolvedValueOnce({
        orderId: 'o-1',
        checkoutUrl: null,
        status: 'APPROVED',
      })
      .mockResolvedValueOnce({
        orderId: 'o-2',
        checkoutUrl: null,
        status: 'PENDING',
      });
    mockedGet
      .mockResolvedValueOnce({
        id: 'o-1',
        status: 'APPROVED',
        taxRatePercent: 18,
        taxInCents: 1800,
        amountInCents: 11800,
      })
      .mockResolvedValueOnce({ id: 'o-2', status: 'PENDING' })
      .mockResolvedValueOnce({ id: 'o-2', status: 'PENDING' });
    const store = makeStore();

    await store.dispatch(
      submitOrders({
        requests: [request, request],
        intervalMs: 0,
        maxAttempts: 2,
      }),
    );
    expect(selectOrderFlowStatus(store.getState())).toBe('error');

    // Retry: only the stuck line is created again — o-1 is never re-charged.
    mockedCreate.mockResolvedValueOnce({
      orderId: 'o-3',
      checkoutUrl: null,
      status: 'APPROVED',
    });
    mockedGet.mockResolvedValueOnce({
      id: 'o-3',
      status: 'APPROVED',
      taxRatePercent: 18,
      taxInCents: 1500,
      amountInCents: 9800,
    });

    const result = await store
      .dispatch(
        submitOrders({
          requests: [request, request],
          intervalMs: 0,
          maxAttempts: 2,
        }),
      )
      .unwrap();

    expect(mockedCreate).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      finalStatus: 'APPROVED',
      orderIds: ['o-1', 'o-3'],
      amountInCents: 21600,
      taxInCents: 3300,
      taxRatePercent: 18,
    });
    expect(selectOrderFlowStatus(store.getState())).toBe('approved');
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
