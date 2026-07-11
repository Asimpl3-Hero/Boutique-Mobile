import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Button, Chip, SearchBar } from '@components/ui';
import { Header } from '@components/layout';
import { CategoryChips, DEFAULT_CATEGORIES } from '@components/features';

const render = async (element: React.ReactElement) => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(element);
  });
  return tree;
};

describe('Button', () => {
  test('fires onPress and renders its label', async () => {
    const onPress = jest.fn();
    const tree = await render(<Button label="Shop the Look" onPress={onPress} />);

    const button = tree.root.findByProps({ accessibilityRole: 'button' });
    await ReactTestRenderer.act(() => button.props.onPress());

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(tree.toJSON())).toContain('Shop the Look');
  });

  test('does not fire when disabled', async () => {
    const onPress = jest.fn();
    const tree = await render(
      <Button label="Buy" onPress={onPress} disabled />,
    );

    const button = tree.root.findByProps({ accessibilityRole: 'button' });
    expect(button.props.accessibilityState).toEqual({ disabled: true });
  });
});

describe('Chip', () => {
  test('marks the active state and fires onPress', async () => {
    const onPress = jest.fn();
    const tree = await render(<Chip label="All" active onPress={onPress} />);

    const chip = tree.root.findByProps({ accessibilityRole: 'button' });
    expect(chip.props.accessibilityState).toEqual({ selected: true });

    await ReactTestRenderer.act(() => chip.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('SearchBar', () => {
  test('propagates text changes', async () => {
    const onChangeText = jest.fn();
    const tree = await render(<SearchBar onChangeText={onChangeText} />);

    const input = tree.root.findByProps({
      accessibilityLabel: 'Buscar productos',
    });
    await ReactTestRenderer.act(() => input.props.onChangeText('dress'));

    expect(onChangeText).toHaveBeenCalledWith('dress');
  });
});

describe('Header', () => {
  test('renders the brand title and fires the bell action', async () => {
    const onBellPress = jest.fn();
    const tree = await render(<Header onBellPress={onBellPress} />);

    expect(JSON.stringify(tree.toJSON())).toContain('BORCELLE');

    const bell = tree.root.findByProps({ accessibilityLabel: 'Notificaciones' });
    await ReactTestRenderer.act(() => {
      bell.props.onPress();
    });

    expect(onBellPress).toHaveBeenCalledTimes(1);
  });
});

describe('CategoryChips', () => {
  test('renders default categories and reports selection', async () => {
    const onSelect = jest.fn();
    const tree = await render(<CategoryChips active="All" onSelect={onSelect} />);

    const json = JSON.stringify(tree.toJSON());
    DEFAULT_CATEGORIES.forEach(category => expect(json).toContain(category));

    // Press the last chip (Trending) through its onPress prop.
    const chips = tree.root
      .findAllByProps({ accessibilityRole: 'button' })
      .filter(node => typeof node.props.onPress === 'function');
    await ReactTestRenderer.act(() => chips[chips.length - 1].props.onPress());

    expect(onSelect).toHaveBeenCalledWith('Trending');
  });
});
