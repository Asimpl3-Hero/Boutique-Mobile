import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon, SearchIcon } from '@components/ui';
import { HomeScreen, SearchScreen } from '@screens';
import { colors, fontFamilies, moderateScale } from '@theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const ICON_SIZE = moderateScale(24);

export const RootNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
      },
      tabBarLabelStyle: {
        fontFamily: fontFamilies.medium,
        fontSize: moderateScale(12),
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color }) => <HomeIcon size={ICON_SIZE} color={color} />,
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <SearchIcon size={ICON_SIZE} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);
