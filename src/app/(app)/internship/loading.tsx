export default function InternshipLoading() {
  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl animate-pulse space-y-5">
        <div className="flex gap-3">
          <div className="h-9 flex-1 rounded-lg bg-zinc-100" />
          <div className="h-9 w-36 rounded-lg bg-zinc-100" />
          <div className="h-9 w-24 rounded-lg bg-zinc-100" />
        </div>
        <div className="h-4 w-32 rounded bg-zinc-100" />
        <div className="h-[480px] rounded-xl bg-zinc-100" />
      </div>
    </main>
  );
}
