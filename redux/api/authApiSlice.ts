import { LoginResponse } from "@/utilities/interfaces";
import { apiSlice } from "@/redux/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // login admin
    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: ({ email, password }) => ({
          url: "/user/login",
          method: "POST",
          body: { email, password },
        }),
      }
    ),

    // logout
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),

    // forgot password
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/user/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/user/reset-password/${token}`,
        method: "PATCH",
        body: { password },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
