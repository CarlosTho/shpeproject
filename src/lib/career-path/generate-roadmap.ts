import { randomUUID } from "crypto";
import { CAREER_BY_ID } from "./careers";
import type {
  GoalTimeline,
  PlanSection,
  RoadmapStep,
  StoredPlan,
  WeeklyPhase,
  WizardProfile,
} from "./types";
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

function buildEncouragement(profile: WizardProfile): string {
  const timelineMap: Record<GoalTimeline, string> = {
    "3_months": "3 months",
    "6_months": "6 months",
    "1_year": "a year",
  };
  const timeframe = profile.goalTimeline
    ? timelineMap[profile.goalTimeline]
    : "the next few months";

  const hrs = profile.hoursPerWeek ?? 10;
  const careerLabels = profile.careers
    .map((id) => CAREER_BY_ID[id]?.label ?? id)
    .join(" and ");

  if (profile.experienceLevel === "none") {
    return `Everyone who works in ${careerLabels} today once knew nothing about it. You are committing ${hrs} hours a week — that is real. In ${timeframe}, with consistency and these resources, you will have skills, a network, and proof of your work. Take it one week at a time.`;
  }
  if (profile.experienceLevel === "some") {
    return `You already have a foundation — that matters more than you think. At ${hrs} hours a week over ${timeframe}, you will close the gaps quickly and start building the portfolio that gets you hired. You have more momentum than you realize.`;
  }
  return `With your experience, ${timeframe} of focused effort can take you from "I know this field" to "I have the credentials and network to prove it." ${hrs} hours a week is enough. Stay consistent and let this roadmap keep you on track.`;
}

type PhaseConfig = {
  phase: string;
  focus: string;
  weekRange: string;
};

function buildWeeklySchedule(profile: WizardProfile): WeeklyPhase[] {
  const hrs = profile.hoursPerWeek ?? 10;
  const timeline = profile.goalTimeline ?? "6_months";

  const phaseConfigs: Record<GoalTimeline, PhaseConfig[]> = {
    "3_months": [
      { phase: "Phase 1", focus: "Foundations", weekRange: "Weeks 1–4" },
      { phase: "Phase 2", focus: "Skills & Portfolio", weekRange: "Weeks 5–8" },
      { phase: "Phase 3", focus: "Network & Apply", weekRange: "Weeks 9–12" },
    ],
    "6_months": [
      { phase: "Phase 1", focus: "Foundations", weekRange: "Weeks 1–6" },
      { phase: "Phase 2", focus: "Core Skills", weekRange: "Weeks 7–14" },
      { phase: "Phase 3", focus: "Projects & Portfolio", weekRange: "Weeks 15–20" },
      { phase: "Phase 4", focus: "Network & Apply", weekRange: "Weeks 21–26" },
    ],
    "1_year": [
      { phase: "Phase 1", focus: "Foundations", weekRange: "Weeks 1–8" },
      { phase: "Phase 2", focus: "Core Skills", weekRange: "Weeks 9–20" },
      { phase: "Phase 3", focus: "Advanced Skills & Projects", weekRange: "Weeks 21–34" },
      { phase: "Phase 4", focus: "Network & Apply", weekRange: "Weeks 35–52" },
    ],
  };

  const configs = phaseConfigs[timeline];
  const studyHrs = Math.round(hrs * 0.6);
  const practiceHrs = Math.round(hrs * 0.25);
  const networkHrs = hrs - studyHrs - practiceHrs;

  const phaseTasks: Record<string, string[]> = {
    Foundations: [
      "Complete one free course module (30–45 min sessions)",
      "Watch one YouTube tutorial and take notes",
      "Join one relevant online community (Discord, Slack, or Reddit)",
      "Set up your LinkedIn and connect with 3 people in the field",
    ],
    "Core Skills": [
      "Work through hands-on labs or practice platforms daily",
      "Build one small project or case study per week",
      "Attend one virtual meetup or webinar",
      "Message two professionals on LinkedIn — ask a genuine question",
    ],
    "Skills & Portfolio": [
      "Complete one project you can show to an employer",
      "Write a short post or LinkedIn update about what you learned",
      "Add your project to GitHub, Notion, or a portfolio site",
      "Research 5 companies you want to work at",
    ],
    "Advanced Skills & Projects": [
      "Build a project that solves a real problem or uses real data",
      "Contribute to a community (answer questions, share resources)",
      "Start a 30-day streak on your practice platform",
      "Reach out to 3 alumni or professionals for informational interviews",
    ],
    "Projects & Portfolio": [
      "Polish two portfolio projects with clear descriptions",
      "Create or update your resume using free templates from the resources",
      "Set up a simple portfolio page (GitHub Pages, Notion, etc.)",
      "Schedule one informational interview with someone in the field",
    ],
    "Network & Apply": [
      "Apply to at least 3 positions per week",
      "Follow up on applications and track them in a spreadsheet",
      "Prepare answers for the top 5 interview questions in your field",
      "Join a job search accountability group or find a study buddy",
    ],
  };

  return configs.map((cfg) => ({
    phase: `${cfg.phase}: ${cfg.weekRange}`,
    focus: cfg.focus,
    hoursBreakdown: `${hrs} hrs/week — ${studyHrs} hrs learning, ${practiceHrs} hrs practice, ${networkHrs} hr networking`,
    tasks: phaseTasks[cfg.focus] ?? phaseTasks["Foundations"]!,
  }));
}

export function generateStoredPlan(profile: WizardProfile): {
  plan: StoredPlan;
  timelineLabel: string;
  goalStatement: string;
} {
  const timelineLabel = buildTimeline(profile, profile.careers.length);
  const goalStatement = buildGoalStatement(profile);
  const encouragement = buildEncouragement(profile);
  const weeklySchedule = buildWeeklySchedule(profile);

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
      resources: d.resources,
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
    plan: {
      sections,
      hoursPerWeek: profile.hoursPerWeek,
      goalTimeline: profile.goalTimeline,
      weeklySchedule,
      encouragement,
    },
    timelineLabel,
    goalStatement,
  };
}
