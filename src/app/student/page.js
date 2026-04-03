import Link from "next/link";

export default function StudentPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="mb-6 text-4xl font-bold">Student Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Today's Task</h2>
          <p className="mt-2 text-slate-300">
            Read the assigned passage and answer 5 questions.
          </p>
        </div>

        <Link
          href="/tutor"
          className="block rounded-2xl bg-slate-900 p-6 transition hover:bg-slate-800"
        >
          <h2 className="text-xl font-semibold">AI Tutor</h2>
          <p className="mt-2 text-slate-300">
            Get guided help understanding difficult parts of the text.
          </p>
        </Link>

        <div className="rounded-2xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Progress</h2>
          <p className="mt-2 text-slate-300">
            Track your reading, writing, and comprehension growth.
          </p>
        </div>
      </div>
    </main>
  );
}