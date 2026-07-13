import { paymentsService } from '@lib/services/payments';
import { ApiError, NetworkError } from '@lib/services/api';
import { appConfig } from '@lib/constants';

jest.mock('@lib/constants', () => {
  const actual = jest.requireActual('@lib/constants');
  return {
    ...actual,
    appConfig: {
      ...actual.appConfig,
      paymentsApiUrl: 'https://pay.sandbox.test',
      paymentsPublicKey: 'pub_test_key',
    },
  };
});

const card = {
  number: '4242 4242 4242 4242',
  cardHolder: '  APPROVED TEST  ',
  expMonth: '12',
  expYear: '29',
  cvc: '123',
};

const tokenResponse = (body: unknown, ok = true, status = 201) => ({
  ok,
  status,
  json: async () => body,
});

describe('paymentsService.tokenizeCard', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    globalThis.fetch = fetchMock as never;
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  test('sends the sanitized card and returns token + last four', async () => {
    fetchMock.mockResolvedValueOnce(
      tokenResponse({ data: { id: 'tok_1', last_four: '4242' } }),
    );

    const tokenized = await paymentsService.tokenizeCard(card);

    expect(tokenized).toEqual({ cardToken: 'tok_1', lastFour: '4242' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://pay.sandbox.test/tokens/cards');
    expect(init.headers.Authorization).toBe('Bearer pub_test_key');
    const body = JSON.parse(init.body);
    // The PAN travels digits-only; the holder is trimmed.
    expect(body.number).toBe('4242424242424242');
    expect(body.card_holder).toBe('APPROVED TEST');
  });

  test('falls back to the PAN tail when last_four is missing', async () => {
    fetchMock.mockResolvedValueOnce(tokenResponse({ data: { id: 'tok_2' } }));

    const tokenized = await paymentsService.tokenizeCard(card);
    expect(tokenized.lastFour).toBe('4242');
  });

  test('provider rejection throws ApiError', async () => {
    fetchMock.mockResolvedValueOnce(
      tokenResponse({ error: 'invalid card' }, false, 422),
    );

    await expect(paymentsService.tokenizeCard(card)).rejects.toThrow(ApiError);
  });

  test('connection failures throw NetworkError', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));

    await expect(paymentsService.tokenizeCard(card)).rejects.toThrow(
      NetworkError,
    );
  });

  test('missing provider config fails fast without a request', async () => {
    const originalUrl = appConfig.paymentsApiUrl;
    (appConfig as { paymentsApiUrl: string }).paymentsApiUrl = '';

    await expect(paymentsService.tokenizeCard(card)).rejects.toThrow(
      'Falta configurar PAYMENTS_API_URL / PAYMENTS_PUBLIC_KEY',
    );
    expect(fetchMock).not.toHaveBeenCalled();

    (appConfig as { paymentsApiUrl: string }).paymentsApiUrl = originalUrl;
  });
});
