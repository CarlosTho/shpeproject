export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  Trophy,
  Users,
} from "lucide-react";
import { auth } from "@/auth";
import { PersonalizedPicks } from "@/components/home/personalized-picks";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

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
  { name: "María G.",  weeks: 172, initials: "MG", color: "bg-teal-600" },
  { name: "Diego R.",  weeks: 156, initials: "DR", color: "bg-blue-600" },
  { name: "Ana L.",    weeks: 141, initials: "AL", color: "bg-amber-500" },
  { name: "Carlos M.", weeks: 128, initials: "CM", color: "bg-violet-600" },
  { name: "Sofía P.",  weeks: 96,  initials: "SP", color: "bg-rose-500" },
] as const;

const resources = [
  {
    label: "Internships",
    desc: "Browse open roles filtered by field.",
    href: "/internship",
    icon: Briefcase,
  },
  {
    label: "Scholarships",
    desc: "Funding and fellowships for Latinos.",
    href: "/scholarships",
    icon: GraduationCap,
  },
  {
    label: "Community",
    desc: "Chapters, events, and peer support.",
    href: "/events",
    icon: Users,
  },
  {
    label: "Resources",
    desc: "Guides, workshops, and skill sessions.",
    href: "#",
    icon: BookOpen,
  },
] as const;

