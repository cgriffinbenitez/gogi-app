"use client";

import { useState } from "react";
import Link from "next/link";

export default function SetupPage() {
  const [standard, setStandard] = useState("ELA.9.R.1.1");
  const [skill, setSkill] = useState("Theme");
  const [textType, setTextType] = useState("Literary Passage");
  const [difficulty, setDifficulty] = useState("On Grade Level");

  const lessonQuery = `standard=${encodeURIComponent(
    standard
  )}&skill=${encodeURIComponent(skill)}&textType=${encodeURIComponent(
    textType
  )}&difficulty=${encodeURIComponent(difficulty)}`;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">GOGI Lesson Setup</h1>
        <p className="mb-8 text-slate-300">
          Select the lesson inputs below.
        </p>

        <div className="grid gap-6 rounded-2xl bg-slate-900 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Florida B.E.S.T. Standard
            </label>
            <select
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
            >
              <option>ELA.9.R.1.1</option>
              <option>ELA.9.R.1.2</option>
              <option>ELA.9.R.2.1</option>
              <option>ELA.9.R.2.2</option>
              <option>ELA.9.V.1.3</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Skill Focus
            </label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
            >
              <option>Theme</option>
              <option>Main Idea</option>
              <option>Inference</option>
              <option>Text Evidence</option>
              <option>Context Clues</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Text Type
            </label>
            <select
              value={textType}
              onChange={(e) => setTextType(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
            >
              <option>Literary Passage</option>
              <option>Informational Text</option>
              <option>Poem</option>
              <option>Speech / Argument</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
            >
              <option>Below Grade Level</option>
              <option>On Grade Level</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Preview</h2>

          <p className="text-slate-300">
            <span className="font-semibold text-white">Standard:</span> {standard}
          </p>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold text-white">Skill:</span> {skill}
          </p>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold text-white">Text Type:</span> {textType}
          </p>
          <p className="mt-2 text-slate-300">
            <span className="font-semibold text-white">Difficulty:</span> {difficulty}
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={`/lesson-demo?${lessonQuery}`}
              className="rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Build Lesson
            </Link>

            <Link
              href={`/teacher?${lessonQuery}`}
              className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
            >
              Send to Teacher Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}