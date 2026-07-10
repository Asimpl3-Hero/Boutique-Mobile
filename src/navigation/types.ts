import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/** Bottom-tab routes. Cart is a FAB (mobile-05), not a tab; no auth/profile. */
export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Invoices: undefined;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

declare global {
  // Types useNavigation/navigationRef against our routes app-wide.
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
