import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('bootstrap renders the tab navigator', async () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  const json = JSON.stringify(tree.toJSON());
  expect(json).toContain('Home');
  expect(json).toContain('Search');

  await ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
