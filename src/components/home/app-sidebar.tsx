import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { HomeSidebar } from "@/components/home/home-sidebar";

/** Hides Career Path nav for users on the student onboarding track. */
export async function AppSidebar() {
  const session = await auth();
  let showCareerPathNav = true;
  if (session?.user?.id) {
    const p = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { audienceSegment: true },
    });
    if (p?.audienceSegment === "student") {
      showCareerPathNav = false;
    }
  }
  return <HomeSidebar showCareerPathNav={showCareerPathNav} />;
}
