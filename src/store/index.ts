import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';

/**
 * Global store (Redux Toolkit, Flux architecture).
 * One slice per domain under store/slices/; domain slices are registered
 * here as their tasks land (products/cart in mobile-03+).
 */
export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './hooks';
export * from './slices/uiSlice';
