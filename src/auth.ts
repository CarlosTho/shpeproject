import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";

// Development bypass - set to true to skip authentication
const DEV_BYPASS_AUTH = true;

// Mock prisma for development bypass
const mockPrisma = {
  user: {
    findUnique: async () => null,
    create: async () => ({ id: 'mock-user', email: 'joeyjoey', name: 'Joey Test' }),
    deleteMany: async () => ({ count: 0 }),
  },
  profile: {
    findUnique: async () => ({ onboardingComplete: true }),
    upsert: async () => ({ id: 'mock-profile', onboardingComplete: true }),
  },
  $disconnect: async () => {},
};

const providers = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // In development bypass mode, always authorize
      if (DEV_BYPASS_AUTH && process.env.NODE_ENV === 'development') {
        return {
          id: 'dev-user-123',
          email: credentials?.email || 'joeyjoey',
          name: 'Joey Test User',
          image: null,
        };
      }

      const emailRaw = credentials?.email;
      const password = credentials?.password;
      if (!emailRaw || !password || typeof emailRaw !== "string") {
        return null;
      }
      const email = emailRaw.trim().toLowerCase();
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) {
        return null;
      }
      const ok = await compare(String(password), user.passwordHash);
      if (!ok) {
        return null;
      }
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
  ...(process.env.AUTH_GITHUB_ID
    ? [GitHub({ allowDangerousEmailAccountLinking: true })]
    : []),
  ...(process.env.AUTH_GOOGLE_ID
    ? [Google({ allowDangerousEmailAccountLinking: true })]
    : []),
];

export const { handlers, auth: nextAuth, signIn, signOut } = NextAuth({
  adapter: DEV_BYPASS_AUTH && process.env.NODE_ENV === 'development' 
    ? undefined 
    : PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: DEV_BYPASS_AUTH && process.env.NODE_ENV === 'development' ? {} : {
    createUser: async ({ user }) => {
      await prisma.profile.upsert({
        where: { userId: user.id! },
        create: {
          userId: user.id!,
          onboardingComplete: false,
          languages: [],
          interests: [],
          communityPrefs: [],
        },
        update: {},
      });
    },
  },
});

// Override auth function for development bypass
export const auth = async () => {
  if (DEV_BYPASS_AUTH && process.env.NODE_ENV === 'development') {
    return {
      user: {
        id: 'dev-user-123',
        email: 'joeyjoey',
        name: 'Joey Test User',
        image: null,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
  return nextAuth();
};
