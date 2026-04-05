"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeNonStudentOnboarding } from "@/app/onboarding/actions";
import { CAREER_BY_ID, careerGroups } from "@/lib/career-path/careers";
import type { CareerDefinition } from "@/lib/career-path/types";
import {
  AGE_RANGE_OPTIONS,
  CONTENT_LANG_PREFS,
  NON_STUDENT_BARRIERS,
  NON_STUDENT_EXPERIENCE,
  NON_STUDENT_SITUATION,
  NON_STUDENT_SUPPORT_NEEDS,
} from "@/lib/onboarding/options";
import { cn } from "@/lib/utils";

const STEPS = [
  "About you",
  "Situation",
  "Career intent",
  "Barriers & support",
] as const;

function toggleInList(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200";

function difficultyStyles(d: CareerDefinition["difficulty"]) {
  switch (d) {
    case "easiest":
      return "border-teal-100 bg-teal-50/50 text-teal-900";
    case "medium":
      return "border-amber-100 bg-amber-50/50 text-amber-950";
    case "harder":
      return "border-violet-100 bg-violet-50/50 text-violet-950";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-900";
  }
}

function difficultyLabel(d: CareerDefinition["difficulty"]) {
  switch (d) {
    case "easiest":  return "Easiest";
    case "medium":   return "Medium";
    case "harder":   return "Harder";
    default:         return d;
  }
}

function Progress({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex flex-wrap justify-between gap-1 text-[11px] font-medium">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={i <= step ? "text-zinc-900" : "text-zinc-400"}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function NonStudentOnboardingWizard() {
  const router = useRouter();
  const { easiest, medium, harder } = careerGroups();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [ageRange, setAgeRange] = useState<
    "" | "18-22" | "23-27" | "28-35" | "36+"
  >("");
  const [preferredContentLang, setPreferredContentLang] = useState<
    "english" | "spanish" | "both" | ""
  >("");
  const [sixMonthGoal, setSixMonthGoal] = useState("");

  const [nonStudentSituation, setNonStudentSituation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [hasCollegeDegree, setHasCollegeDegree] = useState<boolean | null>(
    null,
  );

  const [targetCareerSlugs, setTargetCareerSlugs] = useState<string[]>([]);
  const [careerIntentText, setCareerIntentText] = useState("");

  const [primaryBarrier, setPrimaryBarrier] = useState("");
  const [location, setLocation] = useState("");
  const [communityPrefs, setCommunityPrefs] = useState<string[]>([]);

  function toggleCareer(id: string) {
    setTargetCareerSlugs((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[0]!, id];
      return [...prev, id];
    });
  }

  function renderGroup(label: string, items: CareerDefinition[]) {
    return (
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((c) => {
            const on = targetCareerSlugs.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCareer(c.id)}
                className={cn(
                  "flex flex-col items-start rounded-xl border px-4 py-3 text-left text-[13px] font-medium transition-colors",
                  difficultyStyles(c.difficulty),
                  on
                    ? "ring-2 ring-zinc-900 ring-offset-2"
                    : "hover:opacity-90"
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide opacity-60">
                  {difficultyLabel(c.difficulty)}
                </span>
                <span className="mt-1">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function canNext(): boolean {
    if (step === 0) {
      return preferredContentLang !== "" && sixMonthGoal.trim().length > 0;
    }
    if (step === 1) {
      return (
        nonStudentSituation.length > 0 &&
        experienceLevel.length > 0 &&
        hasCollegeDegree !== null
      );
    }
    if (step === 2) {
      const hasPick = targetCareerSlugs.length > 0;
      const hasText = careerIntentText.trim().length > 0;
      return hasPick || hasText;
    }
    if (step === 3) {
      return (
        primaryBarrier.length > 0 &&
        location.trim().length > 0 &&
        communityPrefs.length > 0
      );
    }
    return false;
  }

  function submit() {
    if (hasCollegeDegree === null || preferredContentLang === "") return;
    setError(null);
    startTransition(async () => {
      const res = await completeNonStudentOnboarding({
        ageRange,
        preferredContentLang,
        sixMonthGoal,
        nonStudentSituation,
        experienceLevel,
        hasCollegeDegree,
        targetCareerSlugs,
        careerIntentText: careerIntentText.trim() || null,
        primaryBarrier,
        location,
        communityPrefs,
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      router.push("/career-path");
      router.refresh();
    });
  }

  return (
    <div className="animate-fade-up space-y-2 text-zinc-900">
      <Progress step={step} />

      {step === 0 && (
        <div className="space-y-5">
          <h2 className="text-[15px] font-semibold text-zinc-900">About you</h2>
          <label className="block text-[13px] font-medium text-zinc-800">
            Age range (optional)
            <select
              value={ageRange}
              onChange={(e) =>
                setAgeRange(e.target.value as typeof ageRange)
              }
              className={inputClass}
            >
              {AGE_RANGE_OPTIONS.map((o) => (
                <option key={o.value || "skip"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              Preferred language
            </legend>
            <div className="mt-2.5 flex flex-col gap-2">
              {CONTENT_LANG_PREFS.map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 transition-colors has-[:checked]:border-zinc-400 has-[:checked]:bg-zinc-50"
                >
                  <input
                    type="radio"
                    name="clang"
                    checked={preferredContentLang === o.value}
                    onChange={() =>
                      setPreferredContentLang(
                        o.value as "english" | "spanish" | "both",
                      )
                    }
                    className="size-4 border-zinc-300 accent-zinc-900"
                  />
                  <span className="text-[13px] text-zinc-800">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block text-[13px] font-medium text-zinc-800">
            What are you trying to achieve in the next 6 months?
            <textarea
              value={sixMonthGoal}
              onChange={(e) => setSixMonthGoal(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="e.g. Land a full-time role in IT support, or switch from retail to digital marketing."
            />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-[15px] font-semibold text-zinc-900">
            Current situation
          </h2>
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              What are you currently doing?
            </legend>
            <div className="mt-2.5 flex flex-col gap-2">
              {NON_STUDENT_SITUATION.map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] transition-colors has-[:checked]:border-zinc-400 has-[:checked]:bg-zinc-50"
                >
                  <input
                    type="radio"
                    name="sit"
                    checked={nonStudentSituation === o.value}
                    onChange={() => setNonStudentSituation(o.value)}
                    className="size-4 border-zinc-300 accent-zinc-900"
                  />
                  <span className="text-zinc-800">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block text-[13px] font-medium text-zinc-800">
            Experience level in any field
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className={inputClass}
            >
              <option value="">Select…</option>
              {NON_STUDENT_EXPERIENCE.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              Do you have a college degree?
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input
                  type="radio"
                  name="deg"
                  checked={hasCollegeDegree === true}
                  onChange={() => setHasCollegeDegree(true)}
                  className="size-4 border-zinc-300 accent-zinc-900"
                />
                Yes
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input
                  type="radio"
                  name="deg"
                  checked={hasCollegeDegree === false}
                  onChange={() => setHasCollegeDegree(false)}
                  className="size-4 border-zinc-300 accent-zinc-900"
                />
                No
              </label>
            </div>
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-[15px] font-semibold text-zinc-900">
            Career intent
          </h2>
          <p className="text-[13px] text-zinc-500">
            Pick up to two paths below, describe your goal in your own words,
            or both.
          </p>
          {renderGroup("Easiest to enter", easiest)}
          {renderGroup("Medium", medium)}
          {renderGroup("Harder (more learning curve)", harder)}
          <p className="text-[12px] text-zinc-500">
            Selected:{" "}
            <span className="font-medium text-zinc-800">
              {targetCareerSlugs.length === 0
                ? "None yet"
                : targetCareerSlugs
                    .map((id) => CAREER_BY_ID[id]?.label ?? id)
                    .join(" + ")}
            </span>
          </p>
          <label className="block text-[13px] font-medium text-zinc-800">
            Or type what you want to do (optional)
            <textarea
              value={careerIntentText}
              onChange={(e) => setCareerIntentText(e.target.value)}
              rows={2}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              placeholder="Anything we should know about your target role or industry"
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-[15px] font-semibold text-zinc-900">
            Barriers & support
          </h2>
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              What&apos;s your biggest challenge right now?
            </legend>
            <div className="mt-2.5 flex flex-col gap-2">
              {NON_STUDENT_BARRIERS.map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] transition-colors has-[:checked]:border-zinc-400 has-[:checked]:bg-zinc-50"
                >
                  <input
                    type="radio"
                    name="barrier"
                    checked={primaryBarrier === o.value}
                    onChange={() => setPrimaryBarrier(o.value)}
                    className="size-4 border-zinc-300 accent-zinc-900"
                  />
                  <span className="text-zinc-800">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block text-[13px] font-medium text-zinc-800">
            Where are you based?
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
              placeholder="City, state, or country"
            />
          </label>
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              What do you need help with? (pick any that apply)
            </legend>
            <div className="mt-2.5 flex flex-col gap-2">
              {NON_STUDENT_SUPPORT_NEEDS.map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] transition-colors has-[:checked]:border-zinc-400 has-[:checked]:bg-zinc-50"
                >
                  <input
                    type="checkbox"
                    checked={communityPrefs.includes(o.value)}
                    onChange={() =>
                      setCommunityPrefs((p) => toggleInList(p, o.value))
                    }
                    className="size-4 rounded border-zinc-300 accent-zinc-900"
                  />
                  <span className="text-zinc-800">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {error ? (
        <p className="text-[13px] text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={!canNext()}
            onClick={() => setStep((s) => s + 1)}
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={!canNext() || pending}
            onClick={submit}
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-40"
          >
            {pending ? "Saving…" : "Finish & open Career Path"}
          </button>
        )}
      </div>
    </div>
  );
}
