import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';

/**
 * Global store (Redux Toolkit, Flux architecture).
 * One slice per domain under store/slices/.
 */
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './hooks';
export * from './slices/uiSlice';
export * from './slices/productsSlice';
export * from './slices/cartSlice';
