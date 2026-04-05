export type CareerDifficulty = "easiest" | "medium" | "harder";

export type CareerDefinition = {
  id: string;
  label: string;
  shortLabel: string;
  difficulty: CareerDifficulty;
};

export type WizardProfile = {
  careers: string[];
  ageRange: string;
  workStatus: "student" | "working" | "unemployed" | "part_time";
  experienceLevel: "none" | "some" | "experienced";
  hasDegree: boolean;
};

export type DraftTemplateStep = {
  key: string;
  title: string;
  description: string;
  details: string;
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
  bridgeLabel: string;
  bridgeHref: string;
};

export type PlanSection = {
  careerId: string;
  label: string;
  steps: RoadmapStep[];
};

export type StoredPlan = {
  sections: PlanSection[];
};
