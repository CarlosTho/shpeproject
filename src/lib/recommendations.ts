import { getScholarships } from "@/app/(app)/scholarships/actions";
import { getInternships } from "@/lib/internships/get-internships";
import type { InternshipListing } from "@/lib/internships/types";
import prisma from "@/lib/prisma";
import { CAREER_PATHS } from "@/lib/onboarding/options";

function careerKeywords(path: string | null | undefined): string[] {
  if (!path) return [];
  const found = CAREER_PATHS.find((p) => p.value === path);
  return [found?.label ?? "", path.replace(/_/g, " ")].filter(Boolean);
}

function scoreListing(
  listing: InternshipListing,
  profile: {
    interests: string[];
    major: string | null;
    careerPath: string | null;
  },
): number {
  const hay = [
    listing.company,
    listing.role,
    listing.category,
    listing.location,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  const tokens = [
    ...profile.interests,
    profile.major ?? "",
    ...careerKeywords(profile.careerPath),
  ]
    .join(" ")
    .toLowerCase()
    .split(/[\s,/]+/)
    .filter((w) => w.length > 2);

  const seen = new Set<string>();
  for (const w of tokens) {
    if (seen.has(w)) continue;
    seen.add(w);
    if (hay.includes(w)) score += 3;
  }

  if (profile.careerPath === "software_engineering") {
    if (/(software|engineer|developer|swe|backend|frontend|fullstack)/i.test(hay))
      score += 2;
  }
  if (profile.careerPath === "healthcare") {
    if (/(health|bio|med|clinical|pharma)/i.test(hay)) score += 2;
  }

  return score;
}

export type PersonalizedPicks = {
  internships: InternshipListing[];
  scholarshipCount: number;
  showScholarshipsCta: boolean;
  headline: string;
};

export async function getPersonalizedPicks(
  userId: string,
): Promise<PersonalizedPicks | null> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      onboardingComplete: true,
      audienceSegment: true,
      interests: true,
      major: true,
      careerPath: true,
      seekingScholarships: true,
    },
  });

  if (!profile?.onboardingComplete) return null;
  if (profile.audienceSegment !== "student") return null;

  const internshipsResult = await getInternships();
  const listings =
    internshipsResult.ok && internshipsResult.listings.length > 0
      ? internshipsResult.listings
      : [];

  const scored = listings.map((l) => ({
    l,
    score: scoreListing(l, profile),
  }));
  scored.sort((a, b) => b.score - a.score);
  const internships = scored.slice(0, 5).map((x) => x.l);

  let scholarshipCount = 0;
  try {
    const scholarships = await getScholarships();
    scholarshipCount = scholarships.length;
  } catch {
    scholarshipCount = 0;
  }

  const name =
    careerKeywords(profile.careerPath)[0] ||
    profile.major ||
    "your interests";

  return {
    internships,
    scholarshipCount,
    showScholarshipsCta: profile.seekingScholarships === true,
    headline: `Based on ${name}, here are opportunities worth a look`,
  };
}
