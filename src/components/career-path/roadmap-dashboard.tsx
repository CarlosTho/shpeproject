"use client";

import { useOptimistic, useTransition, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Circle,
  ExternalLink,
  Loader2,
  NotebookPen,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  deleteCareerRoadmap,
  saveResourceNote,
  toggleCareerStepCompletion,
} from "@/app/(app)/career-path/actions";
import type {
  FreeResource,
  ResourceNote,
  RoadmapStep,
  StepProgressData,
  StoredPlan,
  WeeklyPhase,
} from "@/lib/career-path/types";

// ─── Resource note ────────────────────────────────────────────────────────────

function ResourceNoteSection({
  stepId,
  resourceUrl,
  savedNote,
}: {
  stepId: string;
  resourceUrl: string;
  savedNote?: ResourceNote;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(savedNote?.text ?? "");
  const [localNote, setLocalNote] = useState<ResourceNote | undefined>(savedNote);
  const [pending, startTransition] = useTransition();

  function save() {
    const trimmed = text.trim();
    if (!trimmed) return;
    startTransition(async () => {
      await saveResourceNote(stepId, resourceUrl, trimmed);
      setLocalNote({ text: trimmed, savedAt: new Date().toISOString() });
      setEditing(false);
    });
  }

  if (!editing && localNote) {
    return (
      <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700">
            <NotebookPen className="size-3.5" aria-hidden />
            Your notes
          </p>
          <button
            onClick={() => { setText(localNote.text); setEditing(true); }}
            className="text-[11px] text-zinc-500 transition-colors hover:text-zinc-800"
          >
            Edit
          </button>
        </div>
        <p className="mt-1.5 whitespace-pre-wrap text-[11px] leading-relaxed text-zinc-700">
          {localNote.text}
        </p>
        <p className="mt-1.5 text-[10px] text-zinc-400">
          Saved {new Date(localNote.savedAt).toLocaleDateString()}
        </p>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="mt-2 space-y-2">
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you learn? Key concepts, what clicked, anything to review later…"
          rows={3}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={pending || !text.trim()}
            className="rounded-md bg-teal-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save notes"}
          </button>
          <button
            onClick={() => { setEditing(false); setText(savedNote?.text ?? ""); }}
            className="text-[11px] text-zinc-500 transition-colors hover:text-zinc-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-800"
    >
      <NotebookPen className="size-3" aria-hidden />
      What did you learn from this?
    </button>
  );
}

// ─── Resource card ────────────────────────────────────────────────────────────

function ResourceCard({
  resource,
  stepId,
  savedNote,
}: {
  resource: FreeResource;
  stepId: string;
  savedNote?: ResourceNote;
}) {
  const isFree = !resource.paid;
  return (
    <li className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-zinc-800 transition-colors hover:text-zinc-900 hover:underline underline-offset-2"
        >
          {resource.label}
          <ExternalLink className="size-3 shrink-0 opacity-50" aria-hidden />
        </a>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            isFree
              ? "bg-teal-50 text-teal-700"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          <Tag className="size-2.5" aria-hidden />
          {isFree ? "Free" : "Paid"}
        </span>
      </div>
      {resource.note ? (
        <p className="mt-0.5 text-[11px] text-zinc-500">{resource.note}</p>
      ) : null}
      <ResourceNoteSection
        stepId={stepId}
        resourceUrl={resource.url}
        savedNote={savedNote}
      />
    </li>
  );
}

// ─── Resources panel ─────────────────────────────────────────────────────────

function ResourcesPanel({
  step,
  stepProgress,
}: {
  step: RoadmapStep;
  stepProgress?: StepProgressData;
}) {
  if (!step.resources || step.resources.length === 0) return null;

  const sorted = [...step.resources].sort((a, b) => {
    if (!!a.paid === !!b.paid) return 0;
    return a.paid ? 1 : -1;
  });
  const top3 = sorted.slice(0, 3);

  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
        <BookOpen className="size-3.5" aria-hidden />
        Top resources — free first
      </p>
      <ul className="space-y-2">
        {top3.map((r) => (
          <ResourceCard
            key={r.url}
            resource={r}
            stepId={step.id}
            savedNote={stepProgress?.notes?.[r.url]}
          />
        ))}
      </ul>
    </div>
  );
}

// ─── Weekly schedule ─────────────────────────────────────────────────────────

