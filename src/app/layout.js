import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "GOGI",
  description: "AI-powered literacy. Structured thinking. Real mastery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="GOGI Logo"
                className="h-12 w-12 rounded-full border border-cyan-400 object-cover shadow-[0_0_20px_rgba(34,211,238,0.20)]"
              />
              <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                GOGI
              </span>
            </Link>

            <nav className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/setup"
                className="rounded-2xl px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-900 sm:text-base"
              >
                Start Learning
              </Link>
              <Link
                href="/teacher"
                className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-900 sm:text-base"
              >
                Teacher Dashboard
              </Link>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}