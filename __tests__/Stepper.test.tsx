import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Stepper } from '@components/ux';

const STEPS = ['Bolsa', 'Envío', 'Tarjeta', 'Resumen'];

const render = async (current: number, steps: string[] = STEPS) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<Stepper steps={steps} current={current} />);
  });
  return tree;
};

const labelOf = (
  tree: ReactTestRenderer.ReactTestRenderer,
  fragment: string,
) =>
  tree.root.findAll(
    node =>
      typeof node.props?.accessibilityLabel === 'string' &&
      node.props.accessibilityLabel.includes(fragment),
  );

describe('Stepper', () => {
  test('marks completed, active and pending states per step', async () => {
    const tree = await render(2);

    expect(labelOf(tree, 'Paso 1 Bolsa: completado').length).toBeGreaterThan(0);
    expect(labelOf(tree, 'Paso 2 Envío: completado').length).toBeGreaterThan(0);
    expect(labelOf(tree, 'Paso 3 Tarjeta: activo').length).toBeGreaterThan(0);
    expect(labelOf(tree, 'Paso 4 Resumen: pendiente').length).toBeGreaterThan(
      0,
    );
    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('first step starts active with the rest pending', async () => {
    const tree = await render(0);

    expect(labelOf(tree, 'Paso 1 Bolsa: activo').length).toBeGreaterThan(0);
    expect(labelOf(tree, 'completado').length).toBe(0);
    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('caps the rendered steps at four', async () => {
    const tree = await render(0, [...STEPS, 'Extra']);

    expect(labelOf(tree, 'Extra').length).toBe(0);
    expect(labelOf(tree, 'Paso 4 Resumen').length).toBeGreaterThan(0);
    await ReactTestRenderer.act(() => tree.unmount());
  });
});
