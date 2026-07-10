import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FloatingTabBar } from '@components/layout';
import { HomeIcon, ReceiptIcon, SearchIcon } from '@components/ui';
import { HomeScreen, InvoicesScreen, SearchScreen } from '@screens';
import { moderateScale } from '@theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const ICON_SIZE = moderateScale(24);
const ACTION_ICON_SIZE = moderateScale(28);

export const RootNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false }}
    tabBar={props => <FloatingTabBar {...props} actionRoute="Search" />}
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
          <SearchIcon size={ACTION_ICON_SIZE} color={color} strokeWidth={2.2} />
        ),
      }}
    />
    <Tab.Screen
      name="Invoices"
      component={InvoicesScreen}
      options={{
        title: 'Facturas',
        tabBarIcon: ({ color }) => (
          <ReceiptIcon size={ICON_SIZE} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);
