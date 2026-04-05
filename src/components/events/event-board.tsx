"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  CalendarPlus,
  Check,
  Clock,
  MapPin,
  Users,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Static event data ────────────────────────────────────────────────────────

type Speaker = {
  name: string;
  role: string;
  company: string;
  initials: string;
  color: string;
};

type StaticEvent = {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate: Date;
  type: "Resume Workshop" | "Recruiter Q&A" | "Mock Interview" | "Career Advice";
  location: string;
  speakers: Speaker[];
  attendees?: number;
  recordingHref?: string;
};

const EVENTS: StaticEvent[] = [
  {
    id: "evt-1",
    title: "Resume Workshop with a Google Recruiter",
    description:
      "Get your resume reviewed live by a recruiter who screens hundreds of resumes a month. Bring your current draft and leave with real, line-by-line feedback and a stronger pitch.",
    date: new Date("2026-04-18T13:00:00"),
    endDate: new Date("2026-04-18T14:30:00"),
    type: "Resume Workshop",
    location: "Virtual · Zoom",
    speakers: [
      {
        name: "Maria Rodriguez",
        role: "Technical Recruiter",
        company: "Google",
        initials: "MR",
        color: "bg-blue-500",
      },
    ],
  },
  {
    id: "evt-2",
    title: "Breaking into Tech: Live Q&A with Industry Pros",
    description:
      "Ask anything — how to get your first tech role, what hiring managers actually look for, salary negotiation, and what nobody tells you before you start. Candid answers, no fluff.",
    date: new Date("2026-05-02T12:00:00"),
    endDate: new Date("2026-05-02T13:30:00"),
    type: "Recruiter Q&A",
    location: "Virtual · Zoom",
    speakers: [
      {
        name: "James Chen",
        role: "Senior Account Executive",
        company: "Salesforce",
        initials: "JC",
        color: "bg-violet-500",
      },
      {
        name: "Sofia Torres",
        role: "Sales Development Rep",
        company: "HubSpot",
        initials: "ST",
        color: "bg-amber-500",
      },
    ],
  },
  {
    id: "evt-3",
    title: "Mock Interview Night: Land Your First IT Role",
    description:
      "Practiced live mock interviews with real hiring feedback, common scenario walkthroughs, and 30 minutes of open Q&A on breaking into IT support and helpdesk.",
    date: new Date("2026-03-21T14:00:00"),
    endDate: new Date("2026-03-21T16:00:00"),
    type: "Mock Interview",
    location: "Virtual · Zoom",
    speakers: [
      {
        name: "David Kim",
        role: "IT Manager",
        company: "Microsoft",
        initials: "DK",
        color: "bg-teal-600",
      },
    ],
    attendees: 87,
    recordingHref: "#",
  },
  {
    id: "evt-4",
    title: "Navigating Your Career as a First-Gen Professional",
    description:
      "A real conversation about the unspoken rules of corporate environments, building a network from zero, and what it took to go from first-gen student to senior roles at top companies.",
    date: new Date("2026-03-07T13:00:00"),
    endDate: new Date("2026-03-07T14:30:00"),
    type: "Career Advice",
    location: "Virtual · Zoom",
    speakers: [
      {
        name: "Ana Gutierrez",
        role: "Senior Product Manager",
        company: "Amazon",
        initials: "AG",
        color: "bg-rose-500",
      },
      {
        name: "Carlos Rivera",
        role: "Engineering Manager",
        company: "Meta",
        initials: "CR",
        color: "bg-indigo-500",
      },
    ],
    attendees: 94,
    recordingHref: "#",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function buildGoogleCalendarUrl(event: StaticEvent) {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(event.date)}/${fmt(event.endDate)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const typeConfig: Record<StaticEvent["type"], { badge: string; stripe: string }> = {
  "Resume Workshop":  { badge: "bg-blue-50 text-blue-700",   stripe: "bg-blue-400" },
  "Recruiter Q&A":   { badge: "bg-violet-50 text-violet-700", stripe: "bg-violet-400" },
  "Mock Interview":  { badge: "bg-teal-50 text-teal-700",    stripe: "bg-teal-500" },
  "Career Advice":   { badge: "bg-amber-50 text-amber-800",  stripe: "bg-amber-400" },
};

// ─── Registration state ───────────────────────────────────────────────────────

type RegState = "idle" | "calendar-prompt" | "confirmed";

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ event, past }: { event: StaticEvent; past: boolean }) {
  const [reg, setReg] = useState<RegState>("idle");
  const cfg = typeConfig[event.type];

  function handleCalendarChoice(addToCalendar: boolean) {
    if (addToCalendar) {
      window.open(buildGoogleCalendarUrl(event), "_blank", "noopener,noreferrer");
    }
    setReg("confirmed");
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors hover:border-zinc-300">
      {/* Top stripe */}
      <div className={cn("h-1 w-full", cfg.stripe)} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Type + past badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", cfg.badge)}>
            {event.type}
          </span>
          {past && (
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
              Past
            </span>
          )}
        </div>

        {/* Title + description */}
        <div>
          <h3 className="text-[14px] font-semibold leading-snug text-zinc-900">
            {event.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
            {event.description}
          </p>
        </div>

        {/* Date / time / location */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <Calendar className="size-3.5 shrink-0 text-zinc-400" aria-hidden />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <Clock className="size-3.5 shrink-0 text-zinc-400" aria-hidden />
            {formatTime(event.date)} – {formatTime(event.endDate)}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <MapPin className="size-3.5 shrink-0 text-zinc-400" aria-hidden />
            {event.location}
          </div>
        </div>

        {/* Speakers */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            {event.speakers.length > 1 ? "Speakers" : "Speaker"}
          </p>
          <div className="flex flex-col gap-2">
            {event.speakers.map((s) => (
              <div key={s.name} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white",
                    s.color
                  )}
                >
                  {s.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-zinc-800">
                    {s.name}
                  </p>
                  <p className="truncate text-[11px] text-zinc-400">
                    {s.role} · {s.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past: attendee count */}
        {past && event.attendees && (
          <div className="flex items-center gap-1.5 text-[12px] text-zinc-400">
            <Users className="size-3.5" aria-hidden />
            {event.attendees} people attended
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-1">
          {past ? (
            <a
              href={event.recordingHref ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <Video className="size-3.5" aria-hidden />
              View Recording
            </a>
          ) : reg === "idle" ? (
            <button
              type="button"
              onClick={() => setReg("calendar-prompt")}
              className="w-full rounded-lg bg-teal-600 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700 active:scale-[0.98]"
            >
              Register
            </button>
          ) : reg === "calendar-prompt" ? (
            <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5">
              <div className="flex items-start gap-2.5">
                <CalendarPlus className="mt-0.5 size-4 shrink-0 text-zinc-500" aria-hidden />
                <div>
                  <p className="text-[13px] font-semibold text-zinc-900">
                    Add to your Google Calendar?
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    We&apos;ll open Google Calendar so you can save the event.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCalendarChoice(true)}
                  className="flex-1 rounded-md bg-teal-600 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Yes, add it
                </button>
                <button
                  type="button"
                  onClick={() => handleCalendarChoice(false)}
                  className="flex-1 rounded-md border border-zinc-200 bg-white py-1.5 text-[12px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
                >
                  Skip
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2.5 ring-1 ring-zinc-200">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                <span className="text-[13px] font-semibold text-zinc-900">
                  You&apos;re registered!
                </span>
              </div>
              <div className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                <Bell className="mt-0.5 size-3.5 shrink-0 text-zinc-400" aria-hidden />
                <p className="text-[11px] leading-relaxed text-zinc-500">
                  A reminder will be sent <span className="font-semibold text-zinc-700">24 hours before</span> the event.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────

export function EventBoard() {
  const now = new Date();
  const upcoming = EVENTS.filter((e) => e.date > now);
  const past = EVENTS.filter((e) => e.date <= now);

  return (
    <div className="animate-fade-up space-y-10">
      {upcoming.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              Upcoming
            </h2>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
              {upcoming.length}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} past={false} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Past events
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {past.map((e) => (
              <EventCard key={e.id} event={e} past={true} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
