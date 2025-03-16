import { baseApi } from './baseApi';

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => '/wishlist/',
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: '/wishlist/add/',
        method: 'POST',
        body: { product_id: productId },
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: '/wishlist/remove/',
        method: 'DELETE',
        body: { product_id: productId },
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;