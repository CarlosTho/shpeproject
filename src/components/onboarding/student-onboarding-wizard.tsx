"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeStudentOnboarding } from "@/app/onboarding/actions";
import {
  CONTENT_LANG_PREFS,
  EDUCATION_LEVELS,
  STUDENT_FIELD_INTEREST,
  STUDENT_PRIMARY_GOAL,
  STUDENT_SUPPORT_NEEDS,
} from "@/lib/onboarding/options";

const STEPS = [
  "Education",
  "Background",
  "Direction",
  "Scholarships & support",
] as const;

const GRAD_YEARS = Array.from({ length: 14 }, (_, i) => String(2023 + i));

function toggleInList(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200";

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

export function StudentOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [education, setEducation] = useState("undergrad");

  const [firstGen, setFirstGen] = useState<boolean | null>(null);
  const [preferredContentLang, setPreferredContentLang] = useState<
    "english" | "spanish" | "both" | ""
  >("");
  const [internationalOrDaca, setInternationalOrDaca] = useState(false);

  const [studentFieldInterest, setStudentFieldInterest] = useState("");
  const [studentPrimaryGoal, setStudentPrimaryGoal] = useState("");
  const [sixMonthGoal, setSixMonthGoal] = useState("");

  const [receivingScholarships, setReceivingScholarships] = useState<
    boolean | null
  >(null);
  const [scholarshipDetails, setScholarshipDetails] = useState("");
  const [seekingScholarships, setSeekingScholarships] = useState<
    boolean | null
  >(null);
  const [location, setLocation] = useState("");
  const [communityPrefs, setCommunityPrefs] = useState<string[]>([]);

  function canNext(): boolean {
    if (step === 0) {
      return (
        school.trim().length > 0 &&
        major.trim().length > 0 &&
        gradYear.length > 0 &&
        education.length > 0
      );
    }
    if (step === 1) {
      return firstGen !== null && preferredContentLang !== "";
    }
    if (step === 2) {
      return (
        studentFieldInterest.length > 0 &&
        studentPrimaryGoal.length > 0 &&
        sixMonthGoal.trim().length > 0
      );
    }
    if (step === 3) {
      return (
        receivingScholarships !== null &&
        seekingScholarships !== null &&
        location.trim().length > 0 &&
        communityPrefs.length > 0
      );
    }
    return false;
  }

  function submit() {
    if (
      firstGen === null ||
      receivingScholarships === null ||
      seekingScholarships === null ||
      preferredContentLang === ""
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await completeStudentOnboarding({
        school,
        major,
        gradYear,
        education,
        firstGen,
        preferredContentLang,
        internationalOrDaca,
        studentFieldInterest,
        studentPrimaryGoal,
        sixMonthGoal,
        receivingScholarships,
        scholarshipDetails: scholarshipDetails.trim() || null,
        seekingScholarships,
        location,
        communityPrefs,
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      router.push("/home");
      router.refresh();
    });
  }

  return (
    <div className="animate-fade-up space-y-2 text-zinc-900">
      <Progress step={step} />

      {step === 0 && (
        <div className="space-y-5">
          <h2 className="text-[15px] font-semibold text-zinc-900">Education</h2>
          <label className="block text-[13px] font-medium text-zinc-800">
            What school do you attend?
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className={inputClass}
              placeholder="University or college"
            />
          </label>
          <label className="block text-[13px] font-medium text-zinc-800">
            Major or intended major
            <input
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className={inputClass}
              placeholder="e.g. Mechanical Engineering"
            />
          </label>
          <label className="block text-[13px] font-medium text-zinc-800">
            Graduation year
            <select
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              className={inputClass}
            >
              <option value="">Select…</option>
              {GRAD_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[13px] font-medium text-zinc-800">
            Education level
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className={inputClass}
            >
              {EDUCATION_LEVELS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-[15px] font-semibold text-zinc-900">Background</h2>
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              Do you identify as a first-generation college student?
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input
                  type="radio"
                  name="firstGen"
                  checked={firstGen === true}
                  onChange={() => setFirstGen(true)}
                  className="size-4 border-zinc-300 accent-zinc-900"
                />
                Yes
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input
                  type="radio"
                  name="firstGen"
                  checked={firstGen === false}
                  onChange={() => setFirstGen(false)}
                  className="size-4 border-zinc-300 accent-zinc-900"
                />
                No
              </label>
            </div>
          </fieldset>
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
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
            <input
              type="checkbox"
              checked={internationalOrDaca}
              onChange={(e) => setInternationalOrDaca(e.target.checked)}
              className="size-4 rounded border-zinc-300 accent-zinc-900"
            />
            International student or DACA (optional)
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-[15px] font-semibold text-zinc-900">
            Direction & goals
          </h2>
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              What are you interested in?
            </legend>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {STUDENT_FIELD_INTEREST.map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] transition-colors has-[:checked]:border-zinc-400 has-[:checked]:bg-zinc-50"
                >
                  <input
                    type="radio"
                    name="field"
                    checked={studentFieldInterest === o.value}
                    onChange={() => setStudentFieldInterest(o.value)}
                    className="size-4 border-zinc-300 accent-zinc-900"
                  />
                  <span className="text-zinc-800">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              What are you trying to do right now?
            </legend>
            <div className="mt-2.5 flex flex-col gap-2">
              {STUDENT_PRIMARY_GOAL.map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] transition-colors has-[:checked]:border-zinc-400 has-[:checked]:bg-zinc-50"
                >
                  <input
                    type="radio"
                    name="primary"
                    checked={studentPrimaryGoal === o.value}
                    onChange={() => setStudentPrimaryGoal(o.value)}
                    className="size-4 border-zinc-300 accent-zinc-900"
                  />
                  <span className="text-zinc-800">{o.label}</span>
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
              placeholder="Be specific — we use this to focus your roadmap and tips."
            />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-[15px] font-semibold text-zinc-900">
            Scholarships, location & support
          </h2>
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              Are you currently receiving scholarships?
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input
                  type="radio"
                  name="recv"
                  checked={receivingScholarships === true}
                  onChange={() => setReceivingScholarships(true)}
                  className="size-4 border-zinc-300 accent-zinc-900"
                />
                Yes
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input
                  type="radio"
                  name="recv"
                  checked={receivingScholarships === false}
                  onChange={() => setReceivingScholarships(false)}
                  className="size-4 border-zinc-300 accent-zinc-900"
                />
                No
              </label>
            </div>
          </fieldset>
          {receivingScholarships ? (
            <label className="block text-[13px] font-medium text-zinc-800">
              Scholarship names (optional)
              <input
                value={scholarshipDetails}
                onChange={(e) => setScholarshipDetails(e.target.value)}
                className={inputClass}
                placeholder="e.g. SHPE National Scholarship"
              />
            </label>
          ) : null}
          <fieldset>
            <legend className="text-[13px] font-medium text-zinc-800">
              Are you looking for scholarships?
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input
                  type="radio"
                  name="seek"
                  checked={seekingScholarships === true}
                  onChange={() => setSeekingScholarships(true)}
                  className="size-4 border-zinc-300 accent-zinc-900"
                />
                Yes
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                <input
                  type="radio"
                  name="seek"
                  checked={seekingScholarships === false}
                  onChange={() => setSeekingScholarships(false)}
                  className="size-4 border-zinc-300 accent-zinc-900"
                />
                No
              </label>
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
              What do you need help with most? (pick any that apply)
            </legend>
            <div className="mt-2.5 flex flex-col gap-2">
              {STUDENT_SUPPORT_NEEDS.map((o) => (
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
            {pending ? "Saving…" : "Finish & go to home"}
          </button>
        )}
      </div>
    </div>
  );
}
