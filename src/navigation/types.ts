import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

/** Root stack: Splash boots the app, Main hosts the tabs, Cart is the
 *  checkout takeover (the only surface without tab bar / FAB). */
export type RootStackParamList = {
  Splash: undefined;
  Main: NavigatorScreenParams<RootTabParamList> | undefined;
  Cart: undefined;
};

/** Stack nested in the Home tab so detail keeps the tab bar and FAB. */
export type HomeStackParamList = {
  HomeMain: undefined;
  ProductDetail: { productId: string };
};

/** Bottom-tab routes. Cart is a FAB, not a tab; no auth/profile. */
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Search: undefined;
  Invoices: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

declare global {
  // Types useNavigation/navigationRef against our routes app-wide.
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
