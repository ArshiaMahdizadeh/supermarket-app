import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/admin/users/',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/users/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation: useAdminUpdateUserMutation,
  useDeleteUserMutation,
} = adminApi;