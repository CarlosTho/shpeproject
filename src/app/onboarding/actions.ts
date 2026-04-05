"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { CAREERS } from "@/lib/career-path/careers";
import prisma from "@/lib/prisma";

const ALLOWED_CAREER_IDS = new Set(CAREERS.map((c) => c.id));

const contentLangEnum = z.enum(["english", "spanish", "both"]);

const studentSchema = z.object({
  school: z.string().trim().min(1, "School is required."),
  major: z.string().trim().min(1, "Major or intended major is required."),
  gradYear: z.string().trim().min(1, "Graduation year is required."),
  education: z.string().min(1, "Education level is required."),
  firstGen: z.boolean(),
  preferredContentLang: contentLangEnum,
  internationalOrDaca: z.boolean().optional().nullable(),
  studentFieldInterest: z.enum(["tech", "healthcare", "business", "undecided"]),
  studentPrimaryGoal: z.enum(["internship", "scholarships", "explore", "skills"]),
  sixMonthGoal: z.string().trim().min(1, "Share what you want to achieve in the next 6 months."),
  receivingScholarships: z.boolean(),
  scholarshipDetails: z.string().trim().optional().nullable(),
  seekingScholarships: z.boolean(),
  location: z.string().trim().min(1, "City / state or country is required."),
  communityPrefs: z.array(z.string()).default([]),
});

const nonStudentSchema = z.object({
  ageRange: z.enum(["", "18-22", "23-27", "28-35", "36+"]),
  preferredContentLang: contentLangEnum,
  sixMonthGoal: z.string().trim().min(1, "Share what you want to achieve in the next 6 months."),
  nonStudentSituation: z.enum(["working", "unemployed", "part_time"]),
  experienceLevel: z.enum(["none", "some", "experienced"]),
  hasCollegeDegree: z.boolean(),
  targetCareerSlugs: z
    .array(z.string())
    .max(2, "Pick at most two careers.")
    .default([]),
  careerIntentText: z.string().trim().optional().nullable(),
  primaryBarrier: z.enum([
    "dont_know_start",
    "no_experience",
    "language",
    "financial",
  ]),
  location: z.string().trim().min(1, "City / state or country is required."),
  communityPrefs: z.array(z.string()).default([]),
});

export type OnboardingSubmitState = { error?: string; ok?: boolean };

function emptyToNull(s: string | null | undefined) {
  const t = s?.trim();
  return t === "" || t === undefined ? null : t;
}

function languagesFromContentPref(pref: z.infer<typeof contentLangEnum>) {
  if (pref === "both") return ["english", "spanish"] as const;
  return [pref] as const;
}

function careerPathFromStudentField(
  field: z.infer<typeof studentSchema>["studentFieldInterest"],
) {
  switch (field) {
    case "tech":
      return "software_engineering";
    case "healthcare":
      return "healthcare";
    case "business":
      return "business";
    default:
      return "other";
  }
}

function interestsFromStudentField(
  field: z.infer<typeof studentSchema>["studentFieldInterest"],
): string[] {
  switch (field) {
    case "tech":
      return ["Web Dev", "AI/ML", "Data"];
    case "healthcare":
      return ["Research", "Data"];
    case "business":
      return ["Product", "Finance", "Marketing"];
    default:
      return ["Web Dev"];
  }
}

function yearlyGoalFromStudentPrimary(
  g: z.infer<typeof studentSchema>["studentPrimaryGoal"],
) {
  switch (g) {
    case "internship":
      return "internship";
    case "scholarships":
      return "other";
    case "explore":
      return "other";
    case "skills":
      return "skill";
    default:
      return "other";
  }
}

function challengesFromStudentPrimary(
  g: z.infer<typeof studentSchema>["studentPrimaryGoal"],
) {
  if (g === "internship") return "internships";
  if (g === "scholarships") return "financial_aid";
  return "other";
}

function challengesFromBarrier(
  b: z.infer<typeof nonStudentSchema>["primaryBarrier"],
) {
  switch (b) {
    case "language":
      return "language";
    case "financial":
      return "financial_aid";
    case "no_experience":
      return "internships";
    default:
      return "other";
  }
}

function careerPathFromTargetSlugs(slugs: string[]): string | null {
  const first = slugs[0];
  if (!first) return "other";
  if (
    first === "web_development" ||
    first === "cybersecurity" ||
    first === "data_analyst" ||
    first === "it_support"
  ) {
    return "software_engineering";
  }
  if (
    first === "sales_sdr" ||
    first === "digital_marketing" ||
    first === "recruiting" ||
    first === "project_coordinator"
  ) {
    return "business";
  }
  return "other";
}

