import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Caveat, Playfair_Display } from "next/font/google";
import { auth } from "@/auth";
import { signOutAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

const display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const script = Caveat({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});

export default async function Home() {
  noStore();
  const session = await auth();
  /** Require stable user id — avoids treating empty/partial session as signed-in. */
  const signedIn = Boolean(session?.user?.id);

  return (
    <div className="flex min-h-full flex-col bg-[#050b10] text-slate-100">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
          >
            <span
              className="flex size-9 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-[#050b10]"
              aria-hidden
            >
              P
            </span>
            Prometeo
          </Link>
          <nav
            className="flex flex-wrap items-center justify-end gap-2 sm:gap-3"
            aria-label="Sign up or log in"
          >
            <Link
              href="/signin"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-[#050b10] shadow-sm transition hover:bg-amber-300"
            >
              Create account
            </Link>
          </nav>
        </div>
        {signedIn ? (
          <div className="border-b border-teal-500/25 bg-teal-950/50 px-4 py-2.5 text-center text-xs leading-relaxed text-teal-100/95 sm:text-sm">
            <span className="text-teal-200/80">
              You still have an active session from before.{" "}
            </span>
            <Link
              href="/home"
              className="font-semibold text-amber-300 underline-offset-2 hover:text-amber-200 hover:underline"
            >
              Open app
            </Link>
            <span className="text-teal-200/60"> · </span>
            <form action={signOutAction} className="inline">
              <input type="hidden" name="callbackUrl" value="/" />
              <button
                type="submit"
                className="font-semibold text-amber-300 underline-offset-2 hover:text-amber-200 hover:underline"
              >
                Sign out
              </button>
            </form>
            <span className="hidden text-teal-200/70 sm:inline">
              {" "}
              — sign out to create another account or start fresh.
            </span>
          </div>
        ) : null}
      </header>

      <main className="flex flex-1 flex-col">
        <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-20">
          {/* Copy — first on mobile */}
          <div className="order-1 flex flex-col justify-center lg:order-2 lg:pl-4">
            <h1
              className={`${display.className} text-[2rem] leading-[1.15] tracking-tight text-white sm:text-5xl sm:leading-[1.1] lg:text-[2.75rem] xl:text-6xl`}
            >
              Helping Latinos{" "}
              <span className={`${script.className} text-[1.15em] font-semibold text-teal-400`}>
                connect
              </span>
              ,{" "}
              <span className={`${script.className} text-[1.15em] font-semibold text-teal-400`}>
                grow
              </span>
              , and get{" "}
              <span className={`${script.className} text-[1.15em] font-semibold text-teal-400`}>
                hired
              </span>{" "}
              — together.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400 sm:text-lg">
              One place for opportunities, events, peer support, and tools built
              for Latinos and their careers. New here? Create your account, set
              up your PUENTE profile, then jump into the app.
            </p>
            <div className="mt-10 flex flex-col gap-4">
              <p className="text-xs font-medium uppercase tracking-wider text-teal-400/80">
                Get started
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-amber-400 px-7 py-3 text-sm font-semibold text-[#050b10] shadow-lg shadow-amber-400/15 transition hover:bg-amber-300"
                >
                  Create account
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  Log in
                </Link>
              </div>
              <p className="max-w-md text-xs text-slate-500">
                After you sign up, we take you through{" "}
                <span className="text-slate-400">profile setup</span> (school,
                background, goals, scholarships). Then you land on your home
                feed with picks matched to your profile.
              </p>
            </div>
          </div>

          {/* Visual panel */}
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/50 shadow-2xl shadow-black/40 lg:max-w-none lg:mx-0">
              <div
                className="absolute inset-0 bg-gradient-to-br from-teal-950/80 via-[#0a1628] to-slate-950"
                aria-hidden
              />
              <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 30%, rgb(45 212 191 / 0.25) 0%, transparent 45%),
                    radial-gradient(circle at 80% 70%, rgb(20 184 166 / 0.2) 0%, transparent 40%),
                    linear-gradient(180deg, transparent 0%, rgb(5 11 16 / 0.9) 100%)`,
                }}
                aria-hidden
              />
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
                aria-hidden
              />
              <div className="relative flex h-full flex-col justify-end p-8 sm:p-10">
                <p className={`${display.className} text-2xl font-medium leading-snug text-white/95`}>
                  Your community. Your momentum.
                </p>
                <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-teal-400/90">
                  Prometeo
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] py-8">
          <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
            Opportunities · Events · Peer support
          </p>
          <p className="mt-4 text-center text-sm text-slate-500">
            <Link
              href="/signin"
              className="font-medium text-teal-400/90 underline-offset-4 hover:text-teal-300 hover:underline"
            >
              Log in
            </Link>
            <span className="mx-2 text-slate-600" aria-hidden>
              ·
            </span>
            <Link
              href="/signup"
              className="font-medium text-teal-400/90 underline-offset-4 hover:text-teal-300 hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
