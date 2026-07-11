import { apiClient } from '@lib/services/api';
import { mapApiProduct } from './productsMapper';
import type { ApiProduct, Product } from './types';

/**
 * Typed products client. Errors propagate as the base client's typed
 * ApiError (non-2xx) / NetworkError (network failure or timeout).
 */
export const productsService = {
  fetchProducts: async (): Promise<Product[]> => {
    const products = await apiClient.get<ApiProduct[]>('/products');
    return products.map(mapApiProduct);
  },
};
