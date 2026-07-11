import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productsService, type Product } from '@lib/services/products';

export type ProductsStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProductsState {
  items: Product[];
  status: ProductsStatus;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

/** Loads the catalog from the backend through the products service. */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => productsService.fetchProducts(),
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load products';
      });
  },
});

interface WithProducts {
  products: ProductsState;
}

export const selectProducts = (state: WithProducts): Product[] =>
  state.products.items;
export const selectProductsStatus = (state: WithProducts): ProductsStatus =>
  state.products.status;
export const selectProductsError = (state: WithProducts): string | null =>
  state.products.error;

export const selectProductById = (
  state: WithProducts,
  productId: string,
): Product | undefined =>
  state.products.items.find(product => product.id === productId);

export default productsSlice.reducer;
