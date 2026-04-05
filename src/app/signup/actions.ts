"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/auth";
import prisma from "@/lib/prisma";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().trim().email(),
  password: z.string().min(8, "Use at least 8 characters."),
});

export type SignUpState = { error?: string; ok?: boolean };

export async function signUp(_prev: SignUpState, formData: FormData): Promise<SignUpState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name") ?? undefined,
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { name, email, password } = parsed.data;
  const normalized = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.create({
    data: {
      email: normalized,
      name: name.trim(),
      passwordHash,
      profile: {
        create: {
          onboardingComplete: false,
          languages: [],
          interests: [],
          communityPrefs: [],
        },
      },
    },
  });

  try {
    await signIn("credentials", {
      email: normalized,
      password,
      redirectTo: "/onboarding",
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return {
        error:
          "Account created, but automatic sign-in failed. Please sign in manually.",
      };
    }
    throw e;
  }

  return { ok: true };
}
