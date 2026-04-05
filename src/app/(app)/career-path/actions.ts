"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { CAREERS } from "@/lib/career-path/careers";
import { generateStoredPlan } from "@/lib/career-path/generate-roadmap";
import type { StoredPlan, StepProgressData, WizardProfile } from "@/lib/career-path/types";
import prisma from "@/lib/prisma";

const ALLOWED_CAREERS = new Set(CAREERS.map((c) => c.id));

const wizardSchema = z.object({
  careerIds: z
    .array(z.string())
    .min(1, "Pick at least one career.")
    .max(2, "Pick at most two careers."),
  ageRange: z.enum(["18-22", "23-27", "28-35", "36+"]),
  workStatus: z.enum(["student", "working", "unemployed", "part_time"]),
  experienceLevel: z.enum(["none", "some", "experienced"]),
  hasDegree: z.enum(["yes", "no"]),
  hoursPerWeek: z.coerce.number().int().min(5).max(20),
  goalTimeline: z.enum(["3_months", "6_months", "1_year"]),
});

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=" + encodeURIComponent("/career-path"));
  }
  return session.user.id;
}

export type CreateRoadmapResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createCareerRoadmap(
  _prev: CreateRoadmapResult | null,
  formData: FormData,
): Promise<CreateRoadmapResult> {
  const userId = await requireUserId();

  const audience = await prisma.profile.findUnique({
    where: { userId },
    select: { audienceSegment: true },
  });
  if (audience?.audienceSegment === "student") {
    return {
      ok: false,
      error:
        "The Career Path Generator is for the non-student track. Use Home for internships, scholarships, and student-focused resources.",
    };
  }

  const careerIds = formData.getAll("careerIds").filter((v): v is string => typeof v === "string");
  const raw = wizardSchema.safeParse({
    careerIds,
    ageRange: formData.get("ageRange"),
    workStatus: formData.get("workStatus"),
    experienceLevel: formData.get("experienceLevel"),
    hasDegree: formData.get("hasDegree"),
    hoursPerWeek: formData.get("hoursPerWeek"),
    goalTimeline: formData.get("goalTimeline"),
  });

  if (!raw.success) {
    return { ok: false, error: raw.error.issues[0]?.message ?? "Invalid form." };
  }

  for (const id of raw.data.careerIds) {
    if (!ALLOWED_CAREERS.has(id)) {
      return { ok: false, error: "Invalid career selection." };
    }
  }

  const profile: WizardProfile = {
    careers: raw.data.careerIds,
    ageRange: raw.data.ageRange,
    workStatus: raw.data.workStatus,
    experienceLevel: raw.data.experienceLevel,
    hasDegree: raw.data.hasDegree === "yes",
    hoursPerWeek: raw.data.hoursPerWeek,
    goalTimeline: raw.data.goalTimeline,
  };

  let resumeRef: string | null = null;
  const file = formData.get("resume");
  if (file instanceof File && file.size > 0) {
    const max = 4 * 1024 * 1024;
    if (file.size > max) {
      return { ok: false, error: "Resume must be 4MB or smaller." };
    }
    const allowed = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!allowed) {
      return { ok: false, error: "Resume must be PDF, DOC, or DOCX." };
    }
    const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const dir = path.join(process.cwd(), "public", "uploads", "career-resumes");
    await mkdir(dir, { recursive: true });
    const filename = `${userId}-${Date.now()}-${safe}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buf);
    resumeRef = `/uploads/career-resumes/${filename}`;
  }

  const { plan, timelineLabel, goalStatement } = generateStoredPlan(profile);

  await prisma.careerRoadmap.upsert({
    where: { userId },
    create: {
      userId,
      careers: profile.careers,
      ageRange: profile.ageRange,
      workStatus: profile.workStatus,
      expLevel: profile.experienceLevel,
      hasDegree: profile.hasDegree,
      resumeRef,
      timelineLabel,
      goalStatement,
      planJson: JSON.stringify(plan),
      progressJson: "{}",
    },
    update: {
      careers: profile.careers,
      ageRange: profile.ageRange,
      workStatus: profile.workStatus,
      expLevel: profile.experienceLevel,
      hasDegree: profile.hasDegree,
      resumeRef,
      timelineLabel,
      goalStatement,
      planJson: JSON.stringify(plan),
      progressJson: "{}",
    },
  });

  revalidatePath("/career-path");
  revalidatePath("/career-path/plan");
  redirect("/career-path/plan");
}

function parseProgressJson(raw: string): Record<string, StepProgressData> {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
  const out: Record<string, StepProgressData> = {};
  for (const [id, val] of Object.entries(parsed)) {
    if (typeof val === "boolean") {
      out[id] = { done: val, notes: {} };
    } else if (typeof val === "object" && val !== null) {
      const v = val as Partial<StepProgressData>;
      out[id] = { done: v.done ?? false, notes: v.notes ?? {} };
    }
  }
  return out;
}

export async function toggleCareerStepCompletion(stepId: string, completed: boolean) {
  const userId = await requireUserId();
  const row = await prisma.careerRoadmap.findUnique({ where: { userId } });
  if (!row) return { ok: false as const };

  const progress = parseProgressJson(row.progressJson);
  progress[stepId] = { done: completed, notes: progress[stepId]?.notes ?? {} };

  await prisma.careerRoadmap.update({
    where: { userId },
    data: { progressJson: JSON.stringify(progress) },
  });
  revalidatePath("/career-path/plan");
  return { ok: true as const };
}

export async function saveResourceNote(
  stepId: string,
  resourceUrl: string,
  noteText: string,
) {
  const userId = await requireUserId();
  const row = await prisma.careerRoadmap.findUnique({ where: { userId } });
  if (!row) return { ok: false as const };

  const progress = parseProgressJson(row.progressJson);
  const existing = progress[stepId] ?? { done: false, notes: {} };
  progress[stepId] = {
    ...existing,
    notes: {
      ...existing.notes,
      [resourceUrl]: { text: noteText, savedAt: new Date().toISOString() },
    },
  };

  await prisma.careerRoadmap.update({
    where: { userId },
    data: { progressJson: JSON.stringify(progress) },
  });
  revalidatePath("/career-path/plan");
  return { ok: true as const };
}

export async function deleteCareerRoadmap() {
  const userId = await requireUserId();
  await prisma.careerRoadmap.deleteMany({ where: { userId } });
  revalidatePath("/career-path");
  revalidatePath("/career-path/plan");
  redirect("/career-path");
}

export async function getCareerRoadmapForViewer() {
  const userId = await requireUserId();
  const row = await prisma.careerRoadmap.findUnique({ where: { userId } });
  if (!row) return null;

  let plan: StoredPlan;
  try {
    plan = JSON.parse(row.planJson) as StoredPlan;
  } catch {
    return null;
  }
  const progress = parseProgressJson(row.progressJson);

  return {
    id: row.id,
    timelineLabel: row.timelineLabel,
    goalStatement: row.goalStatement,
    careers: row.careers,
    ageRange: row.ageRange,
    workStatus: row.workStatus,
    expLevel: row.expLevel,
    hasDegree: row.hasDegree,
    resumeRef: row.resumeRef,
    plan,
    progress,
  };
}
