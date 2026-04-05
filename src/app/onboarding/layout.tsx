import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutForm } from "@/components/auth/sign-out-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=" + encodeURIComponent("/onboarding"));
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { onboardingComplete: true, audienceSegment: true },
  });

  if (profile?.onboardingComplete) {
    if (profile.audienceSegment === "non_student") {
      redirect("/career-path");
    }
    redirect("/home");
  }

  const wideCard = profile?.audienceSegment === "non_student";

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 to-slate-50 px-4 py-10 text-slate-900 [color-scheme:light]">
      <div
        className={`mx-auto rounded-2xl border border-slate-200/80 bg-white p-6 text-slate-900 shadow-sm sm:p-8 ${
          wideCard ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          PUENTE profile
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Let&apos;s set up your profile
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          We start with one question, then a short path matched to your goals.
          You can update everything later from your profile.
        </p>
        <div className="mt-8 text-slate-900">{children}</div>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
          Wrong account?{" "}
          <SignOutForm variant="link" redirectTo="/signin" />
        </div>
      </div>
    </div>
  );
}
