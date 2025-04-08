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
    updateUser:builder.mutation<
    any,
    {
      userId:string;
      golfProfile: {
        playerType: {
          type: string;
          characteristics: string;
        };
        tournamentPrep: boolean;
        ballFlight: string;
        playStyle: string;
        dexterity: string;
      };
    }
 >({
    query: ({userId,golfProfile}) =>({
      url:`${API_ROUTES.UPDATE_USER}/${userId}`,
      method:"POST",
      body:golfProfile,
    })
 })
  }),
});
export const { useRegisterNewUserMutation, useLogInUserMutation, useUpdateUserMutation } = userApi;
