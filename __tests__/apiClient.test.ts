import { apiClient, ApiError, NetworkError } from '@lib/services/api';

const jsonResponse = (
  body: unknown,
  { ok = true, status = 200 }: { ok?: boolean; status?: number } = {},
) => ({
  ok,
  status,
  headers: { get: () => 'application/json' },
  json: async () => body,
  text: async () => JSON.stringify(body),
});

const textResponse = (body: string) => ({
  ok: true,
  status: 200,
  headers: { get: () => null },
  json: async () => {
    throw new Error('not json');
  },
  text: async () => body,
});

describe('apiClient', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    globalThis.fetch = fetchMock as never;
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  test('get resolves the parsed JSON payload', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 'p-1' }));

    const result = await apiClient.get<{ id: string }>('/products/p-1');

    expect(result).toEqual({ id: 'p-1' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:3000/products/p-1');
    expect(init.method).toBe('GET');
    // No body: the JSON content type is not sent.
    expect(init.headers['Content-Type']).toBeUndefined();
  });

  test('post serializes the body and marks it as JSON', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ orderId: 'o-1' }));

    await apiClient.post('/orders', { body: { productId: 'p-1' } });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ productId: 'p-1' }));
  });

  test('non-2xx responses throw ApiError with status and payload', async () => {
    fetchMock.mockImplementation(async () =>
      jsonResponse({ message: 'not found' }, { ok: false, status: 404 }),
    );

    await expect(apiClient.get('/products/missing')).rejects.toThrow(ApiError);
    await expect(
      apiClient.get('/products/missing').catch(error => error),
    ).resolves.toMatchObject({ status: 404, payload: { message: 'not found' } });
  });

  test('non-JSON responses resolve as raw text', async () => {
    fetchMock.mockResolvedValueOnce(textResponse('pong'));
    await expect(apiClient.get('/health')).resolves.toBe('pong');
  });

  test('a network failure surfaces as NetworkError', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    await expect(apiClient.get('/products')).rejects.toThrow(NetworkError);
  });

  test('requests time out through the abort controller', async () => {
    jest.useFakeTimers();
    fetchMock.mockImplementationOnce(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () =>
            reject(new Error('Aborted')),
          );
        }),
    );

    const pending = apiClient
      .get('/slow', { timeoutMs: 50 })
      .catch(error => error);
    jest.advanceTimersByTime(60);
    await expect(pending).resolves.toMatchObject({
      name: 'NetworkError',
      message: 'Request timed out after 50ms: GET /slow',
    });
    jest.useRealTimers();
  });

  test('an external signal aborts the request', async () => {
    fetchMock.mockImplementationOnce(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () =>
            reject(new Error('Aborted')),
          );
        }),
    );

    const controller = new AbortController();
    const pending = apiClient
      .delete('/orders/o-1', { signal: controller.signal })
      .catch(error => error);
    controller.abort();
    await expect(pending).resolves.toBeInstanceOf(NetworkError);
  });
});
