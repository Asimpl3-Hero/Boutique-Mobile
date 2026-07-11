import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

/** Root stack: Splash boots the app, Main hosts the bottom tabs. */
export type RootStackParamList = {
  Splash: undefined;
  Main: NavigatorScreenParams<RootTabParamList> | undefined;
  ProductDetail: { productId: string };
};

/** Bottom-tab routes. Cart is a FAB (mobile-05), not a tab; no auth/profile. */
export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Invoices: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

declare global {
  // Types useNavigation/navigationRef against our routes app-wide.
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
