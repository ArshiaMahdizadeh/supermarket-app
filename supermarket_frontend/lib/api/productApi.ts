import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getProducts: builder.query({
      query: (params) => ({
        url: '/products/',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    
    searchProducts: builder.query({
      query: (query) => ({
        url: '/products/search/',
        params: { q: query }, 
      }),
      providesTags: ['Product'], 
    }),


    lazysearchProducts: builder.query({
      query: (query) => ({
        url: '/products/search/',
        params: { q: query }, 
      }),
      providesTags: ['Product'], 
    }),
  }),
});


export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSearchProductsQuery, 
  useLazySearchProductsQuery,
} = productApi;