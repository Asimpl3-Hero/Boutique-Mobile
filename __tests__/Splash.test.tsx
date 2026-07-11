import React from 'react';
import { StyleSheet } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { SplashScreen, SPLASH_DURATION_MS } from '@screens';
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

  describe('transition to Main', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const renderWithNavigation = async (navigation: unknown) => {
      let tree!: ReactTestRenderer.ReactTestRenderer;
      await ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(
          <SplashScreen navigation={navigation as never} />,
        );
      });
      return tree;
    };

    test('replaces to Main after the minimum boot delay', async () => {
      const replace = jest.fn();
      const tree = await renderWithNavigation({ replace });

      await ReactTestRenderer.act(() => {
        jest.advanceTimersByTime(SPLASH_DURATION_MS);
      });

      expect(replace).toHaveBeenCalledWith('Main');
      await ReactTestRenderer.act(() => tree.unmount());
    });

    test('falls back to navigate when replace throws', async () => {
      const replace = jest.fn(() => {
        throw new Error('nav not ready');
      });
      const navigate = jest.fn();
      const tree = await renderWithNavigation({ replace, navigate });

      await ReactTestRenderer.act(() => {
        jest.advanceTimersByTime(SPLASH_DURATION_MS);
      });

      expect(navigate).toHaveBeenCalledWith('Main');
      await ReactTestRenderer.act(() => tree.unmount());
    });

    test('clears the timer on unmount (no navigation after leaving)', async () => {
      const replace = jest.fn();
      const tree = await renderWithNavigation({ replace });

      await ReactTestRenderer.act(() => tree.unmount());
      await ReactTestRenderer.act(() => {
        jest.advanceTimersByTime(SPLASH_DURATION_MS * 2);
      });

      expect(replace).not.toHaveBeenCalled();
    });
  });
});
