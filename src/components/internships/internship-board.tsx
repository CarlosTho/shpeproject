"use client";

import {
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, RefreshCw, Search } from "lucide-react";
import { refreshInternshipsFromGithub } from "@/app/internship/actions";
import type { InternshipListing } from "@/lib/internships/types";

type Props = {
  listings: InternshipListing[];
  /** Shown only when load failed (e.g. network). */
  notice?: ReactNode;
};

function shortCategory(cat: string): string {
  return cat.replace(/\s*Internship Roles\s*$/i, "").trim();
}

export function InternshipBoard({ listings, notice }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [refreshing, startRefresh] = useTransition();

  function handleRefresh() {
    startRefresh(async () => {
      await refreshInternshipsFromGithub();
      router.refresh();
    });
  }

  const categories = useMemo(() => {
    const set = new Set(listings.map((l) => l.category));
    return [...set].sort();
  }, [listings]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return listings.filter((l) => {
      if (category !== "all" && l.category !== category) return false;
      if (!needle) return true;
      const hay = [
        l.company,
        l.role,
        l.location,
        l.age,
        l.category,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [listings, q, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative max-w-xl flex-1">
          <label className="sr-only" htmlFor="internship-search">
            Search internships
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id="internship-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company, role, location…"
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1 sm:min-w-[220px]">
            <label
              htmlFor="internship-category"
              className="text-xs font-medium text-slate-500"
            >
              Category
            </label>
            <select
              id="internship-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {shortCategory(c)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:self-end"
          >
            <RefreshCw
              className={`size-4 ${refreshing ? "animate-spin" : ""}`}
              aria-hidden
            />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        Showing{" "}
        <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
        of {listings.length} roles
        {listings.length === 0 ? " (source unavailable or list empty)." : "."}
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[min(70vh,720px)] overflow-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Company
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">Role</th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Location
                </th>
                <th className="px-4 py-3 font-semibold text-slate-700">Age</th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Links
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={`${row.company}-${row.role}-${row.location}-${i}`}
                  className="border-b border-slate-100 transition hover:bg-slate-50/80"
                >
                  <td className="px-4 py-3 align-top">
                    {row.companyUrl ? (
                      <a
                        href={row.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-teal-700 underline-offset-2 hover:underline"
                      >
                        {row.company}
                      </a>
                    ) : (
                      <span className="font-medium text-slate-900">
                        {row.company}
                      </span>
                    )}
                    <div className="mt-1 text-xs text-slate-500">
                      {shortCategory(row.category)}
                    </div>
                  </td>
                  <td className="max-w-[280px] px-4 py-3 align-top text-slate-800">
                    {row.role}
                  </td>
                  <td className="max-w-[200px] px-4 py-3 align-top text-slate-600">
                    {row.location}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-slate-500">
                    {row.age}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-2">
                      {row.applyUrl ? (
                        <a
                          href={row.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-teal-700"
                        >
                          Apply
                          <ExternalLink className="size-3.5 opacity-90" />
                        </a>
                      ) : null}
                      {row.simplifyUrl ? (
                        <a
                          href={row.simplifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Simplify
                          <ExternalLink className="size-3.5 opacity-70" />
                        </a>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {notice ? (
        <footer className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
          {notice}
        </footer>
      ) : null}
    </div>
  );
}
