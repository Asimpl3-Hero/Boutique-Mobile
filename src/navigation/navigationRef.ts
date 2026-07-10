import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootTabParamList } from './types';

/** Imperative navigation from outside React components (services, thunks). */
export const navigationRef = createNavigationContainerRef<RootTabParamList>();
