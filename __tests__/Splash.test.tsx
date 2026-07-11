import React from 'react';
import { StyleSheet } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { SplashScreen } from '@screens';
import { APP_VERSION } from '@lib';
import { colors } from '@theme';

describe('SplashScreen', () => {
  test('renders the brand logo image and the app version in navy', async () => {
    let tree!: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<SplashScreen />);
    });

    const logo = tree.root.findByProps({ accessibilityLabel: 'Borcelle' });
    expect(logo.props.source).toBeDefined();
    expect(logo.props.resizeMode).toBe('contain');

    const version = tree.root.findByProps({ children: `v${APP_VERSION}` });
    const versionStyle = StyleSheet.flatten(version.props.style);
    expect(versionStyle.color).toBe(colors.text);

    await ReactTestRenderer.act(() => {
      tree.unmount();
    });
  });
});
