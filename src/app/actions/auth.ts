"use server";

import { signOut } from "@/auth";

/**
 * Ends the session and redirects. Pass `callbackUrl` as a hidden form field
 * (must start with `/`) to override the default `/signin`.
 */
export async function signOutAction(formData?: FormData) {
  let redirectTo = "/signin";
  if (formData) {
    const raw = formData.get("callbackUrl");
    if (
      typeof raw === "string" &&
      raw.startsWith("/") &&
      !raw.startsWith("//")
    ) {
      redirectTo = raw;
    }
  }
  await signOut({ redirectTo });
}
