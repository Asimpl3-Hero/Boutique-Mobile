import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ordersService,
  type CreateOrderRequest,
  type OrderCreatedResponse,
  type OrderStatus,
} from '@lib/services/orders';

export type OrderFlowStatus =
  | 'idle'
  | 'creating'
  | 'pending'
  | 'approved'
  | 'declined'
  | 'error';

export interface OrdersState {
  orderId: string | null;
  status: OrderFlowStatus;
  error: string | null;
}

const initialState: OrdersState = {
  orderId: null,
  status: 'idle',
  error: null,
};

const sleep = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

/** Creates the order on the backend (`POST /orders`). */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (request: CreateOrderRequest): Promise<OrderCreatedResponse> =>
    ordersService.createOrder(request),
);

export interface PollOrderStatusArgs {
  orderId: string;
  /** Test hooks: cadence and cap of the polling loop. */
  intervalMs?: number;
  maxAttempts?: number;
}

/**
 * Polls `GET /orders/:id` until the backend resolves the payment
 * (the backend itself polls the provider — no webhooks anywhere).
 */
export const pollOrderStatus = createAsyncThunk(
  'orders/pollOrderStatus',
  async ({
    orderId,
    intervalMs = 2000,
    maxAttempts = 30,
  }: PollOrderStatusArgs): Promise<OrderStatus> => {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const order = await ordersService.getOrder(orderId);
      if (order.status !== 'PENDING') {
        return order.status;
      }
      await sleep(intervalMs);
    }
    throw new Error('El pago sigue pendiente. Intenta de nuevo en un momento.');
  },
);

export interface SubmitOrdersArgs {
  requests: CreateOrderRequest[];
  /** Test hooks: cadence and cap of each polling loop. */
  intervalMs?: number;
  maxAttempts?: number;
}

export interface SubmitOrdersResult {
  finalStatus: Extract<OrderStatus, 'APPROVED' | 'DECLINED'>;
  orderIds: string[];
}

/**
 * Full checkout submission: one order per cart line (the backend accepts a
 * single product per order). Each order is created and then polled to a
 * terminal status; the first decline stops the run and the overall result
 * is DECLINED. All approved → APPROVED.
 */
export const submitOrders = createAsyncThunk(
  'orders/submitOrders',
  async ({
    requests,
    intervalMs = 2000,
    maxAttempts = 30,
  }: SubmitOrdersArgs): Promise<SubmitOrdersResult> => {
    const orderIds: string[] = [];

    for (const request of requests) {
      const created = await ordersService.createOrder(request);
      orderIds.push(created.orderId);

      let status: OrderStatus = created.status;
      let attempt = 0;
      while (status === 'PENDING' && attempt < maxAttempts) {
        await sleep(intervalMs);
        const order = await ordersService.getOrder(created.orderId);
        status = order.status;
        attempt += 1;
      }

      if (status === 'PENDING') {
        throw new Error(
          'El pago sigue pendiente. Intenta de nuevo en un momento.',
        );
      }
      if (status === 'DECLINED') {
        return { finalStatus: 'DECLINED', orderIds };
      }
    }

    return { finalStatus: 'APPROVED', orderIds };
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    /** Resets the flow for a fresh checkout. */
    resetOrderFlow: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(createOrder.pending, state => {
        state.status = 'creating';
        state.orderId = null;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderId = action.payload.orderId;
        state.status = action.payload.status === 'APPROVED'
          ? 'approved'
          : action.payload.status === 'DECLINED'
            ? 'declined'
            : 'pending';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'No pudimos crear la orden';
      })
      .addCase(pollOrderStatus.fulfilled, (state, action) => {
        state.status = action.payload === 'APPROVED' ? 'approved' : 'declined';
      })
      .addCase(pollOrderStatus.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          action.error.message ?? 'No pudimos confirmar el estado del pago';
      })
      .addCase(submitOrders.pending, state => {
        state.status = 'creating';
        state.orderId = null;
        state.error = null;
      })
      .addCase(submitOrders.fulfilled, (state, action) => {
        state.orderId = action.payload.orderIds[0] ?? null;
        state.status =
          action.payload.finalStatus === 'APPROVED' ? 'approved' : 'declined';
      })
      .addCase(submitOrders.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          action.error.message ?? 'No pudimos procesar el pago';
      });
  },
});

export const { resetOrderFlow } = ordersSlice.actions;

interface WithOrders {
  orders: OrdersState;
}

export const selectOrderFlowStatus = (state: WithOrders): OrderFlowStatus =>
  state.orders.status;
export const selectOrderId = (state: WithOrders): string | null =>
  state.orders.orderId;
export const selectOrderError = (state: WithOrders): string | null =>
  state.orders.error;

export default ordersSlice.reducer;
