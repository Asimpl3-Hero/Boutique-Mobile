import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@theme';
import { styles } from './FloatingTabBar.styles';

// Metric other screens need to pad scroll content above the floating bar.
export { BAR_HEIGHT } from './FloatingTabBar.styles';

export interface FloatingTabBarProps extends BottomTabBarProps {
  /** Name of the route rendered as the prominent circular action button. */
  actionRoute?: string;
}

/**
 * Floating pill-shaped bottom tab bar with an elevated circular action
 * button. Presentational: routes, icons and labels come from the navigator.
 */
export const FloatingTabBar = ({
  state,
  descriptors,
  navigation,
  actionRoute,
}: FloatingTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.wrapper, { bottom: insets.bottom + spacing.md }]}
      pointerEvents="box-none"
    >
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label = options.title ?? route.name;
          const isAction = route.name === actionRoute;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          if (isAction) {
            return (
              <View
                key={route.key}
                style={styles.actionSlot}
                pointerEvents="box-none"
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={focused ? { selected: true } : {}}
                  onPress={onPress}
                  style={[styles.action, focused && styles.actionActive]}
                >
                  {options.tabBarIcon?.({
                    focused,
                    color: colors.onPrimary,
                    size: 0,
                  })}
                </Pressable>
              </View>
            );
          }

          const tint = focused ? colors.primary : colors.textMuted;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.item}
            >
              {options.tabBarIcon?.({ focused, color: tint, size: 0 })}
              <Text style={[styles.label, { color: tint }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
