
import { baseApi } from './baseApi';
import { Category } from '@/types/Categories';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories/',
      providesTags: ['Category'],
    }),
    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `/categories/${slug}/`,
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
} = categoryApi;