import Image from "next/image";
import ThemeToggle from "../ThemeToggle";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-white text-black dark:bg-black dark:text-zinc-50"
    >
      <ThemeToggle />

      {/* HEADER with Navigation */}
      <header className="w-full border-b dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Image
              src="/logo_white.png"
              alt="ROBOCEK logo"
              width={32}
              height={32}
              className="hidden dark:block select-none"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              src="/logo_black.png"
              alt="ROBOCEK logo"
              width={32}
              height={32}
              className="block dark:hidden select-none"
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-sm font-semibold tracking-widest uppercase">
              ROBOCEK
            </span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border
              dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
              border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
              px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] transition"
          >
            Member Login
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full flex flex-col items-center py-12 sm:py-16">
        <div className="w-full max-w-2xl px-6 sm:px-10 lg:px-16">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              Join ROBOCEK
            </h1>
            <p className="text-sm sm:text-base dark:text-zinc-400 text-zinc-700 max-w-md mx-auto">
              Register your interest in the Robotics Club and fill out the
              details below. We'll get back to you with information about
              upcoming sessions and events.
            </p>
          </div>{" "}
          {/* Registration Form */}
          <div className="rounded-3xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/40 bg-white p-6 sm:p-8">            {/* Email Requirement Notice */}
            <div className="mb-6 p-3 rounded-lg dark:bg-blue-950/40 bg-blue-50 border dark:border-blue-900/50 border-blue-200">
              <p className="text-xs dark:text-blue-200 text-blue-800">
                ⓘ Any email address is accepted for registration.
              </p>
            </div>

            <form className="space-y-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  className="h-11 rounded-xl border
                    dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                    border-zinc-300 bg-white text-black placeholder:text-zinc-500
                    px-4 text-sm focus:outline-none focus:ring-2
                    dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                    focus:ring-zinc-600 focus:border-zinc-600
                    transition"
                />
              </div>{" "}              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  required
                  className="h-11 rounded-xl border
                    dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                    border-zinc-300 bg-white text-black placeholder:text-zinc-500
                    px-4 text-sm focus:outline-none focus:ring-2
                    dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                    focus:ring-zinc-600 focus:border-zinc-600
                    transition"
                />
                <p className="text-[0.65rem] dark:text-zinc-500 text-zinc-600">
                  Use any valid email address
                </p>
              </div>
              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  className="h-11 rounded-xl border
                    dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                    border-zinc-300 bg-white text-black placeholder:text-zinc-500
                    px-4 text-sm focus:outline-none focus:ring-2
                    dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                    focus:ring-zinc-600 focus:border-zinc-600
                    transition"
                />
              </div>
              {/* Branch and Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ECE, ME, CS"
                    required
                    className="h-11 rounded-xl border
                      dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                      border-zinc-300 bg-white text-black placeholder:text-zinc-500
                      px-4 text-sm focus:outline-none focus:ring-2
                      dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                      focus:ring-zinc-600 focus:border-zinc-600
                      transition"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                    Year / Semester <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. S3, S5, S7"
                    required
                    className="h-11 rounded-xl border
                      dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                      border-zinc-300 bg-white text-black placeholder:text-zinc-500
                      px-4 text-sm focus:outline-none focus:ring-2
                      dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                      focus:ring-zinc-600 focus:border-zinc-600
                      transition"
                  />
                </div>
              </div>
              {/* Areas of Interest */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                  Areas of Interest <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    "Robotics & Autonomous Systems",
                    "Embedded Systems",
                    "Computer Vision",
                    "Mechanical Design & Fabrication",
                    "Coding & Control",
                    "Research & Innovation",
                  ].map((interest) => (
                    <label
                      key={interest}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border
                          dark:border-zinc-800 dark:bg-black dark:checked:bg-zinc-50 dark:checked:border-zinc-50
                          border-zinc-300 bg-white checked:bg-black checked:border-black
                          cursor-pointer"
                      />
                      <span className="text-sm dark:text-zinc-300 text-zinc-700">
                        {interest}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Additional Comments */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                  Additional Comments
                </label>
                <textarea
                  placeholder="Tell us about your robotics experience, project ideas, or anything else you'd like us to know..."
                  rows={4}
                  className="rounded-xl border
                    dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                    border-zinc-300 bg-white text-black placeholder:text-zinc-500
                    px-4 py-3 text-sm focus:outline-none focus:ring-2
                    dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                    focus:ring-zinc-600 focus:border-zinc-600
                    transition resize-none"
                />
              </div>
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition"
                >
                  Complete Registration
                </button>
              </div>
            </form>

            {/* Important Notice */}
            <div className="mt-8 pt-6 border-t dark:border-zinc-800 border-zinc-300">
              <div className="rounded-xl dark:bg-zinc-900/50 bg-gray-100 p-4 border dark:border-zinc-800 border-zinc-300">
                <p className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-semibold mb-2">
                  ⚡ Important
                </p>
                <p className="text-xs dark:text-zinc-300 text-zinc-800 leading-relaxed">
                  After filling out this form, please send an email to{" "}
                  <a
                    href="mailto:robocek@gcek.ac.in"
                    className="font-semibold dark:text-zinc-50 text-black hover:underline"
                  >
                    robocek@gcek.ac.in
                  </a>{" "}
                  with your details and the form information you just submitted.
                  Please mention your name and branch in the email subject line
                  for faster processing.
                </p>
                <p className="text-xs dark:text-zinc-400 text-zinc-600 mt-3">
                  💡 <span className="italic">Pro tip:</span> Also check the
                  official GCEK notice board and announcements for official
                  ROBOCEK recruitment sessions and workshops.
                </p>
              </div>
            </div>
          </div>
          {/* Back to Home Link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-xs dark:text-zinc-500 text-zinc-600 hover:dark:text-zinc-300 hover:text-zinc-800 transition uppercase tracking-[0.18em]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.7rem] dark:text-zinc-500 text-zinc-600">
          <p>
            © {new Date().getFullYear()} ROBOCEK · Robotics Club, Government
            College of Engineering Kannur.
          </p>
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-[0.18em] dark:text-zinc-600 text-zinc-500">
              Designed in B/W
            </span>
            <span className="h-px w-10 dark:bg-zinc-700 bg-zinc-300" />
            <a
              href="/"
              className="dark:hover:text-zinc-200 hover:text-zinc-800 transition uppercase tracking-[0.16em]"
            >
              Home
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

