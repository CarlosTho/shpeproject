"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import type { DirectoryMember } from "@/app/(app)/directory/actions";
import { getDirectoryMembers } from "@/app/(app)/directory/actions";
import { profileAccentForUserId } from "@/lib/profile/profile-accent";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex gap-3.5 rounded-xl border p-4 transition-colors",
        isSelf
          ? "border-teal-200 bg-teal-50/40 hover:border-teal-300"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/40"
      )}
      aria-label={isSelf ? `${member.name}, your profile` : undefined}
    >
      {member.image ? (
        <img
          src={member.image}
          alt=""
          className="size-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
            accent.directoryInitials
          )}
          aria-hidden
        >
          {initials(member.name)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-semibold text-zinc-900">{member.name}</span>
          {isSelf && (
            <span className="rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700">
              You
            </span>
          )}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-[11px] text-zinc-400">{subtitle}</p>
        )}
        {member.bio && (
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
            {member.bio}
          </p>
        )}
        {member.location && (
          <p className="mt-1 text-[11px] text-zinc-400">{member.location}</p>
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
      const results = await getDirectoryMembers(value || undefined, currentUserId);
      setMembers(results);
    });
  }

  return (
    <div className="animate-fade-up space-y-5">
      {/* Search */}
      <div className="relative">
        <label className="sr-only" htmlFor="directory-search">
          Search by name, school, or location
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
          strokeWidth={2}
          aria-hidden
        />
        <input
          id="directory-search"
          type="search"
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name, school, or location…"
          className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      {/* Count */}
      <p className="text-[13px] text-zinc-400">
        {searching ? (
          "Searching…"
        ) : (
          <>
            <span className="font-semibold text-zinc-700">{members.length}</span>{" "}
            member{members.length !== 1 ? "s" : ""}
          </>
        )}
      </p>

      {/* Grid */}
      <section
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
        aria-label="Members"
      >
        {members.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <p className="text-[13px] text-zinc-500">No members found.</p>
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
