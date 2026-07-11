import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InvoiceDetailScreen, InvoicesScreen } from '@screens';
import type { InvoicesStackParamList } from './types';

const Stack = createNativeStackNavigator<InvoicesStackParamList>();

/** Invoices tab stack: purchase history plus the invoice render. */
export const InvoicesStack = () => (
  <Stack.Navigator
    initialRouteName="InvoicesMain"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="InvoicesMain" component={InvoicesScreen} />
    <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
  </Stack.Navigator>
);
