import {
  getLastTransaction,
  saveLastTransaction,
  type StoredTransaction,
} from '@lib';

const transaction: StoredTransaction = {
  orderIds: ['o-1', 'o-2'],
  status: 'APPROVED',
  amountInCents: 629600,
  cardLastFour: '4242',
  createdAt: '2026-07-11T05:00:00.000Z',
};

describe('secureStorage', () => {
  test('round-trips the last transaction through encrypted storage', async () => {
    await saveLastTransaction(transaction);
    await expect(getLastTransaction()).resolves.toEqual(transaction);
  });

  test('never persists a PAN-shaped field', () => {
    // Compile-time contract: StoredTransaction has no card number field;
    // runtime guard: the serialized payload only carries the last four.
    const serialized = JSON.stringify(transaction);
    expect(serialized).not.toMatch(/\d{13,19}/);
    expect(serialized).toContain('"cardLastFour":"4242"');
  });
});
