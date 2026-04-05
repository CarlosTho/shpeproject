"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  DollarSign,
  ExternalLink,
  GraduationCap,
  Search,
  Trophy,
} from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import type { ScholarshipItem } from "@/app/scholarships/actions";

function ScholarshipCard({ scholarship }: { scholarship: ScholarshipItem }) {
  const deadline = scholarship.deadline ? parseISO(scholarship.deadline) : null;
  const expired = deadline ? isPast(deadline) : false;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {scholarship.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700"
            >
              {tag}
            </span>
          ))}
          {expired && (
            <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Closed
            </span>
          )}
        </div>
        {scholarship.amount && (
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-700">
            <DollarSign className="size-3.5" />
            {scholarship.amount}
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        {scholarship.name}
      </h3>
      <p className="text-sm text-slate-500">{scholarship.organization}</p>

      {scholarship.description && (
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
          {scholarship.description}
        </p>
      )}

      <div className="flex flex-col gap-1.5 text-sm text-slate-600">
        {deadline && (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0 text-slate-400" />
            <span>
              Deadline:{" "}
              <span className={expired ? "text-slate-400 line-through" : "font-medium"}>
                {format(deadline, "MMM d, yyyy")}
              </span>
            </span>
          </div>
        )}
        {scholarship.gpaRequirement && (
          <div className="flex items-center gap-2">
            <Trophy className="size-4 shrink-0 text-slate-400" />
            Min GPA: {scholarship.gpaRequirement.toFixed(1)}
          </div>
        )}
        {scholarship.levelRequirement.length > 0 && (
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 shrink-0 text-slate-400" />
            {scholarship.levelRequirement.join(", ")}
          </div>
        )}
        {scholarship.majors.length > 0 && (
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 shrink-0 text-slate-400" />
            {scholarship.majors.join(", ")}
          </div>
        )}
      </div>

      <div className="mt-auto pt-2">
        <a
          href={scholarship.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
            expired
              ? "border border-slate-200 bg-white text-slate-400 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
          {...(expired ? { "aria-disabled": true, tabIndex: -1 } : {})}
        >
          {expired ? "Closed" : "Apply Now"}
          <ExternalLink className="size-3.5 opacity-80" />
        </a>
      </div>
    </article>
  );
}

type Props = {
  initialScholarships: ScholarshipItem[];
};

export function ScholarshipBoard({ initialScholarships }: Props) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<string>("all");
  const [showExpired, setShowExpired] = useState(false);

  const levels = useMemo(() => {
    const set = new Set(initialScholarships.flatMap((s) => s.levelRequirement));
    return [...set].sort();
  }, [initialScholarships]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return initialScholarships.filter((s) => {
      // Filter by expiration
      if (!showExpired && s.deadline && isPast(parseISO(s.deadline))) {
        return false;
      }
      // Filter by level
      if (level !== "all" && !s.levelRequirement.includes(level)) {
        return false;
      }
      // Search
      if (!needle) return true;
      const hay = [
        s.name,
        s.organization,
        s.description,
        s.amount,
        ...s.tags,
        ...s.majors,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [initialScholarships, q, level, showExpired]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative max-w-xl flex-1">
          <label className="sr-only" htmlFor="scholarship-search">
            Search scholarships
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id="scholarship-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, organization, major..."
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1 sm:min-w-[180px]">
            <label
              htmlFor="scholarship-level"
              className="text-xs font-medium text-slate-500"
            >
              Level
            </label>
            <select
              id="scholarship-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
            >
              <option value="all">All levels</option>
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showExpired}
              onChange={(e) => setShowExpired(e.target.checked)}
              className="size-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/25"
            />
            Show closed
          </label>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        Showing{" "}
        <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
        of {initialScholarships.length} scholarships
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <GraduationCap className="mx-auto size-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            No scholarships found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
