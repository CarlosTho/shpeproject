import { Suspense } from "react";
import { auth } from "@/auth";
import { PersonalizedPicks } from "@/components/home/personalized-picks";
import prisma from "@/lib/prisma";

function firstName(name: string | null | undefined) {
  if (!name?.trim()) return "there";
  return name.trim().split(/\s+/)[0] ?? "there";
}

function pseudoMemberNumber(id: string) {
  const n = id.replace(/\D/g, "");
  const slice = n.slice(0, 6).padEnd(6, "0");
  const v = Number.parseInt(slice, 10) % 90000;
  return String(10000 + v);
}

const leaderboard = [
  { name: "María G.", weeks: 172, hue: "from-teal-500 to-emerald-600" },
  { name: "Diego R.", weeks: 156, hue: "from-sky-500 to-blue-600" },
  { name: "Ana L.", weeks: 141, hue: "from-amber-400 to-orange-500" },
  { name: "Carlos M.", weeks: 128, hue: "from-violet-500 to-purple-600" },
  { name: "Sofía P.", weeks: 96, hue: "from-rose-400 to-pink-600" },
] as const;

const resources = [
  {
    title: "Career guides for Latinos",
    desc: "Interview prep, negotiation, and growth paths tailored to our community.",
    href: "/internship",
  },
  {
    title: "Chapters & community",
    desc: "Find local groups, events, and peer support near you.",
    href: "#",
  },
  {
    title: "YouTube & workshops",
    desc: "Talks, panels, and skill sessions you can watch anytime.",
    href: "#",
  },
  {
    title: "Scholarships & programs",
    desc: "Funding, fellowships, and accelerator-style opportunities.",
    href: "/scholarships",
  },
] as const;

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-lg text-teal-600 transition hover:bg-teal-50 hover:text-teal-700"
    >
      {children}
    </a>
  );
}

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;
  const greeting = firstName(user?.name);
  const memberNo = user?.id ? pseudoMemberNumber(user.id) : "—";

  let pathSubtitle: string | null = null;
  let isStudentAudience = false;
  if (user?.id) {
    const prof = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { audienceSegment: true, onboardingComplete: true },
    });
    isStudentAudience = prof?.audienceSegment === "student";
    if (prof?.onboardingComplete) {
      if (prof.audienceSegment === "student") {
        pathSubtitle =
          "Your space is tuned for school, internships, scholarships, and lighter career exploration.";
      } else if (prof.audienceSegment === "non_student") {
        pathSubtitle =
          "You’re on the career-transition track — structured plans and job-focused milestones come first.";
      }
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Hey, {greeting}! <span aria-hidden>👋</span>
      </h1>
      {pathSubtitle ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          {pathSubtitle}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-8">
          {isStudentAudience ? (
            <section className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm ring-1 ring-teal-100 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                Student path
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Internships, scholarships & career exploration
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                The full Career Path Generator is for members who aren&apos;t
                currently in school. Your home base is opportunities, funding,
                and lighter guidance while you&apos;re in class.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/internship"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  Browse opportunities
                </a>
                <a
                  href="/scholarships"
                  className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-teal-50"
                >
                  Scholarships
                </a>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm ring-1 ring-teal-100 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                Career Path Generator
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Pick careers → answer a few questions → get your roadmap
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Structured templates tuned to your experience, degree, and
                schedule — not a generic chat. Every step links to real people
                when you want help.
              </p>
              <a
                href="/career-path"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                Build my plan
              </a>
            </section>
          )}

          {user?.id ? (
            <Suspense
              fallback={
                <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
              }
            >
              <PersonalizedPicks userId={user.id} />
            </Suspense>
          ) : null}

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-900">This week</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-200">
                <span className="size-2 rounded-full bg-red-500" />
                Inactive
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Last 16 weeks</p>
            <div className="mt-4 grid grid-cols-8 gap-1.5 sm:gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md bg-red-400/90"
                  title="No activity"
                />
              ))}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Member #", value: memberNo },
              { label: "Community reach", value: "12.4k" },
              { label: "Events attended", value: "0" },
              { label: "Messages sent", value: "0" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Active streak leaderboard
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Members keeping consistent momentum
            </p>
            <ul className="mt-4 divide-y divide-slate-100">
              {leaderboard.map((row, idx) => (
                <li
                  key={row.name}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="w-5 text-center text-xs font-semibold text-slate-400">
                    {idx + 1}
                  </span>
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ${row.hue}`}
                  >
                    {row.name
                      .split(/\s+/)
                      .map((p) => p[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {row.name}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-700">
                    {row.weeks} wks
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Important resources
            </h2>
            <ul className="mt-4 space-y-4">
              {resources.map((r) => (
                <li key={r.title}>
                  <a
                    href={r.href}
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                  >
                    {r.title}
                  </a>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {r.desc}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Prometeo socials
            </h2>
            <div className="mt-4 flex flex-wrap gap-1">
              <SocialIcon label="LinkedIn" href="#">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Instagram" href="#">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="X" href="#">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="GitHub" href="#">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </SocialIcon>
              <SocialIcon label="YouTube" href="#">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </SocialIcon>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm ring-1 ring-teal-100">
            <h2 className="text-sm font-semibold text-slate-900">Prometeo store</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Rep the community—tees, stickers, and more. Coming soon.
            </p>
            <a
              href="#"
              className="mt-3 inline-flex text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Get notified →
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
