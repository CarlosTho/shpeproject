import { EventBoard } from "@/components/events/event-board";

export default function EventsPage() {
  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <header className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Events
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Bi-weekly events with recruiters and industry professionals. Register to save your spot.
        </p>
      </header>

      <section className="mx-auto mt-8 max-w-5xl">
        <EventBoard />
      </section>
    </main>
  );
}
