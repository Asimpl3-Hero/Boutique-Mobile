import { taxFromBase } from '@lib';

describe('taxFromBase', () => {
  it('adds the VAT on top of a base price', () => {
    // Base 10000 at 18% → IVA 1800 (total charged 11800).
    expect(taxFromBase(10000, 18)).toBe(1800);
  });

  it('rounds to whole cents', () => {
    // 9999 × 0.18 = 1799.82 → 1800.
    expect(taxFromBase(9999, 18)).toBe(1800);
  });

  it('returns 0 for a zero rate or empty base', () => {
    expect(taxFromBase(5000, 0)).toBe(0);
    expect(taxFromBase(0, 18)).toBe(0);
  });
});
