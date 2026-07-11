import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';
import { FloatingTabBar } from '@components/layout';
import { CartFab, CartModal, SearchOverlay } from '@components/features';
import { HomeIcon, ReceiptIcon, SearchIcon } from '@components/ui';
import { InvoicesStack } from './InvoicesStack';
import { moderateScale } from '@theme';
import { HomeStack } from './HomeStack';
import { navigationRef } from './navigationRef';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const ICON_SIZE = moderateScale(24);
const ACTION_ICON_SIZE = moderateScale(28);

/** The Search tab never navigates (tabPress opens the overlay), but the
 *  navigator still requires a component for the route. */
const SearchFallback = () => null;

const openProductDetail = (productId: string) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Main', {
      screen: 'Home',
      params: { screen: 'ProductDetail', params: { productId } },
    });
  }
};

/** True when the Invoices tab is showing the invoice render — the one
 *  surface (besides checkout) that hides the tab bar and FAB. */
const isInvoiceDetailFocused = (tabState: {
  index: number;
  routes: { name: string; state?: unknown }[];
}): boolean => {
  const focusedTab = tabState.routes[tabState.index];
  if (focusedTab?.name !== 'Invoices' || !focusedTab.state) {
    return false;
  }
  const nested = focusedTab.state as {
    index?: number;
    routes?: { name: string }[];
  };
  const nestedRoute = nested.routes?.[nested.index ?? 0];
  return nestedRoute?.name === 'InvoiceDetail';
};

export const MainTabs = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Mirrors the tabBar's own hiding logic for the FAB (root → Main → tabs).
  const hideOverlays = useNavigationState(state => {
    const rootRoute = state.routes[state.index];
    if (rootRoute?.name !== 'Main' || !rootRoute.state) {
      return false;
    }
    return isInvoiceDetailFocused(
      rootRoute.state as {
        index: number;
        routes: { name: string; state?: unknown }[];
      },
    );
  });

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
        tabBar={props =>
          isInvoiceDetailFocused(props.state) ? null : (
            <FloatingTabBar {...props} actionRoute="Search" />
          )
        }
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
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
          component={InvoicesStack}
          options={{
            title: 'Facturas',
            tabBarIcon: ({ color }) => (
              <ReceiptIcon size={ICON_SIZE} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      {/* Overlays shared by every non-checkout surface. */}
      {hideOverlays ? null : <CartFab onPress={() => setCartOpen(true)} />}
      <SearchOverlay
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={openProductDetail}
      />
      <CartModal
        visible={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate('Cart');
          }
        }}
      />
    </>
  );
};
