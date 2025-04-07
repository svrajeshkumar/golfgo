import NextAuth, { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role?: string;
    name?: string;
    username?: string;
    token?: string;
    clientId?: string;
    clientData?: any;
    email?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      name?: string;
      username?: string;
      token?: string;
      clientId?: string;
      clientData?: any;
      email?: string;
    };
  }
}
