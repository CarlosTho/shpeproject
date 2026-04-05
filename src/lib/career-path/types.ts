export type CareerDifficulty = "easiest" | "medium" | "harder";

export type CareerDefinition = {
  id: string;
  label: string;
  shortLabel: string;
  difficulty: CareerDifficulty;
};

export type GoalTimeline = "3_months" | "6_months" | "1_year";

export type WizardProfile = {
  careers: string[];
  ageRange: string;
  workStatus: "student" | "working" | "unemployed" | "part_time";
  experienceLevel: "none" | "some" | "experienced";
  hasDegree: boolean;
  hoursPerWeek: number;
  goalTimeline: GoalTimeline;
};

export type FreeResource = {
  label: string;
  url: string;
  note?: string;
  /** true = primarily paid; undefined/false = free or free-tier available */
  paid?: boolean;
};

export type ResourceNote = {
  text: string;
  savedAt: string; // ISO date string
};

export type StepProgressData = {
  done: boolean;
  notes: Record<string, ResourceNote>; // key = resource URL
};

export type DraftTemplateStep = {
  key: string;
  title: string;
  description: string;
  details: string;
  resources?: FreeResource[];
  bridgeLabel: string;
  bridgeHref: string;
  /** Only show when user has zero prior experience in this field */
  beginnerOnly?: boolean;
};

export type RoadmapStep = {
  id: string;
  careerId: string;
  title: string;
  description: string;
  details: string;
  resources?: FreeResource[];
  bridgeLabel: string;
  bridgeHref: string;
};

export type PlanSection = {
  careerId: string;
  label: string;
  steps: RoadmapStep[];
};

export type WeeklyPhase = {
  phase: string;
  focus: string;
  hoursBreakdown: string;
  tasks: string[];
};

export type StoredPlan = {
  sections: PlanSection[];
  hoursPerWeek?: number;
  goalTimeline?: GoalTimeline;
  weeklySchedule?: WeeklyPhase[];
  encouragement?: string;
};
