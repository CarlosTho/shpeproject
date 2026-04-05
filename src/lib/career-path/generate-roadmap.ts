import { randomUUID } from "crypto";
import { CAREER_BY_ID } from "./careers";
import type { PlanSection, RoadmapStep, StoredPlan, WizardProfile } from "./types";
import {
  draftStepsForCareer,
  filterStepsForExperience,
  maybeAppendNoDegreeStep,
} from "./templates";

function buildTimeline(profile: WizardProfile, careerCount: number): string {
  const base =
    careerCount >= 2
      ? "About 90–120 days for two parallel tracks"
      : "About 60–90 days for your first milestones";

  if (profile.workStatus === "working" || profile.workStatus === "part_time") {
    return `${base}, paced for evenings/weekends (~6–8 hrs/week)`;
  }
  if (profile.workStatus === "student") {
    return `${base}, aligned with a student schedule`;
  }
  return `${base}, with focused weekly sprints while you search`;
}

function buildGoalStatement(profile: WizardProfile): string {
  const labels = profile.careers
    .map((id) => CAREER_BY_ID[id]?.label ?? id)
    .join(" + ");
  const focus =
    profile.experienceLevel === "none"
      ? "starting from foundational steps"
      : profile.experienceLevel === "some"
        ? "accelerating past pure beginner work"
        : "moving fast with your existing experience";

  return `Your PUENTE roadmap toward ${labels} — ${focus}. Clear weekly actions, human support when you want it.`;
}

export function generateStoredPlan(profile: WizardProfile): {
  plan: StoredPlan;
  timelineLabel: string;
  goalStatement: string;
} {
  const timelineLabel = buildTimeline(profile, profile.careers.length);
  const goalStatement = buildGoalStatement(profile);

  const sections: PlanSection[] = [];

  for (const careerId of profile.careers) {
    const meta = CAREER_BY_ID[careerId];
    if (!meta) continue;

    let drafts = draftStepsForCareer(careerId);
    drafts = filterStepsForExperience(drafts, profile.experienceLevel);
    drafts = maybeAppendNoDegreeStep(drafts, profile.hasDegree);

    const steps: RoadmapStep[] = drafts.map((d) => ({
      id: randomUUID(),
      careerId,
      title: d.title,
      description: d.description,
      details: d.details,
      bridgeLabel: d.bridgeLabel,
      bridgeHref: d.bridgeHref,
    }));

    sections.push({
      careerId,
      label: meta.label,
      steps,
    });
  }

  return {
    plan: { sections },
    timelineLabel,
    goalStatement,
  };
}
