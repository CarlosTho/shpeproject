import { requireAppAccess } from "@/lib/auth-guards";
import { AppSidebar } from "@/components/home/app-sidebar";

export const dynamic = "force-dynamic";

export default async function VideoTranslatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAppAccess("/video-translator");

  return (
    <div className="flex h-screen bg-slate-50">
      <AppSidebar />
      <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
