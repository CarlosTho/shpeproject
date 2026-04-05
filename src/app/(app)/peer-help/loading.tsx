export default function PeerHelpLoading() {
  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl animate-pulse space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
          <div className="space-y-2">
            <div className="h-6 w-32 rounded-lg bg-zinc-100" />
            <div className="h-4 w-72 rounded bg-zinc-100" />
          </div>
          <div className="h-9 w-28 rounded-lg bg-zinc-100" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-zinc-100" />
          ))}
        </div>
      </div>
    </main>
  );
}
