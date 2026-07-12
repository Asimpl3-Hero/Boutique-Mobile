import { formatPrice } from '@lib';

describe('formatPrice', () => {
  it('shows the amount with the local currency code', () => {
    const price = formatPrice(1680000);

    expect(price).toContain('16.800');
    expect(price).toContain('COP');
  });

  it('never duplicates the code when the symbol already includes it', () => {
    const price = formatPrice(1680000, 'COP');

    expect(price.match(/COP/g)).toHaveLength(1);
  });
});
