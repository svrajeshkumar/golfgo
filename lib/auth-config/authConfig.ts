import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
    pages: {
        signIn: "/auth/signin",
    },
    providers: [],
} satisfies NextAuthConfig;
