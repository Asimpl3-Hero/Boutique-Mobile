import { apiClient, ApiError } from '@lib/services/api';
import {
  ordersService,
  type CreateOrderRequest,
} from '@lib/services/orders';

jest.mock('@lib/services/api', () => {
  const actual = jest.requireActual('@lib/services/api');
  return {
    ...actual,
    apiClient: { get: jest.fn(), post: jest.fn() },
  };
});

const mockedPost = apiClient.post as jest.Mock;
const mockedGet = apiClient.get as jest.Mock;

const request: CreateOrderRequest = {
  productId: '89c580dd-3f6a-4ac0-99a2-b6a0292154c3',
  quantity: 2,
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
};

describe('ordersService', () => {
  afterEach(() => {
    mockedPost.mockReset();
    mockedGet.mockReset();
  });

  test('createOrder posts the exact contract payload', async () => {
    const response = { orderId: 'o-1', checkoutUrl: null, status: 'PENDING' };
    mockedPost.mockResolvedValueOnce(response);

    await expect(ordersService.createOrder(request)).resolves.toEqual(
      response,
    );
    expect(mockedPost).toHaveBeenCalledWith('/orders', { body: request });
  });

  test('createOrder propagates typed HTTP errors', async () => {
    mockedPost.mockRejectedValueOnce(
      new ApiError('POST /orders failed with status 422', 422, {
        code: 'VALIDATION_ERROR',
      }),
    );

    await expect(ordersService.createOrder(request)).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
    });
  });

  test('getOrder hits the id endpoint and returns the order', async () => {
    const order = { id: 'o-1', status: 'APPROVED' };
    mockedGet.mockResolvedValueOnce(order);

    await expect(ordersService.getOrder('o-1')).resolves.toEqual(order);
    expect(mockedGet).toHaveBeenCalledWith('/orders/o-1');
  });
});
