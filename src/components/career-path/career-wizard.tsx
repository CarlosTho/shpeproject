"use client";

import { useActionState, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  createCareerRoadmap,
  type CreateRoadmapResult,
} from "@/app/career-path/actions";
import type { CareerDefinition } from "@/lib/career-path/types";
import { careerGroups } from "@/lib/career-path/careers";

function difficultyStyles(d: CareerDefinition["difficulty"]) {
  switch (d) {
    case "easiest":
      return "border-emerald-200 bg-emerald-50/60 text-emerald-900 ring-emerald-100";
    case "medium":
      return "border-amber-200 bg-amber-50/60 text-amber-950 ring-amber-100";
    case "harder":
      return "border-violet-200 bg-violet-50/60 text-violet-950 ring-violet-100";
    default:
      return "border-slate-200 bg-slate-50 text-slate-900";
  }
}

function difficultyLabel(d: CareerDefinition["difficulty"]) {
  switch (d) {
    case "easiest":
      return "Easiest";
    case "medium":
      return "Medium";
    case "harder":
      return "Harder";
    default:
      return d;
  }
}

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
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left text-sm font-medium ring-1 transition ${difficultyStyles(c.difficulty)} ${
                  on ? "ring-2 ring-teal-500 ring-offset-2" : "hover:opacity-95"
                }`}
              >
                <span className="text-[0.65rem] font-semibold uppercase tracking-wide opacity-80">
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
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Career Path Generator
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Turn your goal into a plan
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">
          Pick up to two paths, answer a few quick questions, and get a
          structured roadmap you can track — with real people when you want
          backup.
        </p>
      </header>

      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className={step === 1 ? "text-teal-700" : ""}>1. Careers</span>
        <ChevronRight className="size-3.5 opacity-50" aria-hidden />
        <span className={step === 2 ? "text-teal-700" : ""}>2. Your profile</span>
      </div>

      {step === 1 ? (
        <section className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              What are you aiming for?
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Select one or two careers (max two). Colors show rough difficulty —
              not limits, just pacing hints.
            </p>
          </div>
          {renderGroup("Easiest to enter", easiest)}
          {renderGroup("Medium", medium)}
          {renderGroup("Harder (more learning curve)", harder)}
          <p className="text-xs text-slate-500">
            Selected:{" "}
            <span className="font-medium text-slate-800">
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
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-40 sm:w-auto sm:px-8"
          >
            Continue
          </button>
        </section>
      ) : (
        <form
          action={formAction}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {selected.map((id) => (
            <input key={id} type="hidden" name="careerIds" value={id} />
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Quick profile
            </h2>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-medium text-teal-700 hover:text-teal-900"
            >
              ← Change careers
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-slate-800">Age range</span>
              <select
                name="ageRange"
                required
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="18-22">18–22</option>
                <option value="23-27">23–27</option>
                <option value="28-35">28–35</option>
                <option value="36+">36+</option>
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-slate-800">Current status</span>
              <select
                name="workStatus"
                required
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="student">Student</option>
                <option value="working">Working</option>
                <option value="part_time">Part-time / gigs</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-800">
                Experience in this field
              </span>
              <select
                name="experienceLevel"
                required
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="none">None — I&apos;m new</option>
                <option value="some">Some — projects, classes, or a bit of work</option>
                <option value="experienced">Experienced — I&apos;ve done real work</option>
              </select>
            </label>

            <fieldset className="sm:col-span-2">
              <legend className="text-sm font-medium text-slate-800">
                Do you have a 4-year degree?
              </legend>
              <div className="mt-2 flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="hasDegree"
                    value="yes"
                    defaultChecked
                    required
                    className="size-4 border-slate-300 text-teal-600"
                  />
                  Yes
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="hasDegree"
                    value="no"
                    className="size-4 border-slate-300 text-teal-600"
                  />
                  No
                </label>
              </div>
            </fieldset>

            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-800">
                Resume (optional)
              </span>
              <p className="mt-0.5 text-xs text-slate-500">
                PDF, DOC, or DOCX · max 4MB. Stored for your account only.
              </p>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx,application/pdf"
                className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-teal-800 hover:file:bg-teal-100"
              />
            </label>
          </div>

          {state && !state.ok ? (
            <p className="text-sm text-red-600" role="alert">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60 sm:w-auto sm:px-10"
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
