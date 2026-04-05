import { auth } from "@/auth";
import { DirectoryBoard } from "@/components/directory/directory-board";
import { getDirectoryMembers } from "./actions";

export default async function DirectoryPage() {
  const session = await auth();
  const currentUserId = session?.user?.id ?? null;
  const members = await getDirectoryMembers(undefined, currentUserId);

  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <header className="max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Directory
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Find and connect with community members.
        </p>
      </header>

      <div className="max-w-6xl">
        <DirectoryBoard
          initialMembers={members}
          currentUserId={currentUserId}
        />
      </div>
    </main>
  );
}
