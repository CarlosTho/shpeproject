import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/** Legacy route — Career Path Generator replaced the generic copilot. */
export default async function CopilotRedirectPage() {
  const session = await auth();
  if (session?.user?.id) {
    const p = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { audienceSegment: true },
    });
    if (p?.audienceSegment === "student") {
      redirect("/home");
    }
  }
  redirect("/career-path");
}

export const dynamic = "force-dynamic";
