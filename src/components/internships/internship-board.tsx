"use client";

import {
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, RefreshCw, Search } from "lucide-react";
import { refreshInternshipsFromGithub } from "@/app/(app)/internship/actions";
import type { InternshipListing } from "@/lib/internships/types";
import { cn } from "@/lib/utils";

type Props = {
  listings: InternshipListing[];
  notice?: ReactNode;
};

function shortCategory(cat: string): string {
  return cat.replace(/\s*Internship Roles\s*$/i, "").trim();
}

function CompanyInitials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[11px] font-semibold text-zinc-600">
      {initials}
    </div>
  );
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
      return [l.company, l.role, l.location, l.age, l.category]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [listings, q, category]);

  return (
    <div className="animate-fade-up space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="internship-search">
            Search internships
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id="internship-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company, role, location…"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            id="internship-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Category"
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {shortCategory(c)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
          >
            <RefreshCw
              className={cn("size-3.5", refreshing && "animate-spin")}
              aria-hidden
            />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-[13px] text-zinc-400">
        <span className="font-semibold text-zinc-700">{filtered.length}</span>{" "}
        of {listings.length} roles
        {listings.length === 0 && " — source unavailable"}
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="max-h-[min(70vh,760px)] overflow-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/95 backdrop-blur">
              <tr>
                {["Company", "Role", "Location", "Age", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={`${row.company}-${row.role}-${row.location}-${i}`}
                  className="group border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/60"
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2.5">
                      <CompanyInitials name={row.company} />
                      <div>
                        {row.companyUrl ? (
                          <a
                            href={row.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-zinc-900 underline-offset-2 hover:underline"
                          >
                            {row.company}
                          </a>
                        ) : (
                          <span className="font-medium text-zinc-900">
                            {row.company}
                          </span>
                        )}
                        <div className="text-[11px] text-zinc-400">
                          {shortCategory(row.category)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[260px] px-4 py-3 align-middle text-[13px] text-zinc-600">
                    {row.role}
                  </td>
                  <td className="max-w-[180px] px-4 py-3 align-middle text-[13px] text-zinc-500">
                    {row.location}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-middle text-[13px] text-zinc-400">
                    {row.age}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-middle">
                    <div className="flex gap-1.5">
                      {row.applyUrl && (
                        <a
                          href={row.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-teal-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-teal-700"
                        >
                          Apply
                          <ExternalLink className="size-3 opacity-70" />
                        </a>
                      )}
                      {row.simplifyUrl && (
                        <a
                          href={row.simplifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
                        >
                          Simplify
                          <ExternalLink className="size-3 opacity-60" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {notice && (
        <div className="rounded-lg border border-amber-200/60 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          {notice}
        </div>
      )}
    </div>
  );
}
