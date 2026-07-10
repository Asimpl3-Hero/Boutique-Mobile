import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Cross-cutting UI state (app readiness, global flags).
 * Domain slices (products, cart, ...) are added by their own tasks.
 */
export interface UiState {
  /** True once the bootstrap (fonts, initial data) has finished. */
  appReady: boolean;
}

const initialState: UiState = {
  appReady: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAppReady(state, action: PayloadAction<boolean>) {
      state.appReady = action.payload;
    },
  },
});

export const { setAppReady } = uiSlice.actions;

export const selectAppReady = (state: { ui: UiState }): boolean =>
  state.ui.appReady;

export default uiSlice.reducer;
