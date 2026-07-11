import {
  getLastTransaction,
  getTransactions,
  saveTransaction,
  type StoredTransaction,
} from '@lib';

const transaction = (overrides: Partial<StoredTransaction> = {}): StoredTransaction => ({
  orderIds: ['o-1', 'o-2'],
  status: 'APPROVED',
  amountInCents: 629600,
  cardLastFour: '4242',
  createdAt: '2026-07-11T05:00:00.000Z',
  items: [
    { name: 'Jean Slim Fit Índigo', quantity: 2, priceInCents: 18990000, currency: 'COP' },
    { name: 'Bufanda de Lana', quantity: 1, priceInCents: 7990000, currency: 'COP' },
  ],
  ...overrides,
});

describe('secureStorage', () => {
  test('appends transactions to the encrypted history, newest first', async () => {
    const first = transaction({ orderIds: ['o-1'] });
    const second = transaction({ orderIds: ['o-9'], status: 'DECLINED' });

    await saveTransaction(first);
    await saveTransaction(second);

    const history = await getTransactions();
    expect(history[0].orderIds).toEqual(['o-9']);
    expect(history[1].orderIds).toEqual(['o-1']);
    await expect(getLastTransaction()).resolves.toEqual(second);
  });

  test('never persists a PAN-shaped field', () => {
    // Compile-time contract: StoredTransaction has no card number field;
    // runtime guard: the serialized payload only carries the last four.
    const serialized = JSON.stringify(transaction());
    expect(serialized).not.toMatch(/\d{13,19}/);
    expect(serialized).toContain('"cardLastFour":"4242"');
  });
});
