export const PEER_HELP_TYPE_IDS = [
  "career_advice",
  "mock_interview",
  "resume_review",
] as const;

export type PeerHelpTypeId = (typeof PEER_HELP_TYPE_IDS)[number];

export function normalizePeerHelpType(
  raw: string | undefined,
): PeerHelpTypeId | undefined {
  if (!raw) return undefined;
  return PEER_HELP_TYPE_IDS.includes(raw as PeerHelpTypeId)
    ? (raw as PeerHelpTypeId)
    : undefined;
}

export const PEER_HELP_TYPE_LABELS: Record<PeerHelpTypeId, string> = {
  career_advice: "Career Advice",
  mock_interview: "Mock Interview",
  resume_review: "Resume Review",
};

export type PeerHelpRequestItem = {
  id: string;
  type: PeerHelpTypeId;
  context: string;
  status: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorImage: string | null;
};
