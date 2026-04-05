import { auth } from "@/auth";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import prisma from "@/lib/prisma";

export default async function OnboardingPage() {
  const session = await auth();
  const segment =
    session?.user?.id == null
      ? null
      : (
          await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { audienceSegment: true },
          })
        )?.audienceSegment ?? null;

  return <OnboardingFlow audienceSegment={segment} />;
}
