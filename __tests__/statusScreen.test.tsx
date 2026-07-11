import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { StatusScreen } from '@components/ux';
import { colors } from '@theme';

const render = async (element: React.ReactElement) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(element);
  });
  return tree;
};

const revealColor = (tree: ReactTestRenderer.ReactTestRenderer): string => {
  const circle = tree.root.findByProps({
    accessibilityLabel: 'Revelado circular',
  });
  const flat = Array.isArray(circle.props.style)
    ? Object.assign({}, ...circle.props.style)
    : circle.props.style;
  return flat.backgroundColor;
};

const hasText = (
  tree: ReactTestRenderer.ReactTestRenderer,
  text: string,
): boolean =>
  tree.root.findAll(node => node.props?.children === text).length > 0;

describe('StatusScreen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('loading: brand color reveal, spinner and no actions', async () => {
    const tree = await render(
      <StatusScreen visible state="loading" message="No cierres la app." />,
    );

    expect(revealColor(tree)).toBe(colors.primary);
    expect(
      tree.root.findAllByProps({ accessibilityLabel: 'Cargando' }).length,
    ).toBeGreaterThan(0);
    expect(hasText(tree, 'Procesando…')).toBe(true);
    expect(hasText(tree, 'Reintentar')).toBe(false);

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('success: green reveal, done icon and continue action', async () => {
    const onDone = jest.fn();
    const tree = await render(
      <StatusScreen visible state="success" onDone={onDone} />,
    );

    expect(revealColor(tree)).toBe(colors.success);
    expect(hasText(tree, '¡Todo listo!')).toBe(true);

    const done = tree.root
      .findAll(node => node.props?.accessibilityRole === 'button')
      .find(
        node =>
          node.findAll(child => child.props?.children === 'Continuar')
            .length > 0,
      );
    await ReactTestRenderer.act(() => done!.props.onPress());
    expect(onDone).toHaveBeenCalled();

    await ReactTestRenderer.act(() => tree.unmount());
  });

  test('error: red reveal, denied icon, retry and close actions', async () => {
    const onRetry = jest.fn();
    const tree = await render(
      <StatusScreen
        visible
        state="error"
        message="Fallo de red"
        onRetry={onRetry}
        onDone={() => {}}
      />,
    );

    expect(revealColor(tree)).toBe(colors.error);
    expect(hasText(tree, 'Algo salió mal')).toBe(true);
    expect(hasText(tree, 'Fallo de red')).toBe(true);

    const retry = tree.root
      .findAll(node => node.props?.accessibilityRole === 'button')
      .find(
        node =>
          node.findAll(child => child.props?.children === 'Reintentar')
            .length > 0,
      );
    await ReactTestRenderer.act(() => retry!.props.onPress());
    expect(onRetry).toHaveBeenCalled();

    await ReactTestRenderer.act(() => tree.unmount());
  });
});
