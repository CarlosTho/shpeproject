import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

/**
 * ScholarSHPE official dates — re-check each academic cycle:
 * https://shpe.org/engage/programs/scholarshpe/
 * deadline = application *closes* (shown as “Deadline” in the app).
 */
const SHPE_SCHOLARSHPE = {
  name: "ScholarSHPE",
  applyUrl: "https://shpe.org/engage/programs/scholarshpe/",
  deadline: new Date("2026-02-16T12:00:00.000Z"),
  gpaRequirement: 2.5,
  description:
    "ScholarSHPE for active SHPE members in STEM. 2026–2027 cycle: applications open Feb 2 and close Feb 16, 2026. Review Mar–Jun; award notifications Jul–Sep (corporate) or Dec–Jan (SHPE-funded). Minimum cumulative GPA 2.5.",
} as const;

const scholarships = [
  {
    name: "HSF Scholar Program",
    organization: "Hispanic Scholarship Fund",
    description:
      "The HSF Scholar Program awards scholarships to outstanding Latino students across the U.S. in all majors and degree levels.",
    amount: "500 – 5,000",
    deadline: new Date("2026-10-15"),
    gpaRequirement: 3.0,
    levelRequirement: ["Undergraduate", "Graduate"],
    majors: ["All Majors"],
    tags: ["Hispanic/Latino", "Need-based", "Merit"],
    applyUrl: "https://www.hsf.net/scholarship",
  },
  {
    name: SHPE_SCHOLARSHPE.name,
    organization: "Society of Hispanic Professional Engineers",
    description: SHPE_SCHOLARSHPE.description,
    amount: "1,000 – 5,000",
    deadline: SHPE_SCHOLARSHPE.deadline,
    gpaRequirement: SHPE_SCHOLARSHPE.gpaRequirement,
    levelRequirement: ["Undergraduate", "Graduate"],
    majors: ["Engineering", "Computer Science", "STEM"],
    tags: ["Hispanic/Latino", "STEM", "Engineering"],
    applyUrl: SHPE_SCHOLARSHPE.applyUrl,
  },
  {
    name: "Google Lime Scholarship",
    organization: "Google",
    description:
      "For students with disabilities pursuing computer science or related technical degrees. Provides financial support and networking.",
    amount: "10,000",
    deadline: new Date("2026-12-05"),
    gpaRequirement: 2.8,
    levelRequirement: ["Undergraduate", "Graduate"],
    majors: ["Computer Science", "Computer Engineering", "Software Engineering"],
    tags: ["Disability", "Tech", "STEM"],
    applyUrl: "https://buildyourfuture.withgoogle.com/scholarships/lime-scholarship",
  },
  {
    name: "Generation Google Scholarship",
    organization: "Google",
    description:
      "For students from underrepresented groups in tech pursuing CS degrees. Aims to help aspiring technologists by providing scholarships.",
    amount: "10,000",
    deadline: new Date("2026-12-12"),
    gpaRequirement: 3.0,
    levelRequirement: ["Undergraduate"],
    majors: ["Computer Science", "Computer Engineering"],
    tags: ["Underrepresented in Tech", "STEM"],
    applyUrl: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship",
  },
  {
    name: "HACU National Internship Program (HNIP)",
    organization: "Hispanic Association of Colleges and Universities",
    description:
      "Provides paid internships with federal agencies and private corporations for students attending HACU-member institutions.",
    amount: "Paid Internship + Scholarship",
    deadline: new Date("2026-11-01"),
    gpaRequirement: 3.0,
    levelRequirement: ["Undergraduate", "Graduate"],
    majors: ["All Majors"],
    tags: ["Hispanic/Latino", "Internship", "Federal"],
    applyUrl: "https://www.hacu.net/hacu/HNIP.asp",
  },
  {
    name: "NSBE – Leidos Scholarship",
    organization: "National Society of Black Engineers",
    description:
      "For NSBE members majoring in engineering, computer science, or related STEM fields demonstrating leadership and academic excellence.",
    amount: "5,000",
    deadline: new Date("2026-09-30"),
    gpaRequirement: 3.2,
    levelRequirement: ["Undergraduate"],
    majors: ["Engineering", "Computer Science", "STEM"],
    tags: ["Black/African American", "STEM", "Leadership"],
    applyUrl: "https://www.nsbe.org/scholarships",
  },
  {
    name: "SWE Scholarship Program",
    organization: "Society of Women Engineers",
    description:
      "Scholarships for women pursuing engineering, CS, and technology degrees. One of the largest scholarship programs for women in STEM.",
    amount: "1,000 – 17,000",
    deadline: new Date("2027-02-14"),
    gpaRequirement: 3.0,
    levelRequirement: ["Undergraduate", "Graduate"],
    majors: ["Engineering", "Computer Science", "Technology"],
    tags: ["Women in STEM", "Engineering"],
    applyUrl: "https://scholarships.swe.org/",
  },
  {
    name: "Gates Scholarship",
    organization: "Bill & Melinda Gates Foundation",
    description:
      "A highly selective, full scholarship for Pell-eligible minority high school seniors. Covers full cost of attendance not covered by other aid.",
    amount: "Full Cost of Attendance",
    deadline: new Date("2026-09-15"),
    gpaRequirement: 3.3,
    levelRequirement: ["High School Senior", "Undergraduate"],
    majors: ["All Majors"],
    tags: ["Minority", "Full Ride", "Need-based"],
    applyUrl: "https://www.thegatesscholarship.org/",
  },
  {
    name: "AISES Intel Growing the Legacy Scholarship",
    organization: "American Indian Science and Engineering Society",
    description:
      "For AISES members who are American Indian, Alaska Native, Native Hawaiian, Pacific Islander, or Indigenous pursuing STEM degrees.",
    amount: "10,000",
    deadline: new Date("2026-05-31"),
    gpaRequirement: 3.0,
    levelRequirement: ["Undergraduate", "Graduate"],
    majors: ["Engineering", "Computer Science", "STEM"],
    tags: ["Indigenous", "STEM"],
    applyUrl: "https://www.aises.org/students/scholarships",
  },
  {
    name: "Point Foundation Scholarship",
    organization: "Point Foundation",
    description:
      "For LGBTQ+ students of merit. Provides financial support, mentoring, leadership development, and community engagement.",
    amount: "Up to 28,000/year",
    deadline: new Date("2027-01-28"),
    gpaRequirement: 3.5,
    levelRequirement: ["Undergraduate", "Graduate"],
    majors: ["All Majors"],
    tags: ["LGBTQ+", "Leadership", "Merit"],
    applyUrl: "https://pointfoundation.org/point-apply/",
  },
];

