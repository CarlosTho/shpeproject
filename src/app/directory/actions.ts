"use server";

import prisma from "@/lib/prisma";

export type DirectoryMember = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  school: string | null;
  major: string | null;
  gradYear: string | null;
  location: string | null;
};

export async function getDirectoryMembers(
  query?: string,
  currentUserId?: string | null,
): Promise<DirectoryMember[]> {
  const where = query?.trim()
    ? {
        OR: [
          { name: { contains: query.trim(), mode: "insensitive" as const } },
          { email: { contains: query.trim(), mode: "insensitive" as const } },
          { profile: { school: { contains: query.trim(), mode: "insensitive" as const } } },
          { profile: { major: { contains: query.trim(), mode: "insensitive" as const } } },
          { profile: { location: { contains: query.trim(), mode: "insensitive" as const } } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    include: { profile: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const members = users.map((u) => ({
    id: u.id,
    name: u.name ?? "Member",
    email: u.email,
    image: u.image,
    bio: u.profile?.bio ?? null,
    school: u.profile?.school ?? null,
    major: u.profile?.major ?? null,
    gradYear: u.profile?.gradYear ?? null,
    location: u.profile?.location ?? null,
  }));

  if (currentUserId) {
    const self = members.filter((m) => m.id === currentUserId);
    const rest = members.filter((m) => m.id !== currentUserId);
    return [...self, ...rest];
  }

  return members;
}
