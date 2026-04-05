import type { CareerDefinition } from "./types";

export const CAREERS: CareerDefinition[] = [
  { id: "it_support", label: "IT Support", shortLabel: "IT Support", difficulty: "easiest" },
  { id: "sales_sdr", label: "Sales (SDR)", shortLabel: "SDR Sales", difficulty: "easiest" },
  { id: "recruiting", label: "Recruiting", shortLabel: "Recruiting", difficulty: "easiest" },
  {
    id: "digital_marketing",
    label: "Digital Marketing",
    shortLabel: "Digital Marketing",
    difficulty: "medium",
  },
  {
    id: "project_coordinator",
    label: "Project Coordinator",
    shortLabel: "Project Coordinator",
    difficulty: "medium",
  },
  { id: "data_analyst", label: "Data Analyst", shortLabel: "Data Analyst", difficulty: "medium" },
  {
    id: "web_development",
    label: "Web Development",
    shortLabel: "Web Development",
    difficulty: "harder",
  },
  { id: "cybersecurity", label: "Cybersecurity", shortLabel: "Cybersecurity", difficulty: "harder" },
];

export const CAREER_BY_ID = Object.fromEntries(CAREERS.map((c) => [c.id, c])) as Record<
  string,
  CareerDefinition
>;

export function careerGroups() {
  const easiest = CAREERS.filter((c) => c.difficulty === "easiest");
  const medium = CAREERS.filter((c) => c.difficulty === "medium");
  const harder = CAREERS.filter((c) => c.difficulty === "harder");
  return { easiest, medium, harder };
}
