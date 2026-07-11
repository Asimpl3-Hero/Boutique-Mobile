import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@lib/services/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /** Adds one unit of the product (new entry or +1 on the existing one). */
    addItem(state, action: PayloadAction<Product>) {
      const entry = state.items.find(i => i.product.id === action.payload.id);
      if (entry) {
        entry.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    /** Removes one unit; drops the entry when the last unit goes. */
    removeItem(state, action: PayloadAction<string>) {
      const entry = state.items.find(i => i.product.id === action.payload);
      if (!entry) {
        return;
      }
      if (entry.quantity > 1) {
        entry.quantity -= 1;
      } else {
        state.items = state.items.filter(
          i => i.product.id !== action.payload,
        );
      }
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clear } = cartSlice.actions;

interface WithCart {
  cart: CartState;
}

export const selectCartItems = (state: WithCart): CartItem[] =>
  state.cart.items;

/** Total number of units across all entries (FAB badge). */
export const selectCartCount = (state: WithCart): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

/** Cart total in cents (formatting happens at the edge with formatPrice). */
export const selectCartTotal = (state: WithCart): number =>
  state.cart.items.reduce(
    (sum, item) => sum + item.product.priceInCents * item.quantity,
    0,
  );

export default cartSlice.reducer;
