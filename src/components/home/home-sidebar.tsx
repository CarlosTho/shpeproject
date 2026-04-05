"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Calendar,
  GraduationCap,
  Home,
  MapPinned,
  MessageCircle,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarSignOutWithConfirm } from "@/components/auth/sidebar-sign-out-with-confirm";

const studentNavItems = [
  { href: "/home",        label: "Home",        icon: Home },
  { href: "/internship",  label: "Internships",  icon: Briefcase },
  { href: "/scholarships",label: "Scholarships", icon: GraduationCap },
  { href: "/events",      label: "Events",       icon: Calendar },
  { href: "/directory",   label: "Directory",    icon: Users },
  { href: "/peer-help",   label: "Peer Help",    icon: MessageCircle },
  { href: "/profile",     label: "Profile",      icon: User },
] as const;

const nonStudentNavItems = [
  { href: "/home",        label: "Home",         icon: Home },
  { href: "/career-path", label: "Career Path",  icon: MapPinned },
  { href: "/events",      label: "Events",       icon: Calendar },
  { href: "/directory",   label: "Directory",    icon: Users },
  { href: "/peer-help",   label: "Peer Help",    icon: MessageCircle },
  { href: "/profile",     label: "Profile",      icon: User },
] as const;

type NavItem = { href: string; label: string; icon: React.ElementType };

function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.label === "Home") return pathname === "/home";
  if (item.href === "/career-path")
    return pathname === "/career-path" || pathname.startsWith("/career-path/");
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function HomeSidebar({
  audienceSegment,
}: {
  audienceSegment: "student" | "non_student" | null;
}) {
  const pathname = usePathname();
  const items: readonly NavItem[] =
    audienceSegment === "student" ? studentNavItems : nonStudentNavItems;

  return (
    <aside className="animate-slide-left flex w-[220px] shrink-0 flex-col border-r border-zinc-200/80 bg-white lg:w-[240px]">
      {/* Logo */}
      <div className="flex h-[52px] items-center gap-2.5 border-b border-zinc-100 px-4">
        <div
          className="flex size-[26px] items-center justify-center rounded-[6px] bg-zinc-900 text-[11px] font-bold tracking-tight text-white"
          aria-hidden
        >
          P
        </div>
        <span className="text-[13.5px] font-semibold tracking-tight text-zinc-900">
          Prometeo
        </span>
      </div>

      {/* Segment badge */}
      {audienceSegment && (
        <div className="px-3 pt-2.5">
          <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
            {audienceSegment === "student" ? "Student" : "Professional"}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav
        className="flex flex-1 flex-col overflow-y-auto px-2 py-2"
        aria-label="Main"
      >
        <div className="flex flex-col gap-px">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(pathname, item);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] transition-colors duration-150",
                  active
                    ? "bg-zinc-100 font-medium text-zinc-900"
                    : "font-normal text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                <Icon
                  className={cn(
                    "size-[15px] shrink-0 transition-colors",
                    active ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"
                  )}
                  strokeWidth={active ? 2.1 : 1.8}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sign out */}
      <div className="border-t border-zinc-100 px-2 py-2">
        <SidebarSignOutWithConfirm />
      </div>
    </aside>
  );
}
