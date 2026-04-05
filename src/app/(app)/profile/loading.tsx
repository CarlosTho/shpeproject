export default function ProfileLoading() {
  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-zinc-100" />
          <div className="space-y-2">
            <div className="h-6 w-40 rounded-lg bg-zinc-100" />
            <div className="h-4 w-56 rounded bg-zinc-100" />
          </div>
        </div>
        <div className="h-48 rounded-xl bg-zinc-100" />
      </div>
    </main>
  );
}
