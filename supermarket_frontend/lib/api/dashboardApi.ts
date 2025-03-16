import { baseApi } from "./baseApi";
import { Category } from "@/types/Categories";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => "/dashboard/",
      providesTags: ["Order"], 
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
