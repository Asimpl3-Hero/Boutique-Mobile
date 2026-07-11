import * as Keychain from 'react-native-keychain';

/**
 * Transaction record persisted after checkout (PDF requirement: encrypted
 * storage). NEVER the card number — only token reference, status and ids.
 */
export interface StoredTransaction {
  orderIds: string[];
  status: 'APPROVED' | 'DECLINED';
  amountInCents: number;
  cardLastFour: string;
  createdAt: string;
}

const SERVICE = 'boutique.transactions';

/** Saves the last transaction in OS-encrypted storage (Keystore-backed). */
export const saveLastTransaction = async (
  transaction: StoredTransaction,
): Promise<void> => {
  await Keychain.setGenericPassword(SERVICE, JSON.stringify(transaction), {
    service: SERVICE,
  });
};

/** Reads the last stored transaction, or null when none/corrupted. */
export const getLastTransaction =
  async (): Promise<StoredTransaction | null> => {
    const stored = await Keychain.getGenericPassword({ service: SERVICE });
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored.password) as StoredTransaction;
    } catch {
      return null;
    }
  };
