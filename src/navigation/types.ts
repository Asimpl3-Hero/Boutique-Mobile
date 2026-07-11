import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StoredTransaction } from '@lib/services/storage';

/** Root stack: Splash boots the app, Main hosts the tabs, Cart is the
 *  checkout takeover (the only surface without tab bar / FAB). */
export type RootStackParamList = {
  Splash: undefined;
  Main: NavigatorScreenParams<RootTabParamList> | undefined;
  Cart: undefined;
  /** Dev-only route (registered under __DEV__): loader states showcase. */
  StatusDemo: undefined;
};

/** Stack nested in the Home tab so detail keeps the tab bar and FAB. */
export type HomeStackParamList = {
  HomeMain: undefined;
  ProductDetail: { productId: string };
  Category: {
    title: string;
    /** Bundled image module id for the banner (photo tiles). */
    image?: number;
    /** Solid banner fallback when there is no photo. */
    backgroundColor?: string;
    underlineColor?: string;
  };
};

/** Stack nested in the Invoices tab: purchase list + invoice render. */
export type InvoicesStackParamList = {
  InvoicesMain: undefined;
  InvoiceDetail: { transaction: StoredTransaction };
};

/** Bottom-tab routes. Cart is a FAB, not a tab; no auth/profile. */
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Search: undefined;
  Invoices: NavigatorScreenParams<InvoicesStackParamList> | undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type InvoicesStackScreenProps<T extends keyof InvoicesStackParamList> =
  NativeStackScreenProps<InvoicesStackParamList, T>;

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

declare global {
  // Types useNavigation/navigationRef against our routes app-wide.
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
