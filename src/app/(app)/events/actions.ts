"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export type EventItem = {
  id: string;
  title: string;
  date: string;
  endDate: string | null;
  type: string;
  link: string | null;
  location: string | null;
  attendees: number;
  rsvped: boolean;
};

export async function getEvents(): Promise<EventItem[]> {
  const session = await auth();
  const userId = session?.user?.id;

  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: {
      rsvps: userId ? { where: { userId } } : false,
    },
  });

  return events.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date.toISOString(),
    endDate: e.endDate?.toISOString() ?? null,
    type: e.type,
    link: e.link,
    location: e.location,
    attendees: e.attendees,
    rsvped: Array.isArray(e.rsvps) && e.rsvps.length > 0,
  }));
}

export type RsvpResult = { ok: boolean; error?: string };

export async function toggleRsvp(eventId: string): Promise<RsvpResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Not signed in." };

  const existing = await prisma.eventRsvp.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.eventRsvp.delete({ where: { id: existing.id } }),
      prisma.event.update({
        where: { id: eventId },
        data: { attendees: { decrement: 1 } },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.eventRsvp.create({ data: { userId, eventId } }),
      prisma.event.update({
        where: { id: eventId },
        data: { attendees: { increment: 1 } },
      }),
    ]);
  }

  return { ok: true };
}
