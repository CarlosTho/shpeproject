import { PrismaClient } from "@/generated/prisma/client";
import mockPrisma from "./mock-prisma";

// Development bypass flag
const DEV_BYPASS_AUTH = true;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: any;

if (DEV_BYPASS_AUTH && process.env.NODE_ENV === "development") {
  // Use mock prisma in development bypass mode
  prisma = mockPrisma;
} else {
  // Use real prisma
  prisma = globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };
export default prisma;
