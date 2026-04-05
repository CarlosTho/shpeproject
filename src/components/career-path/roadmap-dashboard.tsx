"use client";

import { useMemo, useOptimistic, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Loader2,
} from "lucide-react";
import {
  deleteCareerRoadmap,
  toggleCareerStepCompletion,
} from "@/app/career-path/actions";
import type { RoadmapStep, StoredPlan } from "@/lib/career-path/types";

type Props = {
  timelineLabel: string;
  goalStatement: string;
  plan: StoredPlan;
  initialProgress: Record<string, boolean>;
};

export function RoadmapDashboard({
  timelineLabel,
  goalStatement,
  plan,
  initialProgress,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [optimistic, addOptimistic] = useOptimistic(
    initialProgress,
    (state, update: { id: string; done: boolean }) => ({
      ...state,
      [update.id]: update.done,
    }),
  );

  const allSteps = useMemo(() => {
    const out: RoadmapStep[] = [];
    for (const s of plan.sections) {
      out.push(...s.steps);
    }
    return out;
  }, [plan]);

  const doneCount = useMemo(() => {
    return allSteps.filter((s) => optimistic[s.id]).length;
  }, [allSteps, optimistic]);

  const pct = allSteps.length
    ? Math.round((doneCount / allSteps.length) * 100)
    : 0;

  function toggle(id: string, next: boolean) {
    startTransition(async () => {
      addOptimistic({ id, done: next });
      await toggleCareerStepCompletion(id, next);
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3 border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Your roadmap
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Your personalized career plan
        </h1>
        <p className="text-base text-slate-600">{goalStatement}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-800">
            Timeline: {timelineLabel}
          </span>
          <span className="rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-900 ring-1 ring-teal-100">
            {doneCount}/{allSteps.length} steps · {pct}%
          </span>
        </div>
        <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </header>

      <div className="space-y-10">
        {plan.sections.map((section) => (
          <section key={section.careerId} className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {section.label}
            </h2>
            <ol className="space-y-3">
              {section.steps.map((st, idx) => {
                const done = optimistic[st.id] ?? false;
                return (
                  <li key={st.id}>
                    <div
                      className={`rounded-xl border transition ${
                        done
                          ? "border-teal-200 bg-teal-50/30"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => toggle(st.id, !done)}
                          className="mt-0.5 shrink-0 text-teal-600 disabled:opacity-50"
                          aria-pressed={done}
                          aria-label={
                            done
                              ? `Mark step ${idx + 1} not done`
                              : `Mark step ${idx + 1} done`
                          }
                        >
                          {done ? (
                            <span className="flex size-9 items-center justify-center rounded-full bg-teal-600 text-white">
                              <Check className="size-5" strokeWidth={2.5} />
                            </span>
                          ) : (
                            <span className="flex size-9 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-slate-300">
                              <Circle className="size-5" strokeWidth={2} />
                            </span>
                          )}
                        </button>
                        <div className="min-w-0 flex-1 space-y-3">
                          <div>
                            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
                              Step {idx + 1}
                            </p>
                            <h3 className="text-base font-semibold text-slate-900">
                              {st.title}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                              {st.description}
                            </p>
                          </div>
                          <details className="group rounded-lg border border-slate-100 bg-slate-50/80">
                            <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700">
                              <ChevronDown className="size-4 shrink-0 transition group-open:rotate-180" />
                              Expand details
                            </summary>
                            <div className="border-t border-slate-100 px-3 py-3 text-sm leading-relaxed text-slate-600">
                              {st.details}
                            </div>
                          </details>
                          <div className="rounded-lg border border-dashed border-teal-200/80 bg-white px-3 py-3">
                            <p className="text-xs font-semibold text-teal-900">
                              Need help with this step?
                            </p>
                            <Link
                              href={st.bridgeHref}
                              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
                            >
                              Connect with someone
                              <ArrowRight className="size-4" aria-hidden />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      {pending ? (
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          Saving progress…
        </p>
      ) : null}

      <form
        action={deleteCareerRoadmap}
        className="border-t border-slate-200 pt-8 text-center"
      >
        <button
          type="submit"
          className="text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
        >
          Start over with new careers
        </button>
        <p className="mt-2 text-xs text-slate-400">
          This removes your current roadmap and progress so you can run the
          generator again.
        </p>
      </form>
    </div>
  );
}
