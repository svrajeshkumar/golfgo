import { API_ROUTES } from "../../routes/api";
import baseQuery from "../base-query";
import {
  GetAllGolfCourseParams,
  GetAllGolfCourseResponseType,
  GetGolfCourseByPlaceIdParams,
  GetGolfCourseByPlaceIdResponseType,
  GetHolesResponseType,
  GetWeatherParams,
  GetWeatherResponseType,
} from "../../typescript/type";
import { createApi } from "@reduxjs/toolkit/query/react";
export const golfCourseApi = createApi({
  reducerPath: "golfCourseApi",
  baseQuery: baseQuery({}),
  tagTypes: ["getAllGolfCourses"],
  endpoints: (builder) => ({
    getAllGolfCourses: builder.query<
      GetAllGolfCourseResponseType,
      GetAllGolfCourseParams
    >({
      providesTags: ["getAllGolfCourses"],
      query: ({ latitude, longitude, miles, kilometers, search }) => {
        return {
          url: API_ROUTES.FETCH_GOLF_COURSES,
          params: {
            latitude,
            longitude,
            miles,
            kilometers,
            ...(search && {
              search,
            }),
          },
        };
      },
    }),
    getGolfCourseByPlaceIdApi: builder.query<
      GetGolfCourseByPlaceIdResponseType,
      GetGolfCourseByPlaceIdParams
    >({
      query: ({ place_id }) => {
        return {
          url: `${API_ROUTES.FETCH_GOLF_COURSES_BY_PLACE_ID}/${place_id}`,
        };
      },
    }),
    getWeatherApi: builder.query<GetWeatherResponseType, GetWeatherParams>({
      query: ({ coordinates }) => {
        return {
          url: API_ROUTES.FETCH_WEATHER,
          method: "POST",
          body: {
            coordinates: {
              latitude: 30.1990251,
              longitude: -81.394832,
            },
          },
        };
      },
    }),
    saveGolfSession: builder.mutation<
      any,
      {
        userId: string;
        golfCourseCoordinates: { latitude: number; longitude: number };
        sessionType: string;
        courseName: string;
        par: number;
        yards: number;
        placeId: string;
        holeId: string;
      }
    >({
      query: (body) => {
        return {
          url: `${API_ROUTES.SAVE_GOLF_SESSION}`,
          method: "POST",
          body,
        };
      },
    }),

    saveGolfSessionShot: builder.mutation<
      any,
      {
        sessionId: string;
        payload: {
          shotType: string;
          image: {
            filename: string;
            fileKey: string;
          };
          clubType: string;
          distance: number;
          proximity: number;
          notes: string;
          coordinates: {
            latitude: number;
            longitude: number;
          };
          startPointCoordinates: {
            x: number;
            y: number;
          };
          endPointCoordinates: {
            x: number;
            y: number;
          };
          estimatedDistance: number;
          placeId: string;
        };
      }
    >({
      query: ({ sessionId, payload }) => {
        return {
          url: `${API_ROUTES.SAVE_GOLF_SESSION_SHOT}/${sessionId}`,
          method: "POST",
          body: payload,
        };
      },
    }),

    getAiPrediction: builder.mutation<any, { golfSessionId: string }>({
      query: ({ golfSessionId }) => {
        return {
          url: `${API_ROUTES.GOLF_AI_PREDICTION}/${golfSessionId}`,
          method: "POST",
        };
      },
    }),
    getHolesDetails: builder.query<GetHolesResponseType, { placeId: string }>({
      query: ({ placeId }) => {
        return {
          url: `${API_ROUTES.GET_HOLES_DETAILS}/${placeId}`,
          method: "GET",
        };
      },
    }),
  }),
});
export const {
  useLazyGetAllGolfCoursesQuery,
  useLazyGetGolfCourseByPlaceIdApiQuery,
  useLazyGetWeatherApiQuery,
  useSaveGolfSessionMutation,
  useGetAiPredictionMutation,
  useLazyGetHolesDetailsQuery,
  useSaveGolfSessionShotMutation,
} = golfCourseApi;