export async function seedScholarships(): Promise<void> {
  try {
    const fixed = await prisma.scholarship.updateMany({
      where: {
        AND: [
          { applyUrl: { contains: "shpe.org" } },
          { applyUrl: { contains: "/students/scholarship" } },
        ],
      },
      data: {
        applyUrl: "https://shpe.org/engage/programs/scholarshpe/",
      },
    });
    if (fixed.count > 0) {
      console.log(
        `Updated ${fixed.count} scholarship row(s) with retired SHPE /students/scholarship URL.`,
      );
    }

    const shpeSynced = await prisma.scholarship.updateMany({
      where: {
        OR: [
          { name: "SHPE Foundation Scholarship" },
          { name: SHPE_SCHOLARSHPE.name },
          {
            organization: "Society of Hispanic Professional Engineers",
            applyUrl: { contains: "scholarshpe" },
          },
        ],
      },
      data: {
        name: SHPE_SCHOLARSHPE.name,
        description: SHPE_SCHOLARSHPE.description,
        deadline: SHPE_SCHOLARSHPE.deadline,
        gpaRequirement: SHPE_SCHOLARSHPE.gpaRequirement,
        applyUrl: SHPE_SCHOLARSHPE.applyUrl,
      },
    });
    if (shpeSynced.count > 0) {
      console.log(
        `Synced ${shpeSynced.count} ScholarSHPE row(s) with official dates (see SHPE_SCHOLARSHPE in seed).`,
      );
    }

    const count = await prisma.scholarship.count();
    if (count > 0) {
      console.log(
        `Scholarships table already has ${count} records — skipping seed.`,
      );
      return;
    }

    await prisma.scholarship.createMany({ data: scholarships });
    console.log(`Seeded ${scholarships.length} scholarships.`);
  } finally {
    await prisma.$disconnect();
  }
}

const runDirectly =
  path.basename(fileURLToPath(import.meta.url)) ===
  path.basename(process.argv[1] ?? "");

if (runDirectly) {
  seedScholarships().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
