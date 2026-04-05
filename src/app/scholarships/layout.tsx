import { requireAppAccess } from "@/lib/auth-guards";
import { AppSidebar } from "@/components/home/app-sidebar";

export const dynamic = "force-dynamic";

export default async function ScholarshipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAppAccess("/scholarships");

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar />
      <div className="min-w-0 flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
