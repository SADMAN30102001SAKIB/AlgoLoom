import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain:
          process.env.NODE_ENV === "production"
            ? "algoloom.sadman.me"
            : undefined,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain:
          process.env.NODE_ENV === "production"
            ? "algoloom.sadman.me"
            : undefined,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain:
          process.env.NODE_ENV === "production"
            ? "algoloom.sadman.me"
            : undefined,
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback called with:", {
        user: !!user,
        account: !!account,
      });
      // For OAuth providers, ensure user exists in database
      if (account?.provider === "google" || account?.provider === "github") {
        console.log("OAuth signIn for provider:", account.provider);
        if (!user.email) {
          console.log("No email provided for OAuth");
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          console.log("Creating new OAuth user for:", user.email);
          // Create new user for OAuth login
          const username =
            user.email!.split("@")[0] + Math.floor(Math.random() * 1000);

          await prisma.user.create({
            data: {
              email: user.email!,
              username: username,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              role: "USER",
            },
          });
        } else {
          console.log("Existing OAuth user found:", existingUser.id);
        }
      } else {
        console.log("Credentials signIn - user:", user?.email);
      }
      console.log("SignIn result: true");
      return true;
    },
    async jwt({ token, user }) {
      console.log("JWT callback called with:", {
        token: !!token,
        user: !!user,
      });
      if (user?.id) {
        console.log("Setting user ID in token:", user.id);
        token.id = user.id;
        token.role = user.role;
      }
      // For OAuth, fetch user from database if not set
      if (!token.id && token.email) {
        console.log("Fetching user from DB for email:", token.email);
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser) {
          console.log("Found user in DB:", dbUser.id);
          token.id = dbUser.id;
          token.role = dbUser.role;
        } else {
          console.log("User not found in DB");
        }
      }
      console.log("Final token:", {
        id: token.id,
        email: token.email,
        role: token.role,
      });
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback called with:", {
        session: !!session,
        token: !!token,
      });
      if (session.user) {
        console.log("Setting session user ID:", token.id);
        session.user.id = token.id;
        session.user.role = token.role;
      }
      console.log("Final session:", { user: session.user });
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
