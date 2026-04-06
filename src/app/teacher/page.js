"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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

function toCsvValue(value) {
  const safeValue = value ?? "";
  const stringValue = String(safeValue).replace(/"/g, '""');
  return `"${stringValue}"`;
}

function downloadCsv(records) {
  const headers = [
    "First Name",
    "Last Name",
    "Period",
    "Standard",
    "Skill",
    "Status",
    "Progress",
    "Box 1 Score",
    "Box 2 Score",
    "Box 3 Score",
    "Latest Average",
    "Attempts Box 1",
    "Attempts Box 2",
    "Attempts Box 3",
    "Created At",
  ];

  const rows = records.map((record) => [
    record.first_name ?? "",
    record.last_name ?? "",
    record.period ?? "",
    record.standard ?? "",
    record.skill ?? "",
    record.status ?? "",
    record.progress ?? "",
    record.box1_score ?? 0,
    record.box2_score ?? 0,
    record.box3_score ?? 0,
    record.latest_average ?? 0,
    record.attempts_box1 ?? 0,
    record.attempts_box2 ?? 0,
    record.attempts_box3 ?? 0,
    record.created_at ?? "",
  ]);

  const csvContent = [
    headers.map(toCsvValue).join(","),
    ...rows.map((row) => row.map(toCsvValue).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}_${String(
    now.getHours()
  ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `gogi_student_data_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function TeacherPageContent() {
  const searchParams = useSearchParams();

  const standard = searchParams.get("standard") || "Not Set";
  const skill = searchParams.get("skill") || "Not Set";
  const textType = searchParams.get("textType") || "Not Set";
  const difficulty = searchParams.get("difficulty") || "Not Set";
  const student = searchParams.get("student") || "No Student Selected";
  const period = searchParams.get("period") || "Not Set";
  const status = searchParams.get("status") || "Not Started";
  const progress = searchParams.get("progress") || "No Submission Yet";
  const initialScore = Number(searchParams.get("initialScore") || 0);
  const revisedScore = Number(searchParams.get("revisedScore") || 0);
  const improvement = Number(searchParams.get("improvement") || 0);
  const initialWeaknesses =
    searchParams.get("initialWeaknesses") || "No diagnostics available";
  const revisedWeaknesses =
    searchParams.get("revisedWeaknesses") || "No diagnostics available";

  const lessonQuery = `standard=${encodeURIComponent(
    standard
  )}&skill=${encodeURIComponent(skill)}&textType=${encodeURIComponent(
    textType
  )}&difficulty=${encodeURIComponent(difficulty)}`;

  const revisedBand = getPerformanceBand(revisedScore || initialScore);

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [recordsError, setRecordsError] = useState("");
  const [periodFilter, setPeriodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadRecords() {
      try {
        setLoadingRecords(true);
        setRecordsError("");

        const response = await fetch("/api/student-responses", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load student responses.");
        }

        setRecords(data.records || []);
      } catch (error) {
        setRecordsError(error?.message || "Failed to load student responses.");
      } finally {
        setLoadingRecords(false);
      }
    }

    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    let output = [...records];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (periodFilter !== "All") {
      output = output.filter((record) => record.period === periodFilter);
    }

    if (statusFilter !== "All") {
      output = output.filter((record) => record.status === statusFilter);
    }

    if (normalizedSearch) {
      output = output.filter((record) => {
        const fullName =
          `${record.first_name || ""} ${record.last_name || ""}`.toLowerCase();
        const reverseName =
          `${record.last_name || ""}, ${record.first_name || ""}`.toLowerCase();
        const studentPeriod = (record.period || "").toLowerCase();
        const studentSkill = (record.skill || "").toLowerCase();
        const studentStandard = (record.standard || "").toLowerCase();

        return (
          fullName.includes(normalizedSearch) ||
          reverseName.includes(normalizedSearch) ||
          studentPeriod.includes(normalizedSearch) ||
          studentSkill.includes(normalizedSearch) ||
          studentStandard.includes(normalizedSearch)
        );
      });
    }

    if (sortBy === "highest") {
      output.sort(
        (a, b) =>
          (Number(b.latest_average) || 0) - (Number(a.latest_average) || 0)
      );
    } else if (sortBy === "lowest") {
      output.sort(
        (a, b) =>
          (Number(a.latest_average) || 0) - (Number(b.latest_average) || 0)
      );
    } else if (sortBy === "name") {
      output.sort((a, b) => {
        const nameA =
          `${a.last_name || ""}, ${a.first_name || ""}`.toLowerCase();
        const nameB =
          `${b.last_name || ""}, ${b.first_name || ""}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else {
      output.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
    }

    return output;
  }, [records, periodFilter, statusFilter, sortBy, searchTerm]);

  const summary = useMemo(() => {
    const totalStudents = filteredRecords.length;
    const completed = filteredRecords.filter(
      (record) => record.status === "Completed"
    ).length;
    const inProgress = filteredRecords.filter(
      (record) => record.status !== "Completed"
    ).length;

    const averageScore =
      totalStudents > 0
        ? Math.round(
            filteredRecords.reduce(
              (sum, record) => sum + (Number(record.latest_average) || 0),
              0
            ) / totalStudents
          )
        : 0;

    const strongestStudent =
      filteredRecords.length > 0
        ? [...filteredRecords].sort(
            (a, b) =>
              (Number(b.latest_average) || 0) -
              (Number(a.latest_average) || 0)
          )[0]
        : null;

    return {
      totalStudents,
      completed,
      inProgress,
      averageScore,
      strongestStudent,
    };
  }, [filteredRecords]);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-4xl font-bold">Teacher Dashboard</h1>
        <p className="mb-8 text-slate-300">
          Manage lesson flow, preview the student experience, and monitor real
          student activity.
        </p>

        <div className="mb-8 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Current Lesson</h2>

          <p>
            <span className="font-semibold text-white">Standard:</span>{" "}
            {standard}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-white">Skill:</span> {skill}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-white">Text Type:</span>{" "}
            {textType}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-white">Difficulty:</span>{" "}
            {difficulty}
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

        <div className="mb-8 rounded-2xl border border-cyan-800 bg-cyan-900/20 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Current Student Snapshot
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Student</p>
              <p className="mt-2 text-xl font-bold">{student}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Period</p>
              <p className="mt-2 text-xl font-bold">{period}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Status</p>
              <p className="mt-2 text-xl font-bold">{status}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Progress</p>
              <p className="mt-2 text-xl font-bold">{progress}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="mb-3 text-xl font-semibold">
              Initial Diagnostic Patterns
            </h2>
            <p className="text-slate-300">{initialWeaknesses}</p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6">
            <h2 className="mb-3 text-xl font-semibold">
              Revised Diagnostic Patterns
            </h2>
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
            <h2 className="text-xl font-semibold">Class Summary</h2>
            <p className="mt-2 text-slate-300">Live records from Supabase.</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl bg-slate-950 p-3">
                <p className="text-sm text-slate-400">Visible Records</p>
                <p className="mt-1 text-xl font-bold">
                  {summary.totalStudents}
                </p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3">
                <p className="text-sm text-slate-400">Completed</p>
                <p className="mt-1 text-xl font-bold">{summary.completed}</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3">
                <p className="text-sm text-slate-400">In Progress</p>
                <p className="mt-1 text-xl font-bold">{summary.inProgress}</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-3">
                <p className="text-sm text-slate-400">Average Score</p>
                <p className="mt-1 text-xl font-bold">
                  {summary.averageScore}/100
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Dashboard Controls</h2>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Search Students
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, period, skill, or standard"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Filter by Period
              </label>
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
              >
                <option value="All">All Periods</option>
                <option value="Pd 1">Pd 1</option>
                <option value="Pd 2">Pd 2</option>
                <option value="Pd 3">Pd 3</option>
                <option value="Pd 4">Pd 4</option>
                <option value="Pd 5">Pd 5</option>
                <option value="Pd 6">Pd 6</option>
                <option value="Pd 7">Pd 7</option>
                <option value="Pd 8">Pd 8</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Score</option>
                <option value="lowest">Lowest Score</option>
                <option value="name">Student Name</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={() => downloadCsv(filteredRecords)}
              disabled={filteredRecords.length === 0}
              className={`rounded-xl px-5 py-3 font-semibold ${
                filteredRecords.length === 0
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              }`}
            >
              Export CSV
            </button>

            {(searchTerm || periodFilter !== "All" || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPeriodFilter("All");
                  setStatusFilter("All");
                  setSortBy("newest");
                }}
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-800"
              >
                Clear Filters
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-300">
              Showing results for:{" "}
              <span className="font-semibold">{searchTerm}</span>
            </div>
          )}

          {summary.strongestStudent && (
            <div className="mt-4 rounded-xl border border-emerald-800 bg-emerald-900/20 p-4">
              <p className="text-sm text-emerald-300">
                Current top visible student:
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                {summary.strongestStudent.first_name}{" "}
                {summary.strongestStudent.last_name} —{" "}
                {summary.strongestStudent.latest_average}/100
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            Recent Student Activity
          </h2>

          {loadingRecords && (
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-300">
              Loading student records...
            </div>
          )}

          {!loadingRecords && recordsError && (
            <div className="rounded-xl border border-red-700 bg-red-900/20 p-4 text-red-300">
              {recordsError}
            </div>
          )}

          {!loadingRecords && !recordsError && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-300">
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Period</th>
                    <th className="px-4 py-3">Standard</th>
                    <th className="px-4 py-3">Skill</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Progress</th>
                    <th className="px-4 py-3">Box 1</th>
                    <th className="px-4 py-3">Box 2</th>
                    <th className="px-4 py-3">Box 3</th>
                    <th className="px-4 py-3">Average</th>
                    <th className="px-4 py-3">Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="px-4 py-6 text-slate-400">
                        No student records match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-slate-800"
                      >
                        <td className="px-4 py-4">
                          {record.first_name} {record.last_name}
                        </td>
                        <td className="px-4 py-4">{record.period}</td>
                        <td className="px-4 py-4">{record.standard || "--"}</td>
                        <td className="px-4 py-4">{record.skill || "--"}</td>
                        <td className="px-4 py-4">{record.status || "--"}</td>
                        <td className="px-4 py-4">{record.progress || "--"}</td>
                        <td className="px-4 py-4">
                          {record.box1_score ?? 0}/100
                        </td>
                        <td className="px-4 py-4">
                          {record.box2_score ?? 0}/100
                        </td>
                        <td className="px-4 py-4">
                          {record.box3_score ?? 0}/100
                        </td>
                        <td className="px-4 py-4">
                          {record.latest_average ?? 0}/100
                        </td>
                        <td className="px-4 py-4">
                          {(record.attempts_box1 ?? 0) +
                            (record.attempts_box2 ?? 0) +
                            (record.attempts_box3 ?? 0)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-10 rounded-2xl bg-slate-900 p-6">
          <h2 className="mb-3 text-2xl font-semibold">Current MVP Flow</h2>
          <p className="text-slate-300">
            Teacher Dashboard → Lesson Builder → Student Lesson → Quality Check
            → Feedback → Revision → Completion Tracking → Stored Class Data
          </p>
        </div>
      </div>
    </main>
  );
}

function TeacherPageFallback() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-slate-900 p-6">
          <h1 className="text-4xl font-bold">Teacher Dashboard</h1>
          <p className="mt-2 text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    </main>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<TeacherPageFallback />}>
      <TeacherPageContent />
    </Suspense>
  );
}