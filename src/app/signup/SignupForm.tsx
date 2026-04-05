"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "./actions";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, {});

  if (state.ok) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <p className="text-sm text-zinc-700">Account created. You can sign in now.</p>
        <Link
          href="/signin"
          className="inline-block rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-3">
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <input
        name="name"
        type="text"
        required
        autoComplete="name"
        placeholder="Full name"
        className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm"
      />
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm"
      />
      <input
        name="password"
        type="password"
        required
        autoComplete="new-password"
        placeholder="Password (min 8 characters)"
        minLength={8}
        className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