function WeeklyScheduleSection({ phases }: { phases: WeeklyPhase[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="size-4 text-zinc-400" aria-hidden />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          Your weekly game plan
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {phases.map((phase) => (
          <div
            key={phase.phase}
            className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-600">{phase.phase}</p>
            <p className="text-[13px] font-semibold text-zinc-900">{phase.focus}</p>
            <p className="text-[11px] text-zinc-400">{phase.hoursBreakdown}</p>
            <ul className="space-y-1 pt-1">
              {phase.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-zinc-600">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-zinc-400" aria-hidden />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main dashboard ──────────────────────────────────────────────────────────

type Props = {
  timelineLabel: string;
  goalStatement: string;
  plan: StoredPlan;
  initialProgress: Record<string, StepProgressData>;
};

export function RoadmapDashboard({
  timelineLabel,
  goalStatement,
  plan,
  initialProgress,
}: Props) {
  const [savePending, startSaveTransition] = useTransition();
  const [optimistic, addOptimistic] = useOptimistic(
    initialProgress,
    (
      state,
      update: { id: string; done: boolean },
    ): Record<string, StepProgressData> => ({
      ...state,
      [update.id]: {
        done: update.done,
        notes: state[update.id]?.notes ?? {},
      },
    }),
  );

  const allSteps = useMemo(() => {
    const out: RoadmapStep[] = [];
    for (const s of plan.sections) out.push(...s.steps);
    return out;
  }, [plan]);

  const doneCount = useMemo(
    () => allSteps.filter((s) => optimistic[s.id]?.done).length,
    [allSteps, optimistic],
  );

  const pct = allSteps.length
    ? Math.round((doneCount / allSteps.length) * 100)
    : 0;

  function toggle(id: string, next: boolean) {
    startSaveTransition(async () => {
      addOptimistic({ id, done: next });
      await toggleCareerStepCompletion(id, next);
    });
  }

  const milestoneMessage =
    pct >= 100
      ? "You did it. Every step complete. Time to apply with full confidence."
      : pct >= 50
        ? "Over halfway. You are proving to yourself you can do this — keep going."
        : null;

  return (
    <div className="animate-fade-up mx-auto max-w-3xl space-y-10">
      {/* Encouragement banner */}
      {plan.encouragement ? (
        <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-teal-500" aria-hidden />
          <p className="text-[13px] leading-relaxed text-zinc-700">{plan.encouragement}</p>
        </div>
      ) : null}

      {/* Header */}
      <header className="space-y-4 border-b border-zinc-200 pb-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-600">
          Your roadmap
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Your personalized career plan
        </h1>
        <p className="text-[14px] leading-relaxed text-zinc-500">{goalStatement}</p>
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="rounded-md bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
            Timeline: {timelineLabel}
          </span>
          {plan.hoursPerWeek ? (
            <span className="rounded-md bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
              {plan.hoursPerWeek} hrs/week
            </span>
          ) : null}
          <span className="rounded-md bg-teal-50 px-2.5 py-1 font-medium text-teal-800">
            {doneCount}/{allSteps.length} steps · {pct}%
          </span>
        </div>
        <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {milestoneMessage ? (
          <p className="text-[13px] font-semibold text-teal-700">{milestoneMessage}</p>
        ) : null}
      </header>

      {/* Weekly game plan */}
      {plan.weeklySchedule && plan.weeklySchedule.length > 0 ? (
        <WeeklyScheduleSection phases={plan.weeklySchedule} />
      ) : null}

      {/* Career sections */}
      <div className="space-y-12">
        {plan.sections.map((section) => (
          <section key={section.careerId} className="space-y-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              {section.label}
            </h2>
            <ol className="space-y-3">
              {section.steps.map((st, idx) => {
                const stepProg = optimistic[st.id];
                const done = stepProg?.done ?? false;
                return (
                  <li key={st.id}>
                    <div
                      className={`rounded-xl border transition-colors ${
                        done
                          ? "border-teal-200 bg-teal-50/30"
                          : "border-zinc-200 bg-white"
                      }`}
                    >
                      <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                        {/* Completion toggle */}
                        <button
                          type="button"
                          disabled={savePending}
                          onClick={() => toggle(st.id, !done)}
                          className="mt-0.5 shrink-0 disabled:opacity-50"
                          aria-pressed={done}
                          aria-label={
                            done
                              ? `Mark step ${idx + 1} not done`
                              : `Mark step ${idx + 1} done`
                          }
                        >
                          {done ? (
                            <span className="flex size-8 items-center justify-center rounded-full bg-teal-600 text-white">
                              <Check className="size-4" strokeWidth={2.5} />
                            </span>
                          ) : (
                            <span className="flex size-8 items-center justify-center rounded-full border-2 border-zinc-200 bg-white text-zinc-300">
                              <Circle className="size-4" strokeWidth={2} />
                            </span>
                          )}
                        </button>

                        <div className="min-w-0 flex-1 space-y-4">
                          {/* Step header */}
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                              Step {idx + 1}
                            </p>
                            <h3
                              className={`text-[14px] font-semibold ${done ? "text-zinc-400 line-through decoration-teal-400" : "text-zinc-900"}`}
                            >
                              {st.title}
                            </h3>
                            <p className="mt-1 text-[13px] text-zinc-500">
                              {st.description}
                            </p>
                          </div>

                          {/* Details */}
                          <details open className="group rounded-lg border border-zinc-100 bg-zinc-50/80">
                            <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-[12px] font-medium text-zinc-600">
                              <ChevronDown className="size-3.5 shrink-0 transition group-open:rotate-180" />
                              Details &amp; checklist
                            </summary>
                            <div className="space-y-4 border-t border-zinc-100 px-3 py-3">
                              <p className="text-[13px] leading-relaxed text-zinc-600">
                                {st.details}
                              </p>
                              <ResourcesPanel step={st} stepProgress={optimistic[st.id]} />
                            </div>
                          </details>

                          {/* Bridge to community */}
                          <div className="rounded-lg border border-dashed border-zinc-200 bg-white px-3 py-3">
                            <p className="text-[12px] font-semibold text-zinc-700">
                              Need help with this step?
                            </p>
                            <Link
                              href={st.bridgeHref}
                              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-900 transition-colors hover:text-teal-700"
                            >
                              Connect with someone
                              <ArrowRight className="size-3.5" aria-hidden />
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

      {savePending ? (
        <p className="flex items-center gap-2 text-[12px] text-zinc-400">
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          Saving…
        </p>
      ) : null}

      <form
        action={deleteCareerRoadmap}
        className="border-t border-zinc-200 pt-8 text-center"
      >
        <button
          type="submit"
          className="text-[13px] font-medium text-zinc-400 underline-offset-2 transition-colors hover:text-zinc-700 hover:underline"
        >
          Start over with new careers
        </button>
        <p className="mt-2 text-[12px] text-zinc-400">
          Removes your current roadmap and progress so you can run the
          generator again.
        </p>
      </form>
    </div>
  );
}
