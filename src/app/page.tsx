import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Caveat, Playfair_Display } from "next/font/google";
import { ArrowRight } from "lucide-react";
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
  const signedIn = Boolean(session?.user?.id);

  return (
    <div className="flex min-h-full flex-col bg-[#060c12] text-slate-100">
      {/* Header */}
      <header className="border-b border-white/[0.05]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white"
          >
            <span
              className="flex size-8 items-center justify-center rounded-[7px] bg-amber-400 text-[11px] font-bold text-[#060c12]"
              aria-hidden
            >
              P
            </span>
            Prometeo
          </Link>
          <nav className="flex items-center gap-2" aria-label="Auth">
            <Link
              href="/signin"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#060c12] transition-colors hover:bg-zinc-100"
            >
              Sign up
            </Link>
          </nav>
        </div>

        {signedIn && (
          <div className="border-b border-teal-500/20 bg-teal-950/40 px-4 py-2 text-center text-xs text-teal-200/80">
            Active session —{" "}
            <Link
              href="/home"
              className="font-semibold text-amber-300 underline-offset-2 hover:underline"
            >
              Open app
            </Link>
            <span className="mx-2 text-teal-700" aria-hidden>
              ·
            </span>
            <form action={signOutAction} className="inline">
              <input type="hidden" name="callbackUrl" value="/" />
              <button
                type="submit"
                className="font-semibold text-amber-300 underline-offset-2 hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col">
        <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-24">
          {/* Copy */}
          <div className="order-1 flex flex-col lg:order-2">
            {/* Eyebrow */}
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400">
              <span className="size-1.5 rounded-full bg-teal-400" aria-hidden />
              Built for the Latino community
            </div>

            <h1
              className={`${display.className} text-[2.1rem] leading-[1.14] tracking-tight text-white sm:text-[2.8rem] sm:leading-[1.1] lg:text-[2.5rem] xl:text-[3.2rem]`}
            >
              Helping Latinos{" "}
              <span
                className={`${script.className} text-[1.1em] text-teal-400`}
              >
                connect
              </span>
              ,{" "}
              <span
                className={`${script.className} text-[1.1em] text-teal-400`}
              >
                grow
              </span>
              , and get{" "}
              <span
                className={`${script.className} text-[1.1em] text-teal-400`}
              >
                hired
              </span>{" "}
              — together.
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-zinc-400">
              One place for opportunities, events, peer support, and tools
              built for Latinos and their careers.
            </p>

            <div className="mt-8 flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-[#060c12] shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 hover:shadow-amber-300/30"
                >
                  Create account
                  <ArrowRight className="size-4" strokeWidth={2.5} />
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Log in
                </Link>
              </div>
              <p className="text-xs text-zinc-600">
                Free forever for community members.
              </p>
            </div>
          </div>

          {/* Visual panel */}
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.07] lg:max-w-none lg:mx-0">
              {/* Base gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(145deg, #0a1628 0%, #060c12 60%, #0d1f2d 100%)",
                }}
                aria-hidden
              />
              {/* Teal glow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(20,184,166,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(20,184,166,0.07) 0%, transparent 50%)",
                }}
                aria-hidden
              />
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
                aria-hidden
              />

              {/* Floating stats cards */}
              <div className="absolute inset-0 flex flex-col justify-center gap-3 p-8">
                {[
                  { label: "Internships listed", value: "2,400+", up: true },
                  { label: "Scholarships", value: "180+", up: true },
                  { label: "Community members", value: "12.4k", up: true },
                ].map((card, i) => (
                  <div
                    key={card.label}
                    className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 backdrop-blur-sm"
                    style={{
                      transform: `translateX(${i % 2 === 0 ? "0" : "12px"})`,
                    }}
                  >
                    <p className="text-[11px] font-medium text-zinc-500">
                      {card.label}
                    </p>
                    <p className="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-white">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom tagline */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 p-6">
                <p
                  className={`${display.className} text-lg font-medium leading-snug text-white/80`}
                >
                  Your community.
                  <br />
                  Your momentum.
                </p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-teal-400/70">
                  Prometeo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/[0.05] py-7">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
                Opportunities · Events · Peer support
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-teal-400 transition-colors hover:text-teal-300"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
