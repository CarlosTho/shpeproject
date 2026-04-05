"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Sun } from "lucide-react";
import { createPeerHelpRequest } from "@/app/(app)/peer-help/actions";
import {
  PEER_HELP_TYPE_IDS,
  PEER_HELP_TYPE_LABELS,
  type PeerHelpRequestItem,
  type PeerHelpTypeId,
} from "@/lib/peer-help/types";
import { cn } from "@/lib/utils";

const typeStyles: Record<PeerHelpTypeId, { label: string; className: string }> = {
  mock_interview: {
    label: PEER_HELP_TYPE_LABELS.mock_interview,
    className: "bg-teal-50 text-teal-700",
  },
  career_advice: {
    label: PEER_HELP_TYPE_LABELS.career_advice,
    className: "bg-pink-50 text-pink-700",
  },
  resume_review: {
    label: PEER_HELP_TYPE_LABELS.resume_review,
    className: "bg-sky-50 text-sky-700",
  },
};

type Props = {
  initialRequests: PeerHelpRequestItem[];
  currentUserId: string;
  initialRequestType?: PeerHelpTypeId;
  autoOpenRequest?: boolean;
};

function Avatar({ name, image }: { name: string; image: string | null }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- OAuth avatars from varied hosts
      <img
        src={image}
        alt=""
        width={32}
        height={32}
        className="size-8 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600"
      aria-hidden
    >
      {initial}
    </div>
  );
}

