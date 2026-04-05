import { ScholarshipBoard } from "@/components/scholarships/scholarship-board";
import { getScholarships } from "./actions";

export default async function ScholarshipsPage() {
  const scholarships = await getScholarships();

  return (
    <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10">
      <header className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Scholarships
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Find and apply to scholarships in one place. Filter by GPA, level, and
          major — no more jumping between sites.
        </p>
      </header>

      <section className="mx-auto mt-8 max-w-6xl">
        <ScholarshipBoard initialScholarships={scholarships} />
      </section>
    </main>
  );
}
