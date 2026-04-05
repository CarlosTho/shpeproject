import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getPersonalizedPicks } from "@/lib/recommendations";

type Props = {
  userId: string;
};

export async function PersonalizedPicks({ userId }: Props) {
  const data = await getPersonalizedPicks(userId);
  if (!data) return null;

  const hasInternships = data.internships.length > 0;

  return (
    <section className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-white to-teal-50/50 p-5 shadow-sm ring-1 ring-teal-100">
      <h2 className="text-sm font-semibold text-slate-900">
        Picked for you
      </h2>
      <p className="mt-1 text-xs text-slate-600">{data.headline}</p>

      {hasInternships ? (
        <ul className="mt-4 space-y-3">
          {data.internships.map((row) => (
            <li
              key={`${row.company}-${row.role}-${row.category}`}
              className="rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {row.company}
                  </p>
                  <p className="text-xs text-slate-600">{row.role}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {row.location}
                  </p>
                </div>
                {row.applyUrl ? (
                  <a
                    href={row.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Apply
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          We couldn&apos;t load internship listings right now. Check{" "}
          <Link href="/internship" className="font-medium text-teal-700">
            Opportunities
          </Link>{" "}
          for the full board.
        </p>
      )}

      {data.showScholarshipsCta && data.scholarshipCount > 0 ? (
        <div className="mt-4 rounded-xl bg-white/80 px-3 py-3 text-sm text-slate-700 ring-1 ring-slate-100">
          <p>
            You said you&apos;re looking for scholarships — we have{" "}
            <span className="font-semibold tabular-nums">
              {data.scholarshipCount}
            </span>{" "}
            in the directory.
          </p>
          <Link
            href="/scholarships"
            className="mt-2 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            Browse scholarships →
          </Link>
        </div>
      ) : null}
    </section>
  );
}
