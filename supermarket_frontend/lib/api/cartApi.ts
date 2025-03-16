import { baseApi } from './baseApi';
import { CartResponse } from '@/types/Categories';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => '/cart/',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<void, { product_id: number; set_quantity?: number }>({
      query: (data) => ({
        url: '/cart/add/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<void, number>({
      query: (cartItemId) => ({
        url: `/cart/remove/${cartItemId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<void, { cart_item_id: number; quantity: number }>({
      query: ({ cart_item_id, quantity }) => ({
        url: `/cart/update/${cart_item_id}/`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} = cartApi;