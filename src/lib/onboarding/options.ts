export const EDUCATION_LEVELS = [
  { value: "high_school", label: "High School" },
  { value: "undergrad", label: "College (Undergrad)" },
  { value: "graduate", label: "Graduate" },
  { value: "bootcamp_self", label: "Bootcamp / Self-taught" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "bilingual", label: "Both (bilingual)" },
] as const;

export const CAREER_PATHS = [
  { value: "software_engineering", label: "Software Engineering" },
  { value: "healthcare", label: "Healthcare" },
  { value: "business", label: "Business" },
  { value: "law", label: "Law" },
  { value: "trades", label: "Trades" },
  { value: "other", label: "Other" },
] as const;

export const INTEREST_TAGS = [
  "AI/ML",
  "Web Dev",
  "Data",
  "Finance",
  "Marketing",
  "Hardware",
  "Cloud",
  "Cybersecurity",
  "Product",
  "Design",
  "Research",
] as const;

export const CHALLENGE_OPTIONS = [
  { value: "internships", label: "Finding internships" },
  { value: "classes", label: "Understanding classes" },
  { value: "language", label: "Language barrier" },
  { value: "financial_aid", label: "Financial aid" },
  { value: "other", label: "Something else" },
] as const;

export const YEARLY_GOAL_OPTIONS = [
  { value: "internship", label: "Get an internship" },
  { value: "skill", label: "Learn a skill" },
  { value: "graduate", label: "Graduate" },
  { value: "switch_careers", label: "Switch careers" },
  { value: "other", label: "Other" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const COMMUNITY_PREFS = [
  { value: "mentorship", label: "Mentorship" },
  { value: "internships", label: "Internships" },
  { value: "study_groups", label: "Study groups" },
  { value: "networking", label: "Networking" },
] as const;

export const LEARNING_STYLES = [
  { value: "videos", label: "Videos" },
  { value: "reading", label: "Reading" },
  { value: "interactive", label: "Interactive" },
] as const;

export const CONTENT_LANG_PREFS = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "both", label: "Both" },
] as const;

export const AUDIENCE_SEGMENT = [
  { value: "student", label: "I'm a student", emoji: "🎓" },
  { value: "non_student", label: "I'm not a student", emoji: "💼" },
] as const;

export const STUDENT_FIELD_INTEREST = [
  { value: "tech", label: "Tech" },
  { value: "healthcare", label: "Healthcare" },
  { value: "business", label: "Business" },
  { value: "undecided", label: "Undecided" },
] as const;

export const STUDENT_PRIMARY_GOAL = [
  { value: "internship", label: "Get an internship" },
  { value: "scholarships", label: "Find scholarships" },
  { value: "explore", label: "Explore careers" },
  { value: "skills", label: "Build skills" },
] as const;

export const STUDENT_SUPPORT_NEEDS = [
  { value: "resume_help", label: "Resume" },
  { value: "interview_prep", label: "Interviews" },
  { value: "find_opportunities", label: "Finding opportunities" },
  { value: "classes_help", label: "Understanding classes" },
] as const;

export const NON_STUDENT_SITUATION = [
  { value: "working", label: "Working" },
  { value: "unemployed", label: "Unemployed" },
  { value: "part_time", label: "Part-time / gigs" },
] as const;

export const NON_STUDENT_EXPERIENCE = [
  { value: "none", label: "None" },
  { value: "some", label: "Some" },
  { value: "experienced", label: "Experienced" },
] as const;

export const NON_STUDENT_BARRIERS = [
  { value: "dont_know_start", label: "Don't know where to start" },
  { value: "no_experience", label: "No experience" },
  { value: "language", label: "Language barrier" },
  { value: "financial", label: "Financial issues" },
] as const;

export const NON_STUDENT_SUPPORT_NEEDS = [
  { value: "job_search", label: "Getting a job" },
  { value: "skill_building", label: "Learning skills" },
  { value: "resume_help", label: "Resume" },
  { value: "interview_prep", label: "Interview prep" },
] as const;

export const AGE_RANGE_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "18-22", label: "18–22" },
  { value: "23-27", label: "23–27" },
  { value: "28-35", label: "28–35" },
  { value: "36+", label: "36+" },
] as const;