export function PeerHelpBoard({
  initialRequests,
  currentUserId,
  initialRequestType,
  autoOpenRequest,
}: Props) {
  const router = useRouter();
  const requestDialogRef = useRef<HTMLDialogElement>(null);
  const detailDialogRef = useRef<HTMLDialogElement>(null);
  const [detailRequest, setDetailRequest] = useState<PeerHelpRequestItem | null>(null);
  const [myOnly, setMyOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<PeerHelpTypeId | "all">("all");
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [requestType, setRequestType] = useState<PeerHelpTypeId>(
    initialRequestType ?? "career_advice",
  );

  const filtered = useMemo(() => {
    return initialRequests.filter((r) => {
      if (myOnly && r.authorId !== currentUserId) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      return true;
    });
  }, [initialRequests, myOnly, typeFilter, currentUserId]);

  function openRequestDialog() {
    setFormError(null);
    requestDialogRef.current?.showModal();
  }

  useEffect(() => {
    if (!autoOpenRequest) return;
    const id = window.setTimeout(() => {
      requestDialogRef.current?.showModal();
    }, 0);
    return () => window.clearTimeout(id);
  }, [autoOpenRequest]);

  function openDetail(r: PeerHelpRequestItem) {
    setDetailRequest(r);
    detailDialogRef.current?.showModal();
  }

  function handleRequestSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setFormError(null);
    startTransition(async () => {
      const result = await createPeerHelpRequest(fd);
      if (result.error) {
        setFormError(result.error);
        return;
      }
      if (result.ok) {
        form.reset();
        requestDialogRef.current?.close();
        router.refresh();
      }
    });
  }

  return (
    <div className="animate-fade-up space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500">
            <MessageCircle className="size-5" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              Peer Help
            </h1>
            <p className="mt-0.5 max-w-xl text-[13px] text-zinc-500">
              Request mock interviews, resume reviews, and career advice from
              your peers — and offer help when you can.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openRequestDialog}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700"
        >
          Request Help
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMyOnly((v) => !v)}
          className={cn(
            "h-8 rounded-lg border px-3 text-[13px] font-medium transition-colors",
            myOnly
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
          )}
        >
          My Requests
        </button>
        <label className="sr-only" htmlFor="peer-help-type">
          Filter by type
        </label>
        <select
          id="peer-help-type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as PeerHelpTypeId | "all")}
          className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-[13px] font-medium text-zinc-700 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
        >
          <option value="all">All types</option>
          {PEER_HELP_TYPE_IDS.map((id) => (
            <option key={id} value={id}>
              {PEER_HELP_TYPE_LABELS[id]}
            </option>
          ))}
        </select>
      </div>

      {/* Request list */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-zinc-900">
          Open
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
            {filtered.length}
          </span>
        </h2>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-14 text-center">
            <p className="text-[13px] text-zinc-500">
              {myOnly
                ? "You have no open requests yet. Use Request Help to post one."
                : "No open requests match your filters."}
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r) => {
              const style = typeStyles[r.type];
              return (
                <li key={r.id}>
                  <article className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold",
                          style.className
                        )}
                      >
                        {style.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => openDetail(r)}
                        className="text-[12px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
                      >
                        View
                      </button>
                    </div>
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                        <Sun className="size-3" aria-hidden />
                        Open
                      </span>
                    </div>
                    <p className="line-clamp-3 flex-1 text-[13px] leading-relaxed text-zinc-600">
                      {r.context}
                    </p>
                    <div className="mt-4 flex items-center gap-2.5 border-t border-zinc-100 pt-3">
                      <Avatar name={r.authorName} image={r.authorImage} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-zinc-900">
                          {r.authorName}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Request dialog */}
      <dialog
        ref={requestDialogRef}
        className="w-[min(100%,32rem)] rounded-2xl border border-zinc-200 p-0 shadow-xl backdrop:bg-black/30"
      >
        <div className="border-b border-zinc-100 px-6 py-4">
          <h3 className="text-[15px] font-semibold text-zinc-900">
            Request peer help
          </h3>
          <p className="mt-1 text-[13px] text-zinc-500">
            Posts are visible to signed-in members. Be specific so peers can
            decide if they can help.
          </p>
        </div>
        <form onSubmit={handleRequestSubmit} className="px-6 py-4">
          <fieldset className="space-y-3">
            <legend className="text-[13px] font-medium text-zinc-900">
              What type of help do you need?
            </legend>
            <p className="text-[11px] text-zinc-400">
              We currently only support these areas of need.
            </p>
            <div className="flex flex-col gap-2">
              {PEER_HELP_TYPE_IDS.map((id) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 transition-colors has-[:checked]:border-zinc-400 has-[:checked]:bg-zinc-50"
                >
                  <input
                    type="radio"
                    name="type"
                    value={id}
                    checked={requestType === id}
                    onChange={() => setRequestType(id)}
                    required
                    className="size-4 border-zinc-300 accent-zinc-900"
                  />
                  <span className="text-[13px] font-medium text-zinc-800">
                    {PEER_HELP_TYPE_LABELS[id]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label
              htmlFor="peer-help-context"
              className="block text-[13px] font-medium text-zinc-900"
            >
              Add context to your request
            </label>
            <p className="mt-1 text-[11px] text-zinc-400">
              What do you need help with specifically? Do you want to meet
              synchronously or asynchronously? If synchronously, when are you
              available? Do you have a preference on the helper&apos;s
              background or experience?
            </p>
            <textarea
              id="peer-help-context"
              name="context"
              required
              rows={6}
              placeholder="e.g. I'm prepping for a behavioral + technical mock for an SWE internship; prefer async feedback on my answers, or a 30-min video call weekday evenings PT…"
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          {formError && (
            <p className="mt-3 text-[13px] text-red-600" role="alert">
              {formError}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2 border-t border-zinc-100 pt-4">
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
              onClick={() => requestDialogRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              {pending ? "Posting…" : "Post request"}
            </button>
          </div>
        </form>
      </dialog>

      {/* Detail dialog */}
      <dialog
        ref={detailDialogRef}
        className="w-[min(100%,36rem)] rounded-2xl border border-zinc-200 p-0 shadow-xl backdrop:bg-black/30"
        onClose={() => setDetailRequest(null)}
      >
        {detailRequest && (
          <>
            <div className="border-b border-zinc-100 px-6 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                    typeStyles[detailRequest.type].className
                  )}
                >
                  {typeStyles[detailRequest.type].label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                  <Sun className="size-3" aria-hidden />
                  Open
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                <Avatar name={detailRequest.authorName} image={detailRequest.authorImage} />
                <div>
                  <p className="text-[13px] font-medium text-zinc-900">
                    {detailRequest.authorName}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    {formatDistanceToNow(new Date(detailRequest.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
            <div className="max-h-[min(60vh,28rem)] overflow-y-auto px-6 py-4">
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-700">
                {detailRequest.context}
              </p>
            </div>
            <div className="border-t border-zinc-100 px-6 py-4">
              <button
                type="button"
                className="w-full rounded-lg bg-zinc-100 py-2.5 text-[13px] font-medium text-zinc-800 transition-colors hover:bg-zinc-200"
                onClick={() => detailDialogRef.current?.close()}
              >
                Close
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
