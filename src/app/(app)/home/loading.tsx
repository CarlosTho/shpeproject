export default function HomeLoading() {
  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl animate-pulse space-y-6">
        <div className="h-8 w-48 rounded-lg bg-zinc-100" />
        <div className="h-4 w-96 rounded bg-zinc-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-zinc-100" />
          ))}
        </div>
      </div>
    </main>
  );
}
