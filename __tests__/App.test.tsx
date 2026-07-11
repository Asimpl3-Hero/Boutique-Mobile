import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { SPLASH_DURATION_MS } from '@screens';
import { APP_VERSION } from '@lib';

// Home fetches the catalog on mount; keep the app test hermetic.
jest.mock('@lib/services/products', () => {
  const actual = jest.requireActual('@lib/services/products');
  return {
    ...actual,
    productsService: { fetchProducts: jest.fn().mockResolvedValue([]) },
  };
});

const hasText = (
  tree: ReactTestRenderer.ReactTestRenderer,
  text: string,
): boolean =>
  tree.root.findAll(node => node.props?.children === text).length > 0;

test('bootstrap starts on the splash and lands on the tab navigator', async () => {
  jest.useFakeTimers();
  let tree!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  // Splash first: version visible, no tabs yet.
  expect(hasText(tree, `v${APP_VERSION}`)).toBe(true);
  expect(hasText(tree, 'Facturas')).toBe(false);

  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(SPLASH_DURATION_MS);
  });
  // Flush the catalog thunk triggered by Home mounting.
  await ReactTestRenderer.act(async () => {
    await Promise.resolve();
  });

  expect(hasText(tree, 'Home')).toBe(true);
  expect(hasText(tree, 'Facturas')).toBe(true);
  expect(hasText(tree, 'Trending Now')).toBe(true);

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
  jest.useRealTimers();
});
