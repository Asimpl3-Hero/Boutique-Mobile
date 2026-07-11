import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CheckoutScreen, ProductDetailScreen, SplashScreen } from '@screens';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Cart" component={CheckoutScreen} />
  </Stack.Navigator>
);
