import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
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

/** One cart line confirmed as APPROVED during a submitOrders run. */
export interface ApprovedOrderLine {
  orderId: string;
  amountInCents: number;
  taxInCents: number;
  taxRatePercent: number;
}

/**
 * Approved lines carried across a failed run: a retry resumes after them
 * instead of re-creating (and re-charging) orders that already went through.
 */
export interface OrderRunProgress {
  completedLines: number;
  orderIds: string[];
  amountInCents: number;
  taxInCents: number;
  taxRatePercent: number;
}

export interface OrdersState {
  orderId: string | null;
  status: OrderFlowStatus;
  error: string | null;
  runProgress: OrderRunProgress | null;
}

const initialState: OrdersState = {
  orderId: null,
  status: 'idle',
  error: null,
  runProgress: null,
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
  /** Backend-authoritative charged total (base + VAT) across the orders. */
  amountInCents: number;
  /** Backend-authoritative VAT summed across the run's orders. */
  taxInCents: number;
  /** Rate frozen on the created orders (integer percent). */
  taxRatePercent: number;
}

/**
 * Full checkout submission: one order per cart line (the backend accepts a
 * single product per order). Each order is created and then polled to a
 * terminal status; the first decline stops the run and the overall result
 * is DECLINED. All approved → APPROVED.
 */
export const submitOrders = createAsyncThunk(
  'orders/submitOrders',
  async (
    { requests, intervalMs = 2000, maxAttempts = 30 }: SubmitOrdersArgs,
    { getState, dispatch },
  ): Promise<SubmitOrdersResult> => {
    // Resume after a failed run: lines already approved are skipped so a
    // retry never re-creates (and re-charges) orders that went through.
    const prior = (getState() as WithOrders).orders.runProgress;
    const orderIds = [...(prior?.orderIds ?? [])];
    let amountInCents = prior?.amountInCents ?? 0;
    let taxInCents = prior?.taxInCents ?? 0;
    let taxRatePercent = prior?.taxRatePercent ?? 0;

    for (const request of requests.slice(prior?.completedLines ?? 0)) {
      const created = await ordersService.createOrder(request);
      orderIds.push(created.orderId);

      let status: OrderStatus = created.status;
      let attempt = 0;
      let lastOrder = null;
      while (status === 'PENDING' && attempt < maxAttempts) {
        await sleep(intervalMs);
        lastOrder = await ordersService.getOrder(created.orderId);
        status = lastOrder.status;
        attempt += 1;
      }

      if (status === 'PENDING') {
        throw new Error(
          'El pago sigue pendiente. Intenta de nuevo en un momento.',
        );
      }
      // Terminal at creation: fetch once for the persisted breakdown.
      if (!lastOrder) {
        lastOrder = await ordersService.getOrder(created.orderId);
      }
      amountInCents += lastOrder.amountInCents ?? 0;
      taxInCents += lastOrder.taxInCents ?? 0;
      taxRatePercent = lastOrder.taxRatePercent ?? taxRatePercent;

      if (status === 'DECLINED') {
        return {
          finalStatus: 'DECLINED',
          orderIds,
          amountInCents,
          taxInCents,
          taxRatePercent,
        };
      }

      dispatch(
        orderLineApproved({
          orderId: created.orderId,
          amountInCents: lastOrder.amountInCents ?? 0,
          taxInCents: lastOrder.taxInCents ?? 0,
          taxRatePercent: lastOrder.taxRatePercent ?? 0,
        }),
      );
    }

    return {
      finalStatus: 'APPROVED',
      orderIds,
      amountInCents,
      taxInCents,
      taxRatePercent,
    };
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    /** Resets the flow for a fresh checkout. */
    resetOrderFlow: () => initialState,
    /** Bookkeeping for retries: one cart line reached APPROVED. */
    orderLineApproved(state, action: PayloadAction<ApprovedOrderLine>) {
      const progress = state.runProgress ?? {
        completedLines: 0,
        orderIds: [],
        amountInCents: 0,
        taxInCents: 0,
        taxRatePercent: 0,
      };
      progress.completedLines += 1;
      progress.orderIds.push(action.payload.orderId);
      progress.amountInCents += action.payload.amountInCents;
      progress.taxInCents += action.payload.taxInCents;
      if (action.payload.taxRatePercent) {
        progress.taxRatePercent = action.payload.taxRatePercent;
      }
      state.runProgress = progress;
    },
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
        // Terminal run: the next submission starts from a clean slate.
        state.runProgress = null;
      })
      .addCase(submitOrders.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          action.error.message ?? 'No pudimos procesar el pago';
      });
  },
});

export const { resetOrderFlow, orderLineApproved } = ordersSlice.actions;

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
