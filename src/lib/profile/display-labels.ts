import {
  AGE_RANGE_OPTIONS,
  CAREER_PATHS,
  CHALLENGE_OPTIONS,
  COMMUNITY_PREFS,
  CONTENT_LANG_PREFS,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  LEARNING_STYLES,
  NON_STUDENT_BARRIERS,
  NON_STUDENT_EXPERIENCE,
  NON_STUDENT_SITUATION,
  NON_STUDENT_SUPPORT_NEEDS,
  STUDENT_FIELD_INTEREST,
  STUDENT_PRIMARY_GOAL,
  STUDENT_SUPPORT_NEEDS,
  YEARLY_GOAL_OPTIONS,
} from "@/lib/onboarding/options";

const LANG_LABELS: Record<string, string> = {
  english: "English",
  spanish: "Spanish",
  bilingual: "Bilingual (English & Spanish)",
};

export function educationLabel(value: string | null | undefined) {
  if (!value) return null;
  return EDUCATION_LEVELS.find((o) => o.value === value)?.label ?? value;
}

export function careerPathLabel(value: string | null | undefined) {
  if (!value) return null;
  return CAREER_PATHS.find((o) => o.value === value)?.label ?? value;
}

export function challengeLabel(value: string | null | undefined) {
  if (!value) return null;
  return CHALLENGE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function yearlyGoalLabel(value: string | null | undefined) {
  if (!value) return null;
  return YEARLY_GOAL_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function experienceLabel(value: string | null | undefined) {
  if (!value) return null;
  const nonStudent = NON_STUDENT_EXPERIENCE.find((o) => o.value === value)?.label;
  if (nonStudent) return nonStudent;
  return EXPERIENCE_LEVELS.find((o) => o.value === value)?.label ?? value;
}

export function learningStyleLabel(value: string | null | undefined) {
  if (!value) return null;
  return LEARNING_STYLES.find((o) => o.value === value)?.label ?? value;
}

export function contentLangLabel(value: string | null | undefined) {
  if (!value) return null;
  return CONTENT_LANG_PREFS.find((o) => o.value === value)?.label ?? value;
}

export function languageLabels(codes: string[]) {
  return codes
    .map((c) => LANG_LABELS[c] ?? c)
    .filter(Boolean)
    .join(", ");
}

const COMMUNITY_LABEL_MAP: Record<string, string> = Object.fromEntries([
  ...COMMUNITY_PREFS.map((o) => [o.value, o.label] as const),
  ...STUDENT_SUPPORT_NEEDS.map((o) => [o.value, o.label] as const),
  ...NON_STUDENT_SUPPORT_NEEDS.map((o) => [o.value, o.label] as const),
]);

export function communityLabels(values: string[]) {
  return values.map((v) => COMMUNITY_LABEL_MAP[v] ?? v).join(", ");
}

const AUDIENCE_LABELS: Record<string, string> = {
  student: "Student — school & opportunities",
  non_student: "Not a student — career & transition",
};

export function audienceSegmentLabel(value: string | null | undefined) {
  if (!value) return null;
  return AUDIENCE_LABELS[value] ?? value;
}

export function studentFieldInterestLabel(value: string | null | undefined) {
  if (!value) return null;
  return STUDENT_FIELD_INTEREST.find((o) => o.value === value)?.label ?? value;
}

export function studentPrimaryGoalLabel(value: string | null | undefined) {
  if (!value) return null;
  return STUDENT_PRIMARY_GOAL.find((o) => o.value === value)?.label ?? value;
}

export function nonStudentSituationLabel(value: string | null | undefined) {
  if (!value) return null;
  return NON_STUDENT_SITUATION.find((o) => o.value === value)?.label ?? value;
}

export function primaryBarrierLabel(value: string | null | undefined) {
  if (!value) return null;
  return NON_STUDENT_BARRIERS.find((o) => o.value === value)?.label ?? value;
}

export function ageRangeLabel(value: string | null | undefined) {
  if (!value) return null;
  return AGE_RANGE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function yesNo(value: boolean | null | undefined) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "—";
}
