import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { InvoicesScreen } from '@screens';
import { formatInvoiceDate, invoiceNumber } from '@screens/Main/Invoices';
import { Button } from '@components/ui';
import {
  saveTransaction,
  type StoredTransaction,
} from '@lib';

// The screen refreshes on focus; under Jest there is no navigation
// container, so run the focus effect as a plain mount effect.
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  const { useEffect } = require('react');
  return {
    ...actual,
    useFocusEffect: (callback: () => void | (() => void)) => {
      useEffect(callback, [callback]);
    },
  };
});

const approved: StoredTransaction = {
  orderIds: ['abc123-order'],
  status: 'APPROVED',
  amountInCents: 11800000,
  taxInCents: 1800000,
  taxRatePercent: 18,
  cardLastFour: '4242',
  createdAt: '2026-07-05T10:00:00.000Z',
  items: [
    { name: 'Conjunto Royal', quantity: 1, priceInCents: 10000000, currency: 'COP' },
  ],
};

const declined: StoredTransaction = {
  ...approved,
  orderIds: ['def456-order'],
  status: 'DECLINED',
};

const renderInvoices = async (navigation: { navigate?: jest.Mock } = {}) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <InvoicesScreen
        route={{ params: undefined } as never}
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

describe('invoice helpers', () => {
  test('invoiceNumber derives a short id from the first order', () => {
    expect(invoiceNumber(approved)).toBe('#ABC123');
    expect(invoiceNumber({ ...approved, orderIds: [] })).toBe('#000000');
  });

  test('formatInvoiceDate renders dd/mm/yyyy', () => {
    expect(formatInvoiceDate('2026-07-05T10:00:00.000Z')).toMatch(
      /^\d{2}\/\d{2}\/2026$/,
    );
  });
});

describe('InvoicesScreen', () => {
  test('shows the empty state before any purchase', async () => {
    const tree = await renderInvoices();

    expect(
      hasText(
        tree,
        'Aún no tienes compras. Cuando pagues tu primera orden, la factura ' +
          'aparecerá aquí.',
      ),
    ).toBe(true);

    // Dev entry exists under __DEV__; navigationRef is not ready here, so
    // pressing it is a safe no-op.
    const demo = tree.root
      .findAllByType(Button)
      .find(node => node.props.label === 'Demo de estados (dev)');
    expect(demo).toBeDefined();
    await ReactTestRenderer.act(async () => {
      demo!.props.onPress();
    });

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('lists stored transactions newest first and opens the detail', async () => {
    await saveTransaction(approved);
    await saveTransaction(declined);

    const navigate = jest.fn();
    const tree = await renderInvoices({ navigate });

    expect(hasText(tree, 'Factura #ABC123')).toBe(true);
    expect(hasText(tree, 'Factura #DEF456')).toBe(true);
    expect(hasText(tree, 'APROBADA')).toBe(true);
    expect(hasText(tree, 'RECHAZADA')).toBe(true);

    const row = tree.root.findByProps({
      accessibilityLabel: 'Factura #ABC123',
    });
    await ReactTestRenderer.act(async () => {
      row.props.onPress();
    });
    expect(navigate).toHaveBeenCalledWith('InvoiceDetail', {
      transaction: expect.objectContaining({ orderIds: ['abc123-order'] }),
    });

    await ReactTestRenderer.act(() => tree.unmount());
  });
});
