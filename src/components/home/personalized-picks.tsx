import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { getPersonalizedPicks } from "@/lib/recommendations";

export async function PersonalizedPicks({ userId }: { userId: string }) {
  const data = await getPersonalizedPicks(userId);
  if (!data) return null;

  const hasInternships = data.internships.length > 0;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-teal-500" strokeWidth={1.75} />
        <h2 className="text-[13px] font-semibold text-zinc-900">Picked for you</h2>
      </div>
      <p className="mt-0.5 text-[11px] text-zinc-400">{data.headline}</p>

      {hasInternships ? (
        <ul className="mt-3 space-y-0.5">
          {data.internships.map((row) => (
            <li
              key={`${row.company}-${row.role}-${row.category}`}
              className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-zinc-50"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[11px] font-bold text-zinc-600">
                {row.company.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-zinc-800">
                  {row.company}
                </p>
                <p className="text-[11px] text-zinc-400">{row.role}</p>
              </div>
              {row.applyUrl ? (
                <a
                  href={row.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
                >
                  Apply
                  <ExternalLink className="size-2.5" aria-hidden />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[13px] text-zinc-400">
          Couldn&apos;t load listings right now.{" "}
          <Link href="/internship" className="font-medium text-teal-600 hover:text-teal-700">
            View all internships
          </Link>
        </p>
      )}

      {data.showScholarshipsCta && data.scholarshipCount > 0 && (
        <div className="mt-3 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5">
          <p className="text-[12px] text-zinc-600">
            <span className="font-semibold tabular-nums text-zinc-900">
              {data.scholarshipCount}
            </span>{" "}
            scholarships available matching your profile.
          </p>
          <Link
            href="/scholarships"
            className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-teal-600 hover:text-teal-700"
          >
            Browse scholarships
            <ArrowRight className="size-3" />
          </Link>
        </div>
      )}
    </section>
  );
}
