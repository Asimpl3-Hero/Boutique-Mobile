import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { CircularReveal, ProgressBar } from '@components/ux';
import { colors } from '@theme';

const render = async (element: React.ReactElement) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(element);
  });
  return tree;
};

describe('CircularReveal', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('renders a screen-covering circle in the given color and finishes', async () => {
    const onFinish = jest.fn();
    const tree = await render(
      <CircularReveal color={colors.success} active onFinish={onFinish} />,
    );

    const circle = tree.root.findByProps({
      accessibilityLabel: 'Revelado circular',
    });
    const flat = Array.isArray(circle.props.style)
      ? Object.assign({}, ...circle.props.style)
      : circle.props.style;
    expect(flat.backgroundColor).toBe(colors.success);
    // Diameter covers the diagonal of the (mocked) window.
    expect(flat.width).toBeGreaterThan(0);
    expect(flat.width).toBe(flat.height);

    await ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(700);
    });
    expect(onFinish).toHaveBeenCalled();

    await ReactTestRenderer.act(() => tree.unmount());
  });
});

describe('ProgressBar', () => {
  test('determinate mode animates the fill in the given color', async () => {
    jest.useFakeTimers();
    const tree = await render(
      <ProgressBar progress={0.5} color={colors.error} />,
    );

    const track = tree.root.findByProps({ accessibilityRole: 'progressbar' });
    await ReactTestRenderer.act(() => {
      track.props.onLayout({ nativeEvent: { layout: { width: 300 } } });
    });
    await ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(600);
    });

    const fill = tree.root.findByProps({ testID: 'progress-fill' });
    const flat = Object.assign(
      {},
      ...(Array.isArray(fill.props.style) ? fill.props.style : [fill.props.style]),
    );
    expect(flat.backgroundColor).toBe(colors.error);
    // Animated width node exists (grows from 0 toward 50% of the track).
    expect(flat.width).toBeDefined();

    await ReactTestRenderer.act(() => tree.unmount());
    jest.useRealTimers();
  });

  test('indeterminate mode renders the animated sweep segment', async () => {
    jest.useFakeTimers();
    const tree = await render(<ProgressBar />);

    const track = tree.root.findByProps({ accessibilityRole: 'progressbar' });
    await ReactTestRenderer.act(() => {
      track.props.onLayout({ nativeEvent: { layout: { width: 300 } } });
    });

    const fill = tree.root.findByProps({ testID: 'progress-fill' });
    const flat = Object.assign(
      {},
      ...(Array.isArray(fill.props.style) ? fill.props.style : [fill.props.style]),
    );
    expect(flat.width).toBe(120); // 40% of the measured track
    expect(flat.transform).toBeDefined();

    await ReactTestRenderer.act(() => tree.unmount());
    jest.useRealTimers();
  });
});
