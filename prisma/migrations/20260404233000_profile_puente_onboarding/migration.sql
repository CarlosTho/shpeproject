-- PUENTE profile fields + onboarding gate
ALTER TABLE "Profile" RENAME COLUMN "year" TO "gradYear";

ALTER TABLE "Profile" ADD COLUMN "onboardingComplete" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Profile" ADD COLUMN "education" TEXT;
ALTER TABLE "Profile" ADD COLUMN "firstGen" BOOLEAN;
ALTER TABLE "Profile" ADD COLUMN "internationalOrDaca" BOOLEAN;
ALTER TABLE "Profile" ADD COLUMN "careerPath" TEXT;
ALTER TABLE "Profile" ADD COLUMN "receivingScholarships" BOOLEAN;
ALTER TABLE "Profile" ADD COLUMN "scholarshipDetails" TEXT;
ALTER TABLE "Profile" ADD COLUMN "seekingScholarships" BOOLEAN;
ALTER TABLE "Profile" ADD COLUMN "experienceLevel" TEXT;
ALTER TABLE "Profile" ADD COLUMN "portfolio" TEXT;
ALTER TABLE "Profile" ADD COLUMN "communityPrefs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Profile" ADD COLUMN "learningStyle" TEXT;
ALTER TABLE "Profile" ADD COLUMN "preferredContentLang" TEXT;
ALTER TABLE "Profile" ADD COLUMN "challenges" TEXT;
ALTER TABLE "Profile" ADD COLUMN "yearlyGoal" TEXT;

UPDATE "Profile" SET "onboardingComplete" = true;
