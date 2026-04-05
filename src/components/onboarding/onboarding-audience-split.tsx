"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setAudienceSegment } from "@/app/onboarding/actions";
import { AUDIENCE_SEGMENT } from "@/lib/onboarding/options";

export function OnboardingAudienceSplit() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function choose(segment: "student" | "non_student") {
    setError(null);
    startTransition(async () => {
      const res = await setAudienceSegment(segment);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold text-zinc-900">
          Which best describes you right now?
        </h2>
        <p className="mt-1 text-[13px] text-zinc-500">
          We&apos;ll tailor your dashboard, resources, and next steps to your
          situation.
        </p>
      </div>

      <div className="grid gap-2.5">
        {AUDIENCE_SEGMENT.map((o) => (
          <button
            key={o.value}
            type="button"
            disabled={pending}
            onClick={() => choose(o.value as "student" | "non_student")}
            className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-left text-[13px] font-semibold text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50"
          >
            <span className="text-xl" aria-hidden>
              {o.emoji}
            </span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>

      {error ? (
        <p className="text-[13px] text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
