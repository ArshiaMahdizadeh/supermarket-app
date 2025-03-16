import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ['User', 'Product', 'Order', 'Cart', 'Wishlist','Category','DeliveryTimes'],
});