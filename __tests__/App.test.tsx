import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { SPLASH_DURATION_MS } from '@screens';
import { APP_VERSION } from '@lib';

test('bootstrap starts on the splash and lands on the tab navigator', async () => {
  jest.useFakeTimers();
  let tree!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  // Splash first: brand + version, no tabs yet.
  const splashJson = JSON.stringify(tree.toJSON());
  expect(splashJson).toContain(`v${APP_VERSION}`);
  expect(splashJson).not.toContain('Facturas');

  await ReactTestRenderer.act(() => {
    jest.advanceTimersByTime(SPLASH_DURATION_MS);
  });

  const json = JSON.stringify(tree.toJSON());
  expect(json).toContain('Home');
  expect(json).toContain('Search');
  expect(json).toContain('Facturas');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
  jest.useRealTimers();
});
