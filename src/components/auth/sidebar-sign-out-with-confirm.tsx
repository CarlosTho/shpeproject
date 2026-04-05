"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

const triggerClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";

function ConfirmActions({ onNo }: { onNo: () => void }) {
  const { pending } = useFormStatus();
  return (
    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
      <button
        type="button"
        onClick={onNo}
        disabled={pending}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
      >
        No
      </button>
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
      >
        {pending ? "Signing out…" : "Yes, log out"}
      </button>
    </div>
  );
}

export function SidebarSignOutWithConfirm() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function open() {
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button type="button" onClick={open} className={triggerClass}>
        <LogOut className="size-[18px] shrink-0 opacity-90" strokeWidth={1.75} />
        Log out
      </button>

      <dialog
        ref={dialogRef}
        className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-900/50"
        aria-labelledby="logout-confirm-title"
      >
        <h2
          id="logout-confirm-title"
          className="text-lg font-semibold tracking-tight text-slate-900"
        >
          Log out?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Are you sure you want to log out? You can sign in again anytime.
        </p>
        <form action={signOutAction}>
          <input type="hidden" name="callbackUrl" value="/signin" />
          <ConfirmActions onNo={close} />
        </form>
      </dialog>
    </>
  );
}
