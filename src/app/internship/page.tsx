import Link from "next/link";
import type { ReactNode } from "react";
import { InternshipBoard } from "@/components/internships/internship-board";
import { getInternships } from "@/lib/internships/get-internships";

export default async function InternshipPage() {
  const result = await getInternships();

  const notice: ReactNode | undefined = result.ok
    ? undefined
    : (
        <>
          Could not load listings ({result.error}).{" "}
          <Link
            href="https://github.com/SimplifyJobs/Summer2026-Internships"
            className="font-medium text-teal-800 underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </Link>
          .
        </>
      );

  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <header className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Internships <span aria-hidden>🌞</span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Summer 2026 tech internships aggregated from the open-source list
          maintained by the community. Use filters to narrow by category or
          keyword.
        </p>
      </header>

      <section className="mx-auto mt-8 max-w-6xl">
        <InternshipBoard listings={result.listings} notice={notice} />
      </section>
    </main>
  );
}
