import { requireAppAccess } from "@/lib/auth-guards";
import { AppSidebar } from "@/components/home/app-sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAppAccess("/home");

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <AppSidebar />
      <div className="min-w-0 flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
