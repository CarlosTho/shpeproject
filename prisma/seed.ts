import { PrismaClient } from "../src/generated/prisma/client";
import { seedDirectoryMembers } from "./seed-directory-members";
import { seedScholarships } from "./seed-scholarships";

const prisma = new PrismaClient();

const LEGACY_DEMO_EMAIL = "carlos@demo.prometeo";

async function main() {
  const removed = await prisma.user.deleteMany({
    where: { email: LEGACY_DEMO_EMAIL },
  });
  if (removed.count > 0) {
    console.log(`Removed legacy demo user (${LEGACY_DEMO_EMAIL}).`);
  }

  await seedScholarships();
  await seedDirectoryMembers(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
