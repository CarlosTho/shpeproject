import Image from "next/image";
import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { requireAppAccess } from "@/lib/auth-guards";

export default async function DashboardPage() {
  const session = await requireAppAccess("/dashboard");

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col gap-8 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">
          You are signed in. Next: profile, opportunities, and community pages.
        </p>
      </div>

      {session?.user ? (
        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt=""
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-600">
              {(session.user.name ?? session.user.email ?? "?")
                .slice(0, 1)
                .toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-zinc-900">
              {session.user.name ?? "Member"}
            </p>
            <p className="truncate text-sm text-zinc-500">
              {session.user.email}
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              id: {session.user.id}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <form action={signOutAction}>
          <input type="hidden" name="callbackUrl" value="/signin" />
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
          >
            Sign out
          </button>
        </form>
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
