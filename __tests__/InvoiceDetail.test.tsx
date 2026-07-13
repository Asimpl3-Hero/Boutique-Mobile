import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { InvoiceDetailScreen } from '@screens';
import type { StoredTransaction } from '@lib';

const fullTransaction: StoredTransaction = {
  orderIds: ['abc123-order'],
  status: 'APPROVED',
  amountInCents: 11800000,
  taxInCents: 1800000,
  taxRatePercent: 18,
  cardLastFour: '4242',
  createdAt: '2026-07-05T10:00:00.000Z',
  items: [
    { name: 'Conjunto Royal', quantity: 2, priceInCents: 5000000, currency: 'COP' },
  ],
  shipping: {
    fullName: 'Ana Pérez',
    email: 'ana.perez@correo.com',
    phone: '3001234567',
    address1: 'Calle 12 # 34-56',
    address2: 'Apto 501',
    city: 'Bogotá',
    state: 'Cundinamarca',
    zip: '110111',
    country: 'CO',
  },
};

/** Older records: no shipping snapshot and no VAT breakdown. */
const legacyTransaction: StoredTransaction = {
  orderIds: ['def456-order'],
  status: 'DECLINED',
  amountInCents: 7990000,
  cardLastFour: '1111',
  createdAt: '2026-06-01T10:00:00.000Z',
  items: [
    { name: 'Conjunto Static Camo', quantity: 1, priceInCents: 7990000, currency: 'COP' },
  ],
};

const renderDetail = async (
  transaction: StoredTransaction,
  navigation: { goBack?: jest.Mock } = {},
) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <InvoiceDetailScreen
        route={{ params: { transaction } } as never}
        navigation={navigation as never}
      />,
    );
  });
  return tree;
};

const hasText = (
  tree: ReactTestRenderer.ReactTestRenderer,
  text: string,
): boolean =>
  tree.root.findAll(node => node.props?.children === text).length > 0;

describe('InvoiceDetailScreen', () => {
  test('renders the approved receipt with shipping and VAT breakdown', async () => {
    const tree = await renderDetail(fullTransaction);

    expect(hasText(tree, 'FACTURA BORCELLE')).toBe(true);
    expect(hasText(tree, '#ABC123')).toBe(true);
    expect(hasText(tree, 'APROBADA')).toBe(true);
    expect(hasText(tree, 'Ana Pérez')).toBe(true);
    expect(hasText(tree, 'ana.perez@correo.com')).toBe(true);
    expect(hasText(tree, '3001234567')).toBe(true);
    expect(hasText(tree, 'Calle 12 # 34-56, Apto 501')).toBe(true);
    expect(hasText(tree, 'Bogotá, Cundinamarca')).toBe(true);
    expect(hasText(tree, '110111')).toBe(true);
    expect(hasText(tree, 'CO')).toBe(true);
    expect(hasText(tree, '•••• 4242')).toBe(true);
    expect(hasText(tree, 'Conjunto Royal')).toBe(true);
    expect(hasText(tree, 'Precio sin IVA')).toBe(true);
    expect(hasText(tree, 'IVA aplicado (18%)')).toBe(true);
    expect(hasText(tree, 'Precio Total')).toBe(true);

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('renders legacy declined records without shipping or VAT rows', async () => {
    const goBack = jest.fn();
    const tree = await renderDetail(legacyTransaction, { goBack });

    expect(hasText(tree, 'RECHAZADA')).toBe(true);
    expect(hasText(tree, '•••• 1111')).toBe(true);
    expect(hasText(tree, 'Precio sin IVA')).toBe(false);
    expect(hasText(tree, 'A nombre de')).toBe(false);

    const back = tree.root.findByProps({ accessibilityLabel: 'Volver' });
    await ReactTestRenderer.act(async () => {
      back.props.onPress();
    });
    expect(goBack).toHaveBeenCalled();

    await ReactTestRenderer.act(() => tree.unmount());
  });
});
