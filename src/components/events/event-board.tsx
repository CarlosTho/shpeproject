"use client";

import { useState, useTransition } from "react";
import { Calendar, ExternalLink, MapPin, Users } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import type { EventItem } from "@/app/events/actions";
import { toggleRsvp } from "@/app/events/actions";

function EventCard({ event, onRsvpToggle }: { event: EventItem; onRsvpToggle: (id: string) => void }) {
  const [toggling, startToggle] = useTransition();
  const date = parseISO(event.date);
  const past = isPast(date);

  function handleRsvp() {
    startToggle(async () => {
      await onRsvpToggle(event.id);
    });
  }

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
            {event.type}
          </span>
          {past && (
            <span className="ml-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Past
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Users className="size-3.5" />
          {event.attendees}
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-900">{event.title}</h3>

      <div className="flex flex-col gap-1.5 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0 text-slate-400" />
          {format(date, "MMM d, yyyy · h:mm a")}
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-slate-400" />
            {event.location}
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={handleRsvp}
          disabled={toggling}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
            event.rsvped
              ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          {toggling ? "…" : event.rsvped ? "Cancel RSVP" : "RSVP"}
        </button>
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Link
            <ExternalLink className="size-3.5 opacity-70" />
          </a>
        )}
      </div>
    </article>
  );
}

type Props = {
  initialEvents: EventItem[];
};

export function EventBoard({ initialEvents }: Props) {
  const [events, setEvents] = useState(initialEvents);

  function handleRsvpToggle(eventId: string) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              rsvped: !e.rsvped,
              attendees: e.rsvped ? e.attendees - 1 : e.attendees + 1,
            }
          : e,
      ),
    );
    toggleRsvp(eventId);
  }

  const upcoming = events.filter((e) => !isPast(parseISO(e.date)));
  const past = events.filter((e) => isPast(parseISO(e.date)));

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Upcoming
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} onRsvpToggle={handleRsvpToggle} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Past events
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.id} event={e} onRsvpToggle={handleRsvpToggle} />
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="py-16 text-center">
          <Calendar className="mx-auto size-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No events yet. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
