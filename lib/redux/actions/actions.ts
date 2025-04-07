import { JWT } from "next-auth/jwt";
import axios from "axios";
import { User } from "next-auth";
import { API_ROUTES } from "../../routes/api";

export type loginApiParams = {
  username: string;
  password: string;
};

export const login = async ({ username, password }: loginApiParams) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${API_ROUTES.ADMIN_LOGIN}`,
      { username, password }
    );
    const data = response;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateToken = (token: JWT, user: User) => {
  if (token) {
    token.id = user.id;
    token.name = user?.name;
    token.email = user?.email;
    token.role = user?.role;
    token.token = user?.token;
    token.username = user?.username;
    token.clientData = user?.clientData;
    token.clientId = user?.clientId;
  }
  return token;
};
