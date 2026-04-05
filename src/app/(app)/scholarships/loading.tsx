export default function ScholarshipsLoading() {
  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl animate-pulse space-y-5">
        <div className="flex gap-3">
          <div className="h-9 flex-1 rounded-lg bg-zinc-100" />
          <div className="h-9 w-28 rounded-lg bg-zinc-100" />
          <div className="h-9 w-28 rounded-lg bg-zinc-100" />
        </div>
        <div className="h-4 w-40 rounded bg-zinc-100" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-xl bg-zinc-100" />
          ))}
        </div>
      </div>
    </main>
  );
}
