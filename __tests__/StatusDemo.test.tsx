import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { StatusDemoScreen } from '@screens';
import { Button } from '@components/ui';

const hasText = (
  tree: ReactTestRenderer.ReactTestRenderer,
  text: string,
): boolean =>
  tree.root.findAll(node => node.props?.children === text).length > 0;

const pressButton = async (
  tree: ReactTestRenderer.ReactTestRenderer,
  label: string,
) => {
  const button = tree.root
    .findAllByType(Button)
    .find(node => node.props.label === label);
  expect(button).toBeDefined();
  await ReactTestRenderer.act(async () => {
    button!.props.onPress();
  });
};

describe('StatusDemoScreen', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('walks loading → success → error → retry → back', async () => {
    const goBack = jest.fn();
    let tree!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <StatusDemoScreen
          route={{ params: undefined } as never}
          navigation={{ goBack } as never}
        />,
      );
    });

    // While loading, the staged copy replaces the message.
    expect(hasText(tree, 'Procesando…')).toBe(true);

    // The demo auto-resolves to success after its staged loading.
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(7500);
    });
    expect(hasText(tree, 'Continuar muestra el estado de error.')).toBe(true);

    // Success auto-fires onDone, which flips the demo to the error state.
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(2600);
    });
    expect(
      hasText(tree, 'Reintentar vuelve a cargando; Volver cierra la demo.'),
    ).toBe(true);

    // Retry loops back to loading.
    await pressButton(tree, 'Reintentar');
    expect(hasText(tree, 'Procesando…')).toBe(true);

    // Resolve again and leave through the error state's back action.
    // Two hops: success is scheduled only after the loading re-render.
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(7500);
    });
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(2600);
    });
    await pressButton(tree, 'Volver al inicio');
    expect(goBack).toHaveBeenCalled();

    await ReactTestRenderer.act(() => tree.unmount());
  });
});
