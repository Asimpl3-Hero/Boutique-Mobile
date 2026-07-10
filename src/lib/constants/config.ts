import Config from 'react-native-config';

/**
 * Typed application config read from the environment (react-native-config).
 * Values are baked in at build time from .env — see .env.example.
 */
export interface AppConfig {
  /** Backend base URL, no trailing slash. */
  apiUrl: string;
  /** Payments provider public key (public value, not a secret). */
  paymentsPublicKey: string;
  /** Empty by default: the acceptance token is resolved dynamically at checkout. */
  paymentsAcceptanceToken: string;
}

const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, '');

export const appConfig: AppConfig = {
  apiUrl: stripTrailingSlash(Config.API_URL ?? 'http://10.0.2.2:3000'),
  paymentsPublicKey: Config.PAYMENTS_PUBLIC_KEY ?? '',
  paymentsAcceptanceToken: Config.PAYMENTS_ACCEPTANCE_TOKEN ?? '',
};
