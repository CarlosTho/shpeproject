"use client";

import { useSearchParams } from "next/navigation";
import { safeAuthRedirectPath } from "@/lib/auth-redirect";
import { signInWithProvider } from "./actions";

type OAuthSectionProps = {
  hasGitHub: boolean;
  hasGoogle: boolean;
};

export function OAuthSection({ hasGitHub, hasGoogle }: OAuthSectionProps) {
  const searchParams = useSearchParams();
  const callbackUrl = safeAuthRedirectPath(
    searchParams.get("callbackUrl"),
    "/home",
  );

  if (!hasGitHub && !hasGoogle) {
    return null;
  }

  return (
    <>
      <div className="flex w-full max-w-sm items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3">
        {hasGitHub ? (
          <form action={signInWithProvider}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <input type="hidden" name="provider" value="github" />
            <button
              type="submit"
              className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              Continue with GitHub
            </button>
          </form>
        ) : null}
        {hasGoogle ? (
          <form action={signInWithProvider}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <input type="hidden" name="provider" value="google" />
            <button
              type="submit"
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
            >
              Continue with Google
            </button>
          </form>
        ) : null}
      </div>
    </>
  );
}
