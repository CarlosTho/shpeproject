export default function DirectoryLoading() {
  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl animate-pulse space-y-5">
        <div className="h-9 w-full rounded-lg bg-zinc-100" />
        <div className="h-4 w-32 rounded bg-zinc-100" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-zinc-100" />
          ))}
        </div>
      </div>
    </main>
  );
}
