"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function getPerformanceBand(score) {
  const numericScore = Number(score) || 0;

  if (numericScore >= 90) return "Strong";
  if (numericScore >= 80) return "Proficient";
  if (numericScore >= 70) return "Approaching";
  if (numericScore >= 50) return "Developing";
  if (numericScore > 0) return "Beginning";
  return "No Attempt";
}

export default function TeacherPage() {
  const searchParams = useSearchParams();

  const standard = searchParams.get("standard") || "Not Set";
  const skill = searchParams.get("skill") || "Not Set";
  const textType = searchParams.get("textType") || "Not Set";
  const difficulty = searchParams.get("difficulty") || "Not Set";
  const student = searchParams.get("student") || "Demo Student";
  const status = searchParams.get("status") || "Not Started";
  const progress = searchParams.get("progress") || "No Submission Yet";
  const initialScore = Number(searchParams.get("initialScore") || 0);
  const revisedScore = Number(searchParams.get("revisedScore") || 0);
  const improvement = Number(searchParams.get("improvement") || 0);
  const initialWeaknesses = searchParams.get("initialWeaknesses") || "No diagnostics available";
  const revisedWeaknesses = searchParams.get("revisedWeaknesses") || "No diagnostics available";

  const lessonQuery = `standard=${encodeURIComponent(
    standard
  )}&skill=${encodeURIComponent(skill)}&textType=${encodeURIComponent(
    textType
  )}&difficulty=${encodeURIComponent(difficulty)}`;

  const revisedBand = getPerformanceBand(revisedScore || initialScore);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-4xl font-bold">Teacher Dashboard</h1>
        <p className="mb-8 text-slate-300">
          Manage lesson flow, preview the student experience, and monitor recent activity.
        </p>

        <div className="mb-8 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Current Lesson</h2>

          <p>
            <span className="font-semibold text-white">Standard:</span> {standard}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-white">Skill:</span> {skill}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-white">Text Type:</span> {textType}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-white">Difficulty:</span> {difficulty}
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Initial Score</p>
            <p className="mt-2 text-3xl font-bold">{initialScore}/100</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Revised Score</p>
            <p className="mt-2 text-3xl font-bold">{revisedScore}/100</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Improvement</p>
            <p className="mt-2 text-3xl font-bold">
              {improvement >= 0 ? "+" : ""}
              {improvement}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Current Performance Band</p>
            <p className="mt-2 text-2xl font-bold">{revisedBand}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="mb-3 text-xl font-semibold">Initial Diagnostic Patterns</h2>
            <p className="text-slate-300">{initialWeaknesses}</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="mb-3 text-xl font-semibold">Revised Diagnostic Patterns</h2>
            <p className="text-slate-300">{revisedWeaknesses}</p>
          </div>
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Build New Lesson</h2>
            <p className="mt-2 text-slate-300">
              Choose standards, skill focus, text type, and difficulty.
            </p>
            <Link
              href="/setup"
              className="mt-4 inline-block rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Open Lesson Builder
            </Link>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Preview Student Lesson</h2>
            <p className="mt-2 text-slate-300">
              See the lesson exactly as students experience it.
            </p>
            <Link
              href={`/lesson-demo?${lessonQuery}`}
              className="mt-4 inline-block rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-800"
            >
              Open Student Lesson
            </Link>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Class Data</h2>
            <p className="mt-2 text-slate-300">
              Completion, response quality, and growth tracking will appear here.
            </p>
            <button
              className="mt-4 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-400"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Recent Student Activity</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-300">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Standard</th>
                  <th className="px-4 py-3">Skill</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Initial</th>
                  <th className="px-4 py-3">Revised</th>
                  <th className="px-4 py-3">Growth</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-4">{student}</td>
                  <td className="px-4 py-4">{standard}</td>
                  <td className="px-4 py-4">{skill}</td>
                  <td className="px-4 py-4">{status}</td>
                  <td className="px-4 py-4">{progress}</td>
                  <td className="px-4 py-4">{initialScore}/100</td>
                  <td className="px-4 py-4">{revisedScore}/100</td>
                  <td className="px-4 py-4">
                    {improvement >= 0 ? "+" : ""}
                    {improvement}
                  </td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="px-4 py-4">Student B</td>
                  <td className="px-4 py-4">ELA.9.R.2.1</td>
                  <td className="px-4 py-4">Main Idea</td>
                  <td className="px-4 py-4">In Progress</td>
                  <td className="px-4 py-4">Initial Response Submitted</td>
                  <td className="px-4 py-4">62/100</td>
                  <td className="px-4 py-4">--</td>
                  <td className="px-4 py-4">--</td>
                </tr>

                <tr>
                  <td className="px-4 py-4">Student C</td>
                  <td className="px-4 py-4">ELA.9.V.1.3</td>
                  <td className="px-4 py-4">Context Clues</td>
                  <td className="px-4 py-4">Not Started</td>
                  <td className="px-4 py-4">No Submission Yet</td>
                  <td className="px-4 py-4">0/100</td>
                  <td className="px-4 py-4">--</td>
                  <td className="px-4 py-4">--</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-3 text-2xl font-semibold">Current MVP Flow</h2>
          <p className="text-slate-300">
            Teacher Dashboard → Lesson Builder → Student Lesson → Quality Check → Feedback → Revision → Completion Tracking
          </p>
        </div>
      </div>
    </main>
  );
}