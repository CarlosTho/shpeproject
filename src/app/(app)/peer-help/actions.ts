"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  PEER_HELP_TYPE_IDS,
  type PeerHelpRequestItem,
  type PeerHelpTypeId,
} from "@/lib/peer-help/types";

const peerHelpTypeEnum = z.enum(PEER_HELP_TYPE_IDS);

export async function getPeerHelpRequests(): Promise<PeerHelpRequestItem[]> {
  const rows = await prisma.peerHelpRequest.findMany({
    where: { status: "open" },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return rows.map((r) => {
    const type = PEER_HELP_TYPE_IDS.includes(r.type as PeerHelpTypeId)
      ? (r.type as PeerHelpTypeId)
      : "career_advice";
    return {
      id: r.id,
      type,
      context: r.context,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      authorId: r.user.id,
      authorName: r.user.name ?? "Member",
      authorImage: r.user.image,
    };
  });
}

const createSchema = z.object({
  type: peerHelpTypeEnum,
  context: z
    .string()
    .trim()
    .min(20, "Please add a bit more detail (at least 20 characters).")
    .max(8000, "Request is too long."),
});

export type CreatePeerHelpResult = { error?: string; ok?: boolean };

export async function createPeerHelpRequest(
  formData: FormData,
): Promise<CreatePeerHelpResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in." };

  const parsed = createSchema.safeParse({
    type: formData.get("type"),
    context: formData.get("context"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.peerHelpRequest.create({
    data: {
      userId: session.user.id,
      type: parsed.data.type,
      context: parsed.data.context,
      status: "open",
    },
  });

  revalidatePath("/peer-help");
  return { ok: true };
}
