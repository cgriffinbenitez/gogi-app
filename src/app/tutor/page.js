"use client";

import { useState } from "react";
import Link from "next/link";

export default function TutorPage() {
  const [studentQuestion, setStudentQuestion] = useState(
    "Help me figure out the central idea."
  );

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">AI Tutor</h1>
        <p className="mb-8 text-slate-300">
          This demo shows how GOGI can support a student without just giving away the answer.
        </p>

        <div className="mb-6 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-3 text-2xl font-semibold">Student Question</h2>
          <textarea
            value={studentQuestion}
            onChange={(e) => setStudentQuestion(e.target.value)}
            className="min-h-[120px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white"
          />
        </div>

        <div className="mb-6 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-3 text-2xl font-semibold">AI Tutor Response</h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Let’s slow down and think it through together.
            </p>
            <p>
              First, ask yourself: what idea shows up across the whole passage, not just one sentence?
            </p>
            <p>
              Next, notice the contrast between “instant answers” and “deep learning.” What point is the author making about technology and thinking?
            </p>
            <p>
              Try answering this: is the passage mostly praising technology, warning against it, or explaining that it must be used carefully?
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/lesson-demo"
            className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
          >
            Back to Lesson
          </Link>

          <Link
            href="/"
            className="rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}