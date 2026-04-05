import { EventBoard } from "@/components/events/event-board";
import { getEvents } from "./actions";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <header className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Events
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Community events, workshops, and meetups. RSVP to save your spot.
        </p>
      </header>

      <section className="mx-auto mt-8 max-w-6xl">
        <EventBoard initialEvents={events} />
      </section>
    </main>
  );
}
