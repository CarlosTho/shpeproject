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
    <div className="space-y-6 text-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Which best describes you right now?
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          We&apos;ll tailor your dashboard, resources, and next steps to your
          situation.
        </p>
      </div>

      <div className="grid gap-3">
        {AUDIENCE_SEGMENT.map((o) => (
          <button
            key={o.value}
            type="button"
            disabled={pending}
            onClick={() => choose(o.value as "student" | "non_student")}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-slate-900 shadow-sm transition hover:border-teal-300/80 hover:bg-teal-50/40 disabled:opacity-50"
          >
            <span className="text-2xl" aria-hidden>
              {o.emoji}
            </span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
