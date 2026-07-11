import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/** Imperative navigation from outside React components (services, thunks). */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
