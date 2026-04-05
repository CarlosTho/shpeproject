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
import type { ScholarshipItem } from "@/app/(app)/scholarships/actions";
import { cn } from "@/lib/utils";

function ScholarshipCard({ scholarship }: { scholarship: ScholarshipItem }) {
  const deadline = scholarship.deadline ? parseISO(scholarship.deadline) : null;
  const expired = deadline ? isPast(deadline) : false;

  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {scholarship.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600"
            >
              {tag}
            </span>
          ))}
          {expired && (
            <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
              Closed
            </span>
          )}
        </div>
        {scholarship.amount && (
          <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-semibold tabular-nums text-zinc-900">
            <DollarSign className="size-3.5 text-zinc-400" />
            {scholarship.amount}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-[14px] font-semibold leading-snug text-zinc-900">
          {scholarship.name}
        </h3>
        <p className="mt-0.5 text-[12px] text-zinc-400">{scholarship.organization}</p>
      </div>

      {scholarship.description && (
        <p className="line-clamp-2 text-[13px] leading-relaxed text-zinc-500">
          {scholarship.description}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        {deadline && (
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <Calendar className="size-3.5 shrink-0 text-zinc-400" />
            <span>
              Deadline:{" "}
              <span className={expired ? "text-zinc-400 line-through" : "font-medium text-zinc-700"}>
                {format(deadline, "MMM d, yyyy")}
              </span>
            </span>
          </div>
        )}
        {scholarship.gpaRequirement && (
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <Trophy className="size-3.5 shrink-0 text-zinc-400" />
            Min GPA: <span className="font-medium text-zinc-700">{scholarship.gpaRequirement.toFixed(1)}</span>
          </div>
        )}
        {scholarship.levelRequirement.length > 0 && (
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <GraduationCap className="size-3.5 shrink-0 text-zinc-400" />
            {scholarship.levelRequirement.join(", ")}
          </div>
        )}
        {scholarship.majors.length > 0 && (
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <GraduationCap className="size-3.5 shrink-0 text-zinc-400" />
            {scholarship.majors.join(", ")}
          </div>
        )}
      </div>

      <div className="mt-auto pt-1">
        <a
          href={scholarship.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors",
            expired
              ? "border border-zinc-200 text-zinc-400 cursor-not-allowed pointer-events-none"
              : "bg-teal-600 text-white hover:bg-teal-700"
          )}
          {...(expired ? { "aria-disabled": true, tabIndex: -1 } : {})}
        >
          {expired ? "Closed" : "Apply Now"}
          <ExternalLink className="size-3 opacity-70" />
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
      if (!showExpired && s.deadline && isPast(parseISO(s.deadline))) return false;
      if (level !== "all" && !s.levelRequirement.includes(level)) return false;
      if (!needle) return true;
      const hay = [s.name, s.organization, s.description, s.amount, ...s.tags, ...s.majors]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [initialScholarships, q, level, showExpired]);

  return (
    <div className="animate-fade-up space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="scholarship-search">
            Search scholarships
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id="scholarship-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, organization, major…"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            id="scholarship-level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            aria-label="Level"
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          >
            <option value="all">All levels</option>
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50">
            <input
              type="checkbox"
              checked={showExpired}
              onChange={(e) => setShowExpired(e.target.checked)}
              className="size-3.5 rounded border-zinc-300 accent-zinc-900"
            />
            Show closed
          </label>
        </div>
      </div>

      {/* Count */}
      <p className="text-[13px] text-zinc-400">
        <span className="font-semibold text-zinc-700">{filtered.length}</span>{" "}
        of {initialScholarships.length} scholarships
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex size-12 items-center justify-center rounded-xl border border-zinc-200 bg-white">
            <GraduationCap className="size-5 text-zinc-400" />
          </div>
          <p className="mt-3 text-[13px] text-zinc-500">
            No scholarships found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
