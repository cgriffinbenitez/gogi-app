import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_35%)]" />

        <div className="mb-10 flex items-center justify-center gap-6 sm:gap-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-2xl animate-pulse" />
            <img
              src="/logo.png"
              alt="GOGI Logo"
              className="relative h-28 w-28 rounded-full border-2 border-cyan-400 object-cover shadow-[0_0_40px_rgba(34,211,238,0.25)] sm:h-36 sm:w-36 md:h-40 md:w-40"
            />
          </div>

          <div className="text-left">
            <p className="mb-3 text-base font-semibold uppercase tracking-[0.3em] text-cyan-400 sm:text-lg">
              Live AI Literacy Engine
            </p>
            <h1 className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl md:text-8xl">
              GOGI
            </h1>
          </div>
        </div>

        <p className="mx-auto max-w-4xl text-2xl leading-relaxed text-slate-300 sm:text-3xl md:text-4xl">
          AI-powered literacy. Structured thinking. Real mastery.
        </p>

        <p className="mt-6 mx-auto max-w-4xl text-lg leading-relaxed text-slate-400 sm:text-xl md:text-2xl">
          Teach the skill. Evaluate the writing. Force the revision loop until the response is strong enough to move forward.
        </p>

        <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:justify-center">
          <Link
            href="/setup"
            className="rounded-3xl bg-cyan-500 px-12 py-6 text-xl font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-400"
          >
            Start Learning
          </Link>

          <Link
            href="/teacher"
            className="rounded-3xl border border-slate-600 px-12 py-6 text-xl font-bold transition hover:scale-[1.02] hover:bg-slate-900"
          >
            Teacher Dashboard
          </Link>
        </div>

        <div className="mt-20 grid w-full max-w-6xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-left shadow-lg">
            <p className="mb-3 text-base font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Step 1
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">Learn the Skill</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Students get direct instruction, strategies, and clear guidance before they ever answer.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-left shadow-lg">
            <p className="mb-3 text-base font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Step 2
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">Write and Think</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Students respond in structured boxes that move from idea to evidence to explanation.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-left shadow-lg">
            <p className="mb-3 text-base font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Step 3
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">Revise to Mastery</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Live AI feedback blocks weak answers and forces revision until the student meets the quality bar.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}