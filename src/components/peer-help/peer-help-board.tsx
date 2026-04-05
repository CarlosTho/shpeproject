"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Sun } from "lucide-react";
import { createPeerHelpRequest } from "@/app/peer-help/actions";
import {
  PEER_HELP_TYPE_IDS,
  PEER_HELP_TYPE_LABELS,
  type PeerHelpRequestItem,
  type PeerHelpTypeId,
} from "@/lib/peer-help/types";

const typeStyles: Record<
  PeerHelpTypeId,
  { label: string; className: string }
> = {
  mock_interview: {
    label: PEER_HELP_TYPE_LABELS.mock_interview,
    className: "bg-emerald-100 text-emerald-800",
  },
  career_advice: {
    label: PEER_HELP_TYPE_LABELS.career_advice,
    className: "bg-pink-100 text-pink-800",
  },
  resume_review: {
    label: PEER_HELP_TYPE_LABELS.resume_review,
    className: "bg-sky-100 text-sky-800",
  },
};

type Props = {
  initialRequests: PeerHelpRequestItem[];
  currentUserId: string;
  initialRequestType?: PeerHelpTypeId;
  autoOpenRequest?: boolean;
};

function Avatar({
  name,
  image,
}: {
  name: string;
  image: string | null;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- OAuth avatars from varied hosts
      <img
        src={image}
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600"
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
  const [detailRequest, setDetailRequest] = useState<PeerHelpRequestItem | null>(
    null,
  );
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
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <MessageCircle className="size-6" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Peer Help
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Request mock interviews, resume reviews, and career advice from
              your peers — and offer help when you can.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openRequestDialog}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          Request Help
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setMyOnly((v) => !v)}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
            myOnly
              ? "border-teal-600 bg-teal-50 text-teal-800"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          My Requests
        </button>
        <div className="flex items-center gap-2">
          <label htmlFor="peer-help-type" className="sr-only">
            Filter by type
          </label>
          <select
            id="peer-help-type"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as PeerHelpTypeId | "all")
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
          >
            <option value="all">All types</option>
            {PEER_HELP_TYPE_IDS.map((id) => (
              <option key={id} value={id}>
                {PEER_HELP_TYPE_LABELS[id]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
          Open
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-600">
            {filtered.length}
          </span>
        </h2>

        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-sm text-slate-500">
            {myOnly
              ? "You have no open requests yet. Use Request Help to post one."
              : "No open requests match your filters."}
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r) => {
              const style = typeStyles[r.type];
              return (
                <li key={r.id}>
                  <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <span
                        className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${style.className}`}
                      >
                        {style.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => openDetail(r)}
                        className="text-sm font-medium text-teal-700 hover:text-teal-800"
                      >
                        View
                      </button>
                    </div>
                    <div className="mb-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                        <Sun className="size-3.5" aria-hidden />
                        Open
                      </span>
                    </div>
                    <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {r.context}
                    </p>
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <Avatar name={r.authorName} image={r.authorImage} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {r.authorName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDistanceToNow(new Date(r.createdAt), {
                            addSuffix: true,
                          })}
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

      <dialog
        ref={requestDialogRef}
        className="w-[min(100%,32rem)] rounded-2xl border border-slate-200 p-0 shadow-xl backdrop:bg-slate-900/40"
      >
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Request peer help
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Posts are visible to signed-in members. Be specific so peers can
            decide if they can help.
          </p>
        </div>
        <form onSubmit={handleRequestSubmit} className="px-6 py-4">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-900">
              What type of help do you need?
            </legend>
            <p className="text-xs text-slate-500">
              We currently only support these areas of need.
            </p>
            <div className="flex flex-col gap-2">
              {PEER_HELP_TYPE_IDS.map((id) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 has-[:checked]:border-teal-500/50 has-[:checked]:bg-teal-50/50"
                >
                  <input
                    type="radio"
                    name="type"
                    value={id}
                    checked={requestType === id}
                    onChange={() => setRequestType(id)}
                    required
                    className="size-4 border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {PEER_HELP_TYPE_LABELS[id]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label
              htmlFor="peer-help-context"
              className="block text-sm font-medium text-slate-900"
            >
              Please add context to your request
            </label>
            <p className="mt-1 text-xs text-slate-500">
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
              placeholder="e.g. I’m prepping for a behavioral + technical mock for an SWE internship; prefer async feedback on my answers, or a 30-min video call weekday evenings PT…"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/25"
            />
          </div>

          {formError && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {formError}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              onClick={() => requestDialogRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {pending ? "Posting…" : "Post request"}
            </button>
          </div>
        </form>
      </dialog>

      <dialog
        ref={detailDialogRef}
        className="w-[min(100%,36rem)] rounded-2xl border border-slate-200 p-0 shadow-xl backdrop:bg-slate-900/40"
        onClose={() => setDetailRequest(null)}
      >
        {detailRequest && (
          <>
            <div className="border-b border-slate-100 px-6 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${typeStyles[detailRequest.type].className}`}
                >
                  {typeStyles[detailRequest.type].label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                  <Sun className="size-3.5" aria-hidden />
                  Open
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Avatar
                  name={detailRequest.authorName}
                  image={detailRequest.authorImage}
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {detailRequest.authorName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(detailRequest.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="max-h-[min(60vh,28rem)] overflow-y-auto px-6 py-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {detailRequest.context}
              </p>
            </div>
            <div className="border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                className="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-200"
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
