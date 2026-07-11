import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FloatingTabBar } from '@components/layout';
import { SearchOverlay } from '@components/features';
import { HomeIcon, ReceiptIcon, SearchIcon } from '@components/ui';
import { HomeScreen, InvoicesScreen } from '@screens';
import { moderateScale } from '@theme';
import { navigationRef } from './navigationRef';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const ICON_SIZE = moderateScale(24);

/** The Search tab never navigates (tabPress opens the overlay), but the
 *  navigator still requires a component for the route. */
const SearchFallback = () => null;
const ACTION_ICON_SIZE = moderateScale(28);

export const MainTabs = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
        tabBar={props => <FloatingTabBar {...props} actionRoute="Search" />}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => (
              <HomeIcon size={ICON_SIZE} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchFallback}
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color }) => (
              <SearchIcon
                size={ACTION_ICON_SIZE}
                color={color}
                strokeWidth={2.2}
              />
            ),
          }}
          listeners={{
            // Search is a takeover overlay, not a destination.
            tabPress: event => {
              event.preventDefault();
              setSearchOpen(true);
            },
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
      <SearchOverlay
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={productId => {
          if (navigationRef.isReady()) {
            navigationRef.navigate('ProductDetail', { productId });
          }
        }}
      />
    </>
  );
};
