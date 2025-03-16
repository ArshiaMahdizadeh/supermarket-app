import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/signup/',
        method: 'POST',
        body: credentials,
      }),
    }),

    
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: '/verify-email/',
        method: 'POST',
        body: data,
      }),
    }),

    
    resendVerificationEmail: builder.mutation({
      query: (email) => ({
        url: '/resend-verification-email/',
        method: 'POST',
        body: { email },
      }),
    }),

    
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/token/refresh/',
        method: 'POST',
        body: { refresh: refreshToken },
      }),
    }),

    
    getUser: builder.query({
      query: () => '/account/',
      providesTags: ['User'],
    }),

    
    updateUser: builder.mutation({
      query: (data) => ({
        url: '/account/',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    
    deleteUser: builder.mutation({
      query: () => ({
        url: '/account/delete/',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/account/change-password/',
        method: 'POST',
        body: data,
      }),
    }),

    
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/reset-password/',
        method: 'POST',
        body: data,
      }),
    }),


    resetPasswordRequest: builder.mutation({
      query: (email) => ({
        url: '/reset-password-request/',
        method: 'POST',
        body: { email },
      }),
    }),

    
    resetPasswordConfirm: builder.mutation({
      query: (data) => ({
        url: '/reset-password-confirm/',
        method: 'POST',
        body: data,
      }),
    }),



    
    checkEmail: builder.mutation({
      query: (email) => ({
        url: '/check-email/',
        method: 'POST',
        body: { email },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/logout/',
        method: 'POST',
      }),
      invalidatesTags: ['User'], 
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useCheckEmailMutation,
  useLogoutMutation ,
  useResetPasswordRequestMutation,
  useResetPasswordConfirmMutation,
} = authApi;