import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/orders/",
      providesTags: ["Order"],
    }),

    getOrder: builder.query({
      query: (id) => `/orders/${id}/`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    checkout: builder.mutation({
      query: (data) => ({
        url: "/orders/checkout/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    getAllOrders: builder.query({
      query: () => "/admin/orders/",
      providesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/orders/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),

    getDeliveryTimes: builder.query({
      query: () => "/delivery-times/",
      providesTags: ["DeliveryTimes"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,

  useCheckoutMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetDeliveryTimesQuery,
} = orderApi;
