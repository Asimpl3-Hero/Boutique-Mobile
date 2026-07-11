import * as Keychain from 'react-native-keychain';

/** Line item snapshot for the invoice render. */
export interface StoredTransactionItem {
  name: string;
  quantity: number;
  priceInCents: number;
  currency: string;
}

/** Shipping snapshot shown on the invoice (no sensitive data). */
export interface StoredShipping {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
}

/**
 * Transaction record persisted after checkout (PDF requirement: encrypted
 * storage). NEVER the card number — only token reference, status and ids.
 */
export interface StoredTransaction {
  orderIds: string[];
  status: 'APPROVED' | 'DECLINED';
  amountInCents: number;
  /** VAT included in amountInCents (optional: older records predate it). */
  taxInCents?: number;
  /** VAT rate frozen by the backend at purchase time (integer percent). */
  taxRatePercent?: number;
  cardLastFour: string;
  createdAt: string;
  items: StoredTransactionItem[];
  /** Optional: older records predate this field. */
  shipping?: StoredShipping;
}

const SERVICE = 'boutique.transactions';
/** Newest first, capped to keep the encrypted payload small. */
const MAX_TRANSACTIONS = 50;

const readAll = async (): Promise<StoredTransaction[]> => {
  const stored = await Keychain.getGenericPassword({ service: SERVICE });
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored.password);
    return Array.isArray(parsed) ? (parsed as StoredTransaction[]) : [];
  } catch {
    return [];
  }
};

/** Appends a transaction to the encrypted history (newest first). */
export const saveTransaction = async (
  transaction: StoredTransaction,
): Promise<void> => {
  const history = await readAll();
  const next = [transaction, ...history].slice(0, MAX_TRANSACTIONS);
  await Keychain.setGenericPassword(SERVICE, JSON.stringify(next), {
    service: SERVICE,
  });
};

/** Full purchase history from OS-encrypted storage (Keystore-backed). */
export const getTransactions = async (): Promise<StoredTransaction[]> =>
  readAll();

/** Latest stored transaction, or null when none. */
export const getLastTransaction =
  async (): Promise<StoredTransaction | null> => {
    const [latest] = await readAll();
    return latest ?? null;
  };
