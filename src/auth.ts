import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
                port: Number(process.env.EMAIL_SERVER_PORT) || 587,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM || "noreply@polymerit.app",
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        verifyRequest: "/auth/verify",
        error: "/auth/error",
    },
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    trustHost: true,
});
