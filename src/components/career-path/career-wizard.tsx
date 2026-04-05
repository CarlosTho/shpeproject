"use client";

import { useActionState, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  createCareerRoadmap,
  type CreateRoadmapResult,
} from "@/app/(app)/career-path/actions";
import type { CareerDefinition } from "@/lib/career-path/types";
import { careerGroups } from "@/lib/career-path/careers";
import { cn } from "@/lib/utils";

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

const inputClass =
  "mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200";

export function CareerWizard({
  careers,
  initialCareerIds = [],
}: {
  careers: CareerDefinition[];
  initialCareerIds?: string[];
}) {
  const { easiest, medium, harder } = careerGroups();
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string[]>(() =>
    initialCareerIds
      .filter((id) => careers.some((c) => c.id === id))
      .slice(0, 2),
  );
  const [state, formAction, pending] = useActionState<
    CreateRoadmapResult | null,
    FormData
  >(createCareerRoadmap, null);

  function toggleCareer(id: string) {
    setSelected((prev) => {
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
            const on = selected.includes(c.id);
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

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600">
          Career Path Generator
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          You are closer than you think
        </h1>
        <p className="text-[13px] leading-relaxed text-zinc-500">
          Pick up to two paths, answer a few quick questions, and we will build
          a week-by-week roadmap with free resources and real people ready to
          help you.
        </p>
      </header>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-400">
        <span className={step === 1 ? "text-zinc-900" : ""}>1. Careers</span>
        <ChevronRight className="size-3 opacity-40" aria-hidden />
        <span className={step === 2 ? "text-zinc-900" : ""}>2. Your profile</span>
      </div>

      {step === 1 ? (
        <section className="space-y-7 rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
          <div>
            <h2 className="text-[14px] font-semibold text-zinc-900">
              What are you aiming for?
            </h2>
            <p className="mt-1 text-[12px] text-zinc-500">
              Select one or two careers (max two). Colors show rough difficulty —
              not limits, just pacing hints.
            </p>
          </div>
          {renderGroup("Easiest to enter", easiest)}
          {renderGroup("Medium", medium)}
          {renderGroup("Harder (more learning curve)", harder)}
          <p className="text-[12px] text-zinc-500">
            Selected:{" "}
            <span className="font-medium text-zinc-800">
              {selected.length === 0
                ? "None yet"
                : selected
                    .map((id) => careers.find((c) => c.id === id)?.label)
                    .filter(Boolean)
                    .join(" + ")}
            </span>
          </p>
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => setStep(2)}
            className="w-full rounded-lg bg-teal-600 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-40 sm:w-auto sm:px-8"
          >
            Continue
          </button>
        </section>
      ) : (
        <form
          action={formAction}
          className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 sm:p-8"
        >
          {selected.map((id) => (
            <input key={id} type="hidden" name="careerIds" value={id} />
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[14px] font-semibold text-zinc-900">
              Quick profile
            </h2>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
            >
              ← Change careers
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-[13px]">
              <span className="font-medium text-zinc-800">Age range</span>
              <select name="ageRange" required className={inputClass}>
                <option value="18-22">18–22</option>
                <option value="23-27">23–27</option>
                <option value="28-35">28–35</option>
                <option value="36+">36+</option>
              </select>
            </label>

            <label className="block text-[13px]">
              <span className="font-medium text-zinc-800">Current status</span>
              <select name="workStatus" required className={inputClass}>
                <option value="student">Student</option>
                <option value="working">Working</option>
                <option value="part_time">Part-time / gigs</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </label>

            <label className="block text-[13px] sm:col-span-2">
              <span className="font-medium text-zinc-800">Experience in this field</span>
              <select name="experienceLevel" required className={inputClass}>
                <option value="none">None — I&apos;m new</option>
                <option value="some">Some — projects, classes, or a bit of work</option>
                <option value="experienced">Experienced — I&apos;ve done real work</option>
              </select>
            </label>

            <fieldset className="sm:col-span-2">
              <legend className="text-[13px] font-medium text-zinc-800">
                Do you have a 4-year degree?
              </legend>
              <div className="mt-2 flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                  <input
                    type="radio"
                    name="hasDegree"
                    value="yes"
                    defaultChecked
                    required
                    className="size-4 border-zinc-300 accent-zinc-900"
                  />
                  Yes
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-zinc-700">
                  <input
                    type="radio"
                    name="hasDegree"
                    value="no"
                    className="size-4 border-zinc-300 accent-zinc-900"
                  />
                  No
                </label>
              </div>
            </fieldset>

            <label className="block text-[13px]">
              <span className="font-medium text-zinc-800">Hours per week you can commit</span>
              <select name="hoursPerWeek" required className={inputClass}>
                <option value="5">~5 hrs/week — Just getting started</option>
                <option value="10">~10 hrs/week — Steady evenings</option>
                <option value="15">~15 hrs/week — Strong momentum</option>
                <option value="20">~20 hrs/week — Full focus</option>
              </select>
            </label>

            <label className="block text-[13px]">
              <span className="font-medium text-zinc-800">Goal timeline</span>
              <select name="goalTimeline" required className={inputClass}>
                <option value="3_months">3 months — I want to move fast</option>
                <option value="6_months">6 months — Steady and thorough</option>
                <option value="1_year">1 year — I want to go deep</option>
              </select>
            </label>

            <label className="block text-[13px] sm:col-span-2">
              <span className="font-medium text-zinc-800">Resume (optional)</span>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                PDF, DOC, or DOCX · max 4MB. Stored for your account only.
              </p>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx,application/pdf"
                className="mt-2 block w-full text-[13px] text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
              />
            </label>
          </div>

          {state && !state.ok ? (
            <p className="text-[13px] text-red-600" role="alert">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60 sm:w-auto sm:px-10"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Building your roadmap…
              </>
            ) : (
              "Generate my roadmap"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