const socials = [
  {
    label: "LinkedIn",
    href: "#",
    svg: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    svg: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    svg: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    svg: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    svg: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
] as const;

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;
  const greeting = firstName(user?.name);
  const memberNo = user?.id ? pseudoMemberNumber(user.id) : "—";

  let isStudentAudience = false;
  let isNonStudent = false;
  let onboardingDone = false;

  if (user?.id) {
    const prof = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { audienceSegment: true, onboardingComplete: true },
    });
    isStudentAudience = prof?.audienceSegment === "student";
    isNonStudent = prof?.audienceSegment === "non_student";
    onboardingDone = prof?.onboardingComplete ?? false;
  }

  const stats = [
    { label: "Member no.", value: memberNo },
    { label: "Community", value: "12.4k" },
    { label: "Events", value: "0" },
    { label: "Messages", value: "0" },
  ];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      {/* Greeting */}
      <div className="animate-fade-up delay-0">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[1.75rem]">
          Hey, {greeting}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {isStudentAudience && onboardingDone
            ? "Student path — internships, scholarships, and community."
            : isNonStudent && onboardingDone
              ? "Career transition path — structured plans and job-focused milestones."
              : "Welcome to Prometeo. Set up your profile to get personalized picks."}
        </p>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-12 lg:gap-6">
        {/* ── Left column ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 lg:col-span-8">

          {/* CTA card */}
          <div className="animate-fade-up delay-100">
            {isStudentAudience ? (
              <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="flex items-start gap-4 p-5 sm:p-6">
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600">
                      Student path
                    </p>
                    <h2 className="mt-1.5 text-base font-semibold text-zinc-900 sm:text-lg">
                      Internships, scholarships & exploration
                    </h2>
                    <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-zinc-500">
                      Your home base for opportunities and funding while
                      you&apos;re in school. No generic advice — just what&apos;s
                      matched to your background.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <Link
                        href="/internship"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-teal-700"
                      >
                        Browse internships
                        <ArrowRight className="size-3.5" strokeWidth={2} />
                      </Link>
                      <Link
                        href="/scholarships"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-[13px] font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                      >
                        Scholarships
                      </Link>
                    </div>
                  </div>
                  <div
                    className="hidden shrink-0 items-center justify-center sm:flex"
                    aria-hidden
                  >
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                      <GraduationCap className="size-7" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="flex items-start gap-4 p-5 sm:p-6">
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600">
                      Career Path Generator
                    </p>
                    <h2 className="mt-1.5 text-base font-semibold text-zinc-900 sm:text-lg">
                      Pick careers → answer a few questions → get your roadmap
                    </h2>
                    <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-zinc-500">
                      Structured templates tuned to your experience, degree, and
                      schedule. Every step links to real people when you want
                      help.
                    </p>
                    <Link
                      href="/career-path"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-teal-700"
                    >
                      Build my plan
                      <ArrowRight className="size-3.5" strokeWidth={2} />
                    </Link>
                  </div>
                  <div
                    className="hidden shrink-0 items-center justify-center sm:flex"
                    aria-hidden
                  >
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-600">
                      <Briefcase className="size-7" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Personalized picks */}
          {user?.id && isStudentAudience ? (
            <div className="animate-fade-up delay-150">
              <Suspense
                fallback={
                  <div className="h-48 animate-pulse rounded-xl bg-zinc-100" />
                }
              >
                <PersonalizedPicks userId={user.id} />
              </Suspense>
            </div>
          ) : null}

          {/* Activity */}
          <div className="animate-fade-up delay-200">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-semibold text-zinc-900">
                    Activity
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-400">Last 16 weeks</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-500">
                  <span className="size-1.5 rounded-full bg-zinc-400" />
                  No activity yet
                </span>
              </div>
              <div className="mt-4 flex gap-1.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 flex-1 rounded-[3px] bg-zinc-100"
                    title="No activity"
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Stats */}
          <div className="animate-fade-up delay-250">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-zinc-200 bg-white p-4"
                >
                  <p className="text-[11px] font-medium text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight text-zinc-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="animate-fade-up delay-300">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-amber-500" strokeWidth={1.75} />
                <h2 className="text-[13px] font-semibold text-zinc-900">
                  Streak leaderboard
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-zinc-400">
                Members keeping consistent momentum
              </p>
              <ul className="mt-4 space-y-0.5">
                {leaderboard.map((row, idx) => (
                  <li
                    key={row.name}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-zinc-50"
                  >
                    <span
                      className={cn(
                        "w-5 text-center text-[11px] font-semibold",
                        idx === 0
                          ? "text-amber-500"
                          : idx === 1
                            ? "text-zinc-400"
                            : idx === 2
                              ? "text-amber-700/80"
                              : "text-zinc-300"
                      )}
                    >
                      {idx + 1}
                    </span>
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white",
                        row.color
                      )}
                    >
                      {row.initials}
                    </div>
                    <span className="flex-1 text-[13px] font-medium text-zinc-700">
                      {row.name}
                    </span>
                    <span className="text-[12px] tabular-nums text-zinc-400">
                      {row.weeks} wks
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* ── Right column ────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 lg:col-span-4">

          {/* Resources */}
          <div className="animate-fade-up delay-100">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="text-[13px] font-semibold text-zinc-900">
                Quick links
              </h2>
              <ul className="mt-3 space-y-0.5">
                {resources.map((r) => {
                  const Icon = r.icon;
                  return (
                    <li key={r.label}>
                      <Link
                        href={r.href}
                        className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-zinc-50"
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 transition-colors group-hover:bg-zinc-200 group-hover:text-zinc-700">
                          <Icon className="size-3.5" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-zinc-700 group-hover:text-zinc-900">
                            {r.label}
                          </p>
                          <p className="text-[11px] text-zinc-400 leading-tight">
                            {r.desc}
                          </p>
                        </div>
                        <ArrowRight className="size-3.5 shrink-0 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-500" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* Socials */}
          <div className="animate-fade-up delay-200">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="text-[13px] font-semibold text-zinc-900">
                Find us online
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex size-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-800"
                  >
                    {s.svg}
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Store promo */}
          <div className="animate-fade-up delay-300">
            <section className="rounded-xl border border-zinc-200 bg-zinc-900 p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Coming soon
              </p>
              <h2 className="mt-1.5 text-[13px] font-semibold text-white">
                Prometeo store
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                Tees, stickers, and more — rep the community.
              </p>
              <a
                href="#"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-300 transition-colors hover:text-white"
              >
                Get notified
                <ArrowRight className="size-3" />
              </a>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
