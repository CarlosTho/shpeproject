"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import type { DirectoryMember } from "@/app/directory/actions";
import { getDirectoryMembers } from "@/app/directory/actions";
import { profileAccentForUserId } from "@/lib/profile/profile-accent";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function MemberCard({
  member,
  isSelf,
}: {
  member: DirectoryMember;
  isSelf: boolean;
}) {
  const accent = profileAccentForUserId(member.id);
  const subtitle = [member.major, member.school, member.gradYear]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={`flex gap-4 rounded-xl border p-4 shadow-sm transition hover:shadow-md ${
        isSelf
          ? "border-emerald-200 bg-emerald-50/35 ring-1 ring-emerald-500/25 hover:border-emerald-300"
          : "border-slate-100 bg-white hover:border-slate-200"
      }`}
      aria-label={isSelf ? `${member.name}, your profile` : undefined}
    >
      {member.image ? (
        <img
          src={member.image}
          alt=""
          className="size-14 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${accent.directoryInitials}`}
          aria-hidden
        >
          {initials(member.name)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
          <span>{member.name}</span>
          {isSelf ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-300/80">
              You
            </span>
          ) : null}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        )}
        {member.bio && (
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {member.bio}
          </p>
        )}
        {member.location && (
          <p className="mt-1 text-xs text-slate-400">
            {member.location}
            {isSelf ? (
              <span className="font-medium text-emerald-700"> · You</span>
            ) : null}
          </p>
        )}
      </div>
    </article>
  );
}

type Props = {
  initialMembers: DirectoryMember[];
  currentUserId: string | null;
};

export function DirectoryBoard({ initialMembers, currentUserId }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [q, setQ] = useState("");
  const [searching, startSearch] = useTransition();

  function handleSearch(value: string) {
    setQ(value);
    startSearch(async () => {
      const results = await getDirectoryMembers(
        value || undefined,
        currentUserId,
      );
      setMembers(results);
    });
  }

  return (
    <div>
      <div className="mt-6">
        <label className="sr-only" htmlFor="directory-search">
          Search by name, school, or location
        </label>
        <div className="relative max-w-3xl">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id="directory-search"
            type="search"
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, school, or location..."
            className="w-full rounded-full border-0 bg-slate-100 py-3.5 pl-12 pr-5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {searching ? "Searching…" : `${members.length} member${members.length !== 1 ? "s" : ""}`}
      </p>

      <section
        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
        aria-label="Members"
      >
        {members.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-sm text-slate-500">No members found.</p>
          </div>
        ) : (
          members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              isSelf={currentUserId !== null && m.id === currentUserId}
            />
          ))
        )}
      </section>
    </div>
  );
}
