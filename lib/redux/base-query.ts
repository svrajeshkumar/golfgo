import { FetchBaseQueryArgs } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { getSession } from "next-auth/react";

interface BaseQueryProps {
  fetchBaseQueryArgs?: FetchBaseQueryArgs | undefined;
}

// const addTokenToRequest = async (headers: any, { getState }: any) => {
//   const session: any = await getSession();
//   headers.set("Accept", "application/json");
//   headers.set("Authorization", `Bearer ${session.user.token}`);
//   headers.set("x-db-token", session.user.clientId);
//   return headers;
// };

const baseQuery = ({ fetchBaseQueryArgs }: BaseQueryProps) => {
  return fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    
    ...fetchBaseQueryArgs,
  });
};

export default baseQuery;
