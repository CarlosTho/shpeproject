"use server";

import prisma from "@/lib/prisma";

export type ScholarshipItem = {
  id: string;
  name: string;
  organization: string;
  description: string | null;
  amount: string | null;
  deadline: string | null;
  gpaRequirement: number | null;
  levelRequirement: string[];
  majors: string[];
  tags: string[];
  applyUrl: string;
};

/** SHPE retired /students/scholarship; ScholarSHPE lives under /engage/programs/scholarshpe/. */
const SHPE_SCHOLARSHPE_URL = "https://shpe.org/engage/programs/scholarshpe/";

function normalizeApplyUrl(url: string): string {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.toLowerCase();
    const path = u.pathname.replace(/\/+$/, "") || "/";
    if (
      (host === "shpe.org" || host === "www.shpe.org") &&
      path === "/students/scholarship"
    ) {
      return SHPE_SCHOLARSHPE_URL;
    }
  } catch {
    /* keep original if not a valid URL */
  }
  return url;
}

export async function getScholarships(): Promise<ScholarshipItem[]> {
  const scholarships = await prisma.scholarship.findMany({
    orderBy: { deadline: "asc" },
  });

  return scholarships.map((s) => ({
    id: s.id,
    name: s.name,
    organization: s.organization,
    description: s.description,
    amount: s.amount,
    deadline: s.deadline?.toISOString() ?? null,
    gpaRequirement: s.gpaRequirement,
    levelRequirement: s.levelRequirement,
    majors: s.majors,
    tags: s.tags,
    applyUrl: normalizeApplyUrl(s.applyUrl),
  }));
}
