import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CareerWizard } from "@/components/career-path/career-wizard";
import { CAREERS } from "@/lib/career-path/careers";
import prisma from "@/lib/prisma";

export default async function CareerPathPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=" + encodeURIComponent("/career-path"));
  }

  const existing = await prisma.careerRoadmap.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    redirect("/career-path/plan");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { targetCareerSlugs: true, audienceSegment: true },
  });
  if (profile?.audienceSegment === "student") {
    redirect("/home");
  }
  const initialCareerIds = profile?.targetCareerSlugs ?? [];

  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <CareerWizard careers={CAREERS} initialCareerIds={initialCareerIds} />
    </main>
  );
}
