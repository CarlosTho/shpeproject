import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/** Signed-in users only; redirect to sign-in with return URL. */
export async function requireSession(callbackUrl: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=" + encodeURIComponent(callbackUrl));
  }
  return session;
}

/** Require completed PUENTE onboarding (profile setup). */
export async function requireOnboardingComplete(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { onboardingComplete: true },
  });
  if (!profile?.onboardingComplete) {
    redirect("/onboarding");
  }
}

export async function requireAppAccess(pathForSignIn: string) {
  const session = await requireSession(pathForSignIn);
  await requireOnboardingComplete(session.user.id);
  return session;
}
