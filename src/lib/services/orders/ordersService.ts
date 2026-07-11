import { apiClient } from '@lib/services/api';
import type {
  CreateOrderRequest,
  OrderCreatedResponse,
  OrderResponse,
} from './types';

/**
 * Typed orders client. Errors propagate as the base client's typed
 * ApiError (HTTP 4xx/5xx with payload) / NetworkError (offline, timeout).
 */
export const ordersService = {
  createOrder: (request: CreateOrderRequest): Promise<OrderCreatedResponse> =>
    apiClient.post<OrderCreatedResponse>('/orders', { body: request }),

  getOrder: (orderId: string): Promise<OrderResponse> =>
    apiClient.get<OrderResponse>(`/orders/${orderId}`),
};
