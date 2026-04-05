import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { HomeSidebar } from "@/components/home/home-sidebar";

export async function AppSidebar() {
  const session = await auth();
  let audienceSegment: "student" | "non_student" | null = null;
  if (session?.user?.id) {
    const p = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { audienceSegment: true },
    });
    if (p?.audienceSegment === "student" || p?.audienceSegment === "non_student") {
      audienceSegment = p.audienceSegment;
    }
  }
  return <HomeSidebar audienceSegment={audienceSegment} />;
}
