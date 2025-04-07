import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./lib/auth-config/authConfig";
import { login, updateToken } from "./lib/redux/actions/actions";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials:any) {
        const { username, password } = credentials;
        try {
          const response: any = await login({
            username: username as string,
            password: password as string,
          });
          if (response?.status === "failure") {
            return null;
          }
          return {
            id: response?.data?.data?.admin?._id,
            role: response?.data?.data?.admin?.role,
            username: response?.data?.data?.admin?.username,
            email: response?.data?.data?.admin?.username,
            name: response?.data?.data?.admin?.name,
            token: response?.data?.data?.token,
            clientId: response?.data?.data?.clientId,
            clientData: response?.data?.data?.clientData,
          } as User;
        } catch (error) {
          return new Error(error as any);
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token = updateToken(token, user);
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token?.id as string;
        session.user.name = token?.name as string;
        session.user.token = token?.token as string;
        session.user.email = token?.email as string;
        session.user.role = token?.role as string;
        session.user.username = token?.username as string;
        session.user.clientId = token?.clientId as string;
        session.user.clientData = token?.clientData as any;

      }
      return Promise.resolve(session);
    },
  },
});
