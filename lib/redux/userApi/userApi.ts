import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "../../routes/api";
import baseQuery from "../base-query";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery({}),
  endpoints: (builder) => ({
    registerNewUser: builder.mutation<
      any,
      {
        phoneNumber: string;
        countryCode: string;
        email: string;
        password: string;
      }
    >({
      query: (body) => {
        return {
          url: API_ROUTES.USER_SIGNUP,
          method: "POST",
          body,
        };
      },
    }),
    logInUser: builder.mutation<
      any,
      {
        input: string;
        password: string;
      }
    >({
      query: (body) => {
        return {
          url: API_ROUTES.USER_LOGIN,
          method: "POST",
          body,
        };
      },
    }),
  }),
});
export const { useRegisterNewUserMutation, useLogInUserMutation } = userApi;
