import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";

const providers = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
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

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
  events: {
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