function interestsFromCareerSlugs(slugs: string[]): string[] {
  if (slugs.length === 0) {
    return ["Networking", "Product"];
  }
  const tags = new Set<string>();
  for (const id of slugs) {
    if (id === "data_analyst") tags.add("Data");
    if (id === "web_development") tags.add("Web Dev");
    if (id === "cybersecurity") tags.add("Cybersecurity");
    if (id === "digital_marketing") tags.add("Marketing");
    if (id === "project_coordinator") tags.add("Product");
    if (id === "sales_sdr" || id === "recruiting") tags.add("Networking");
    if (id === "it_support") tags.add("Cloud");
  }
  if (tags.size === 0) tags.add("Networking");
  return [...tags];
}

export async function setAudienceSegment(
  segment: "student" | "non_student",
): Promise<OnboardingSubmitState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not signed in." };
  }

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: { audienceSegment: segment },
  });

  revalidatePath("/onboarding");
  return { ok: true };
}

export async function completeStudentOnboarding(
  raw: unknown,
): Promise<OnboardingSubmitState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not signed in." };
  }

  const parsed = studentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  const d = parsed.data;
  const langs = [...languagesFromContentPref(d.preferredContentLang)];

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      onboardingComplete: true,
      audienceSegment: "student",
      userType: "student",
      school: d.school,
      education: d.education,
      major: d.major,
      gradYear: d.gradYear,
      location: d.location,
      languages: langs,
      firstGen: d.firstGen,
      internationalOrDaca: d.internationalOrDaca ?? null,
      preferredContentLang: d.preferredContentLang,
      careerPath: careerPathFromStudentField(d.studentFieldInterest),
      interests: interestsFromStudentField(d.studentFieldInterest),
      studentFieldInterest: d.studentFieldInterest,
      studentPrimaryGoal: d.studentPrimaryGoal,
      sixMonthGoal: d.sixMonthGoal,
      challenges: challengesFromStudentPrimary(d.studentPrimaryGoal),
      yearlyGoal: yearlyGoalFromStudentPrimary(d.studentPrimaryGoal),
      receivingScholarships: d.receivingScholarships,
      scholarshipDetails: emptyToNull(d.scholarshipDetails ?? undefined),
      seekingScholarships:
        d.studentPrimaryGoal === "scholarships" || d.seekingScholarships,
      communityPrefs: d.communityPrefs ?? [],
      experienceLevel: null,
      ageRange: null,
      nonStudentSituation: null,
      careerIntentText: null,
      targetCareerSlugs: [],
      primaryBarrier: null,
      hasCollegeDegree: null,
    },
  });

  revalidatePath("/home");
  revalidatePath("/onboarding");
  revalidatePath("/profile");
  return { ok: true };
}

export async function completeNonStudentOnboarding(
  raw: unknown,
): Promise<OnboardingSubmitState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not signed in." };
  }

  const parsed = nonStudentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  const d = parsed.data;
  for (const id of d.targetCareerSlugs) {
    if (!ALLOWED_CAREER_IDS.has(id)) {
      return { error: "Invalid career selection." };
    }
  }

  const hasCareers = d.targetCareerSlugs.length > 0;
  const intent = d.careerIntentText?.trim() ?? "";
  const hasText = intent.length > 0;
  if (!hasCareers && !hasText) {
    return {
      error: "Pick at least one career or describe what you want to do.",
    };
  }

  const slugs = d.targetCareerSlugs;
  const langs = [...languagesFromContentPref(d.preferredContentLang)];
  const ageRange = d.ageRange === "" ? null : d.ageRange;

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      onboardingComplete: true,
      audienceSegment: "non_student",
      userType: "professional",
      school: null,
      education: d.hasCollegeDegree ? "graduate" : "bootcamp_self",
      major: null,
      gradYear: null,
      location: d.location,
      languages: langs,
      preferredContentLang: d.preferredContentLang,
      firstGen: null,
      internationalOrDaca: null,
      sixMonthGoal: d.sixMonthGoal,
      ageRange,
      nonStudentSituation: d.nonStudentSituation,
      experienceLevel: d.experienceLevel,
      hasCollegeDegree: d.hasCollegeDegree,
      careerIntentText: intent ? intent.slice(0, 2000) : null,
      targetCareerSlugs: slugs,
      primaryBarrier: d.primaryBarrier,
      careerPath: careerPathFromTargetSlugs(slugs),
      interests: interestsFromCareerSlugs(slugs),
      challenges: challengesFromBarrier(d.primaryBarrier),
      yearlyGoal: "switch_careers",
      communityPrefs: d.communityPrefs ?? [],
      receivingScholarships: false,
      seekingScholarships: false,
      scholarshipDetails: null,
      studentFieldInterest: null,
      studentPrimaryGoal: null,
    },
  });

  revalidatePath("/career-path");
  revalidatePath("/onboarding");
  revalidatePath("/profile");
  revalidatePath("/home");
  return { ok: true };
}
