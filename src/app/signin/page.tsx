import Link from "next/link";
import { Suspense } from "react";
import { CredentialsForm } from "./CredentialsForm";
import { OAuthSection } from "./OAuthSection";

export default function SignInPage() {
  const hasGoogle = !!process.env.AUTH_GOOGLE_ID;
  const hasGitHub = !!process.env.AUTH_GITHUB_ID;

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="w-full max-w-sm space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Sign in
        </h1>
        <p className="text-sm text-zinc-600">
          Email and password, or connect with GitHub / Google when configured.
        </p>
      </div>

      <Suspense fallback={<div className="h-40 w-full max-w-sm animate-pulse rounded-lg bg-zinc-100" />}>
        <CredentialsForm />
      </Suspense>

      <p className="text-sm text-zinc-600">
        No account?{" "}
        <Link
          href="/signup"
          className="font-medium text-zinc-900 underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>

      <Suspense fallback={null}>
        <OAuthSection hasGitHub={hasGitHub} hasGoogle={hasGoogle} />
      </Suspense>

      <Link
        href="/"
        className="text-sm text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
