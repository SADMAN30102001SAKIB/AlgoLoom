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
          username: user.username,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
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
      // For OAuth providers, ensure user exists in database
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) {
          return false;
        }

        // Use upsert to avoid race conditions
        const username =
          user.email!.split("@")[0] + Math.floor(Math.random() * 1000);

        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            // Update last login info
            name: user.name,
            image: user.image,
            // Ensure OAuth users are always verified
            emailVerified: new Date(),
          },
          create: {
            email: user.email!,
            username: username,
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
            role: "USER",
          },
        });
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      // On initial sign-in, set user data
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.emailVerified = user.emailVerified;
      }
      // For OAuth or any signIn without user.id, fetch user from database
      else if (trigger === "signIn" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.emailVerified = dbUser.emailVerified;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.emailVerified = token.emailVerified ?? null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow same-origin absolute URLs
      if (new URL(url).origin === baseUrl) return url;
      // Default redirect will be handled by client-side based on role
      return `${baseUrl}/problems`;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
