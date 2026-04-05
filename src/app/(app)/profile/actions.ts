"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export type ProfileView = {
  userId: string;
  name: string | null;
  email: string;
  image: string | null;
  profile: {
    school: string | null;
    education: string | null;
    major: string | null;
    gradYear: string | null;
    location: string | null;
    languages: string[];
    firstGen: boolean | null;
    internationalOrDaca: boolean | null;
    careerPath: string | null;
    interests: string[];
    challenges: string | null;
    yearlyGoal: string | null;
    experienceLevel: string | null;
    communityPrefs: string[];
    linkedin: string | null;
    github: string | null;
    portfolio: string | null;
    receivingScholarships: boolean | null;
    scholarshipDetails: string | null;
    seekingScholarships: boolean | null;
    learningStyle: string | null;
    preferredContentLang: string | null;
    bio: string | null;
    onboardingComplete: boolean;
    userType: string;
    audienceSegment: string | null;
    sixMonthGoal: string | null;
    studentFieldInterest: string | null;
    studentPrimaryGoal: string | null;
    ageRange: string | null;
    nonStudentSituation: string | null;
    careerIntentText: string | null;
    targetCareerSlugs: string[];
    primaryBarrier: string | null;
    hasCollegeDegree: boolean | null;
  } | null;
};

export async function getProfileForViewer(): Promise<ProfileView | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      profile: true,
    },
  });

  if (!user) return null;

  const p = user.profile;
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    profile: p
      ? {
          school: p.school,
          education: p.education,
          major: p.major,
          gradYear: p.gradYear,
          location: p.location,
          languages: p.languages,
          firstGen: p.firstGen,
          internationalOrDaca: p.internationalOrDaca,
          careerPath: p.careerPath,
          interests: p.interests,
          challenges: p.challenges,
          yearlyGoal: p.yearlyGoal,
          experienceLevel: p.experienceLevel,
          communityPrefs: p.communityPrefs,
          linkedin: p.linkedin,
          github: p.github,
          portfolio: p.portfolio,
          receivingScholarships: p.receivingScholarships,
          scholarshipDetails: p.scholarshipDetails,
          seekingScholarships: p.seekingScholarships,
          learningStyle: p.learningStyle,
          preferredContentLang: p.preferredContentLang,
          bio: p.bio,
          onboardingComplete: p.onboardingComplete,
          userType: p.userType,
          audienceSegment: p.audienceSegment,
          sixMonthGoal: p.sixMonthGoal,
          studentFieldInterest: p.studentFieldInterest,
          studentPrimaryGoal: p.studentPrimaryGoal,
          ageRange: p.ageRange,
          nonStudentSituation: p.nonStudentSituation,
          careerIntentText: p.careerIntentText,
          targetCareerSlugs: p.targetCareerSlugs,
          primaryBarrier: p.primaryBarrier,
          hasCollegeDegree: p.hasCollegeDegree,
        }
      : null,
  };
}
