"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Calendar,
  FileText,
  Gift,
  GraduationCap,
  Home,
  MapPinned,
  MessageCircle,
  Play,
  Target,
  User,
  Users,
} from "lucide-react";
import { SidebarSignOutWithConfirm } from "@/components/auth/sidebar-sign-out-with-confirm";

const accent = {
  active: "bg-teal-600 text-white shadow-sm",
  idle:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/career-path", label: "Career Path", icon: MapPinned },
  { href: "/directory", label: "Directory", icon: Users },
  { href: "/internship", label: "Opportunities", icon: Target },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
  { href: "/peer-help", label: "Peer Help", icon: MessageCircle },
  { href: "/video-translator", label: "Video Translator", icon: Play },
  { href: "/home", label: "Offers", icon: Gift },
  { href: "/home", label: "Companies", icon: Building2 },
  { href: "/home", label: "Resume Review", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
] as const;

function isNavActive(pathname: string, item: (typeof navItems)[number]) {
  if (item.label === "Home") {
    return pathname === "/home";
  }
  /* Placeholder links still go to /home — don’t highlight them on /home. */
  if (item.href === "/home") {
    return false;
  }
  if (item.href === "/career-path") {
    return (
      pathname === "/career-path" ||
      pathname.startsWith("/career-path/")
    );
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function HomeSidebar({
  showCareerPathNav = true,
}: {
  showCareerPathNav?: boolean;
}) {
  const pathname = usePathname();
  const items = showCareerPathNav
    ? navItems
    : navItems.filter((item) => item.href !== "/career-path");

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:w-72">
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
        <div className="flex flex-col gap-1" aria-hidden>
          <span className="h-1 w-7 rounded-full bg-amber-400" />
          <span className="h-1 w-5 rounded-full bg-amber-400/80" />
          <span className="h-1 w-6 rounded-full bg-amber-400/60" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          Prometeo
        </span>
      </div>

      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3"
        aria-label="Main"
      >
        <div className="flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(pathname, item);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? accent.active : accent.idle}`}
              >
                <Icon className="size-[18px] shrink-0 opacity-90" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto border-t border-slate-100 pt-2">
          <SidebarSignOutWithConfirm />
        </div>
      </nav>
    </aside>
  );
}
