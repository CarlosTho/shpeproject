"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { safeAuthRedirectPath } from "@/lib/auth-redirect";
import { signInWithCredentials } from "./actions";

export function CredentialsForm() {
  const searchParams = useSearchParams();
  const callbackUrl = safeAuthRedirectPath(
    searchParams.get("callbackUrl"),
    "/home",
  );
  const [state, formAction, pending] = useActionState(signInWithCredentials, {});

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-3">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <input
        name="email"
        type="text"
        required
        autoComplete="username"
        placeholder="you@example.edu"
        className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm"
      />
      <input
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Password"
        className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
