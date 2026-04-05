"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { safeAuthRedirectPath } from "@/lib/auth-redirect";

function redirectToFromForm(formData: FormData, fallback: string) {
  return safeAuthRedirectPath(formData.get("callbackUrl"), fallback);
}

export async function signInWithProvider(formData: FormData) {
  const provider = formData.get("provider");
  if (provider !== "google" && provider !== "github") {
    throw new Error("Invalid provider");
  }
  const redirectTo = redirectToFromForm(formData, "/home");
  await signIn(provider, { redirectTo });
}

export type CredentialsSignInState = { error?: string };

export async function signInWithCredentials(
  _prev: CredentialsSignInState,
  formData: FormData,
): Promise<CredentialsSignInState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Email and password are required." };
  }
  const redirectTo = redirectToFromForm(formData, "/home");
  try {
    await signIn("credentials", {
      email: email.trim(),
      password,
      redirectTo,
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw e;
  }
  return {};
}
