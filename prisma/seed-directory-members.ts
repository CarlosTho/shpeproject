import type { PrismaClient } from "../src/generated/prisma/client";

/**
 * Synthetic members for /directory demos (no password — sign-in not enabled).
 * Emails use @directory.demo.prometeo so they’re obviously non-production.
 */
const DIRECTORY_MEMBERS = [
  {
    email: "mariana.ortiz@directory.demo.prometeo",
    name: "Mariana Ortiz",
    profile: {
      school: "The University of Texas at Austin",
      education: "undergrad",
      major: "Computer Science",
      gradYear: "2026",
      location: "Austin, TX",
      bio: "Longhorn ’26 · interested in distributed systems and campus SHPE events.",
      languages: ["english", "spanish"],
      firstGen: true,
      internationalOrDaca: false,
      careerPath: "software_engineering",
      interests: ["Web Dev", "Cloud", "Cybersecurity"],
      communityPrefs: ["internships", "networking"],
      onboardingComplete: true,
    },
  },
  {
    email: "diego.ramirez@directory.demo.prometeo",
    name: "Diego Ramirez",
    profile: {
      school: "Georgia Institute of Technology",
      education: "undergrad",
      major: "Mechanical Engineering",
      gradYear: "2025",
      location: "Atlanta, GA",
      bio: "Robotics club lead · looking for summer manufacturing / R&D roles.",
      languages: ["english", "spanish"],
      firstGen: false,
      internationalOrDaca: false,
      careerPath: "software_engineering",
      interests: ["Hardware", "AI/ML", "Design"],
      communityPrefs: ["mentorship", "internships"],
      onboardingComplete: true,
    },
  },
  {
    email: "sofia.hernandez@directory.demo.prometeo",
    name: "Sofía Hernández",
    profile: {
      school: "University of California, Los Angeles",
      education: "undergrad",
      major: "Electrical Engineering",
      gradYear: "2027",
      location: "Los Angeles, CA",
      bio: "Signals & systems · first-gen; volunteering with Noche de Ciencias outreach.",
      languages: ["english", "spanish"],
      firstGen: true,
      internationalOrDaca: false,
      careerPath: "healthcare",
      interests: ["Hardware", "Research", "Data"],
      communityPrefs: ["study_groups", "networking"],
      onboardingComplete: true,
    },
  },
  {
    email: "alejandro.vega@directory.demo.prometeo",
    name: "Alejandro Vega",
    profile: {
      school: "University of Illinois Urbana-Champaign",
      education: "undergrad",
      major: "Aerospace Engineering",
      gradYear: "2026",
      location: "Champaign, IL",
      bio: "Propulsion research assistant · Bilingual (EN/ES), targeting defense & space internships.",
      languages: ["english", "spanish"],
      firstGen: false,
      internationalOrDaca: true,
      careerPath: "other",
      interests: ["Research", "Hardware", "Cloud"],
      communityPrefs: ["internships", "mentorship"],
      onboardingComplete: true,
    },
  },
  {
    email: "valentina.cruz@directory.demo.prometeo",
    name: "Valentina Cruz",
    profile: {
      school: "Stanford University",
      education: "graduate",
      major: "Computer Science (MS)",
      gradYear: "2025",
      location: "Stanford, CA",
      bio: "HCI & fairness in ML · ex-big-tech intern, happy to mock-interview peers.",
      languages: ["english", "spanish"],
      firstGen: false,
      internationalOrDaca: false,
      careerPath: "software_engineering",
      interests: ["AI/ML", "Product", "Web Dev"],
      communityPrefs: ["mentorship", "networking"],
      onboardingComplete: true,
    },
  },
] as const;

export async function seedDirectoryMembers(prisma: PrismaClient): Promise<void> {
  for (const m of DIRECTORY_MEMBERS) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      create: {
        email: m.email,
        name: m.name,
        passwordHash: null,
      },
      update: {
        name: m.name,
      },
    });

    const p = m.profile;
    await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        school: p.school,
        education: p.education,
        major: p.major,
        gradYear: p.gradYear,
        location: p.location,
        bio: p.bio,
        languages: [...p.languages],
        firstGen: p.firstGen,
        internationalOrDaca: p.internationalOrDaca,
        careerPath: p.careerPath,
        interests: [...p.interests],
        communityPrefs: [...p.communityPrefs],
        onboardingComplete: p.onboardingComplete,
      },
      update: {
        school: p.school,
        education: p.education,
        major: p.major,
        gradYear: p.gradYear,
        location: p.location,
        bio: p.bio,
        languages: [...p.languages],
        firstGen: p.firstGen,
        internationalOrDaca: p.internationalOrDaca,
        careerPath: p.careerPath,
        interests: [...p.interests],
        communityPrefs: [...p.communityPrefs],
        onboardingComplete: p.onboardingComplete,
      },
    });
  }

  console.log(
    `Seeded ${DIRECTORY_MEMBERS.length} directory demo members (@directory.demo.prometeo — no password login).`,
  );
}
