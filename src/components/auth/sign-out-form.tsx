"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

function SignOutSubmit({
  label,
  className,
  showIcon,
}: {
  label: string;
  className: string;
  showIcon: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={className}
    >
      {showIcon ? (
        <LogOut className="size-[18px] shrink-0 opacity-90" strokeWidth={1.75} />
      ) : null}
      {pending ? "Signing out…" : label}
    </button>
  );
}

type Props = {
  /** Post-sign-out path; must be same-origin relative (e.g. `/signin`, `/`). */
  redirectTo?: string;
  /** Sidebar-style row (default), compact text link, or profile header button. */
  variant?: "sidebar" | "link" | "button";
  className?: string;
};

export function SignOutForm({
  redirectTo = "/signin",
  variant = "sidebar",
  className,
}: Props) {
  const styles = {
    sidebar:
      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60",
    link: "inline-flex text-xs font-medium text-teal-700 underline-offset-2 hover:text-teal-900 hover:underline disabled:opacity-60 sm:text-sm",
    button:
      "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:w-auto",
  } as const;

  const merged = className ? `${styles[variant]} ${className}` : styles[variant];
  const showIcon = variant === "sidebar" || variant === "button";

  const formClass =
    variant === "sidebar" ? "w-full" : variant === "link" ? "inline" : undefined;

  return (
    <form action={signOutAction} className={formClass}>
      <input type="hidden" name="callbackUrl" value={redirectTo} />
      <SignOutSubmit
        label="Log out"
        className={merged}
        showIcon={showIcon}
      />
    </form>
  );
}
