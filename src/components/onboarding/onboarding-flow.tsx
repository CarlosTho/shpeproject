"use client";

import { OnboardingAudienceSplit } from "@/components/onboarding/onboarding-audience-split";
import { NonStudentOnboardingWizard } from "@/components/onboarding/non-student-onboarding-wizard";
import { StudentOnboardingWizard } from "@/components/onboarding/student-onboarding-wizard";

export function OnboardingFlow({
  audienceSegment,
}: {
  audienceSegment: string | null;
}) {
  if (!audienceSegment) {
    return <OnboardingAudienceSplit />;
  }
  if (audienceSegment === "student") {
    return <StudentOnboardingWizard />;
  }
  if (audienceSegment === "non_student") {
    return <NonStudentOnboardingWizard />;
  }
  return <OnboardingAudienceSplit />;
}
