import { appConfig } from '@lib/constants';
import { ApiError, NetworkError } from '@lib/services/api';
import type { CardInput, CardTokenResponse, TokenizedCard } from './types';

const TIMEOUT_MS = 15_000;

/**
 * Tokenizes the card against the payments provider sandbox using the
 * public key. Only the resulting token (and last four digits for display)
 * leaves this function — the PAN is never stored anywhere.
 */
const tokenizeCard = async (card: CardInput): Promise<TokenizedCard> => {
  if (!appConfig.paymentsApiUrl || !appConfig.paymentsPublicKey) {
    throw new NetworkError(
      'Falta configurar PAYMENTS_API_URL / PAYMENTS_PUBLIC_KEY',
    );
  }

  const digits = card.number.replace(/\D/g, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${appConfig.paymentsApiUrl}/tokens/cards`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appConfig.paymentsPublicKey}`,
      },
      body: JSON.stringify({
        number: digits,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvc: card.cvc,
        card_holder: card.cardHolder.trim(),
      }),
      signal: controller.signal,
    });
  } catch (cause) {
    throw new NetworkError(
      controller.signal.aborted
        ? 'La tokenización tardó demasiado'
        : 'No pudimos conectar con el proveedor de pagos',
      cause,
    );
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json()) as CardTokenResponse;

  if (!response.ok || !payload?.data?.id) {
    throw new ApiError(
      'La tarjeta no pudo ser tokenizada',
      response.status,
      payload,
    );
  }

  return {
    cardToken: payload.data.id,
    lastFour: payload.data.last_four ?? digits.slice(-4),
  };
};

export const paymentsService = { tokenizeCard };
