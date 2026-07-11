import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CategoryScreen, HomeScreen, ProductDetailScreen } from '@screens';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

/** Home tab stack: catalog plus product detail, both under the tab bar. */
export const HomeStack = () => (
  <Stack.Navigator
    initialRouteName="HomeMain"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Category" component={CategoryScreen} />
  </Stack.Navigator>
);
