import Image from "next/image";
import ThemeToggle from "../ThemeToggle";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans
        bg-black text-zinc-50 dark:bg-black dark:text-zinc-50
        light:bg-white light:text-black"
    >
      <ThemeToggle />

      {/* HEADER with Navigation */}
      <header className="w-full border-b dark:border-zinc-900 light:border-zinc-300 dark:bg-black/95 light:bg-white/95 backdrop-blur-sm sticky top-0 z-50">
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
            href="/register"
            className="inline-flex items-center justify-center rounded-full border
              dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
              light:border-zinc-400 light:text-zinc-700 light:hover:border-zinc-800 light:hover:text-black light:hover:bg-gray-100
              px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] transition"
          >
            Join ROBOCEK
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 sm:py-16">
        <div className="w-full max-w-md px-6 sm:px-10">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
              Member Login
            </h1>
            <p className="text-sm sm:text-base dark:text-zinc-400 light:text-zinc-700">
              Access exclusive member resources and updates
            </p>
          </div>{" "}
          {/* Login Form Container */}
          <div className="rounded-3xl border dark:border-zinc-800 light:border-zinc-300 dark:bg-zinc-950/40 light:bg-white p-6 sm:p-8">            {/* Email Requirement Notice */}
            <div className="mb-6 p-3 rounded-lg dark:bg-blue-950/40 light:bg-blue-50 border dark:border-blue-900/50 light:border-blue-200">
              <p className="text-xs dark:text-blue-200 light:text-blue-800">
                ⓘ Enter either your email or membership ID to login.
              </p>
            </div>
            <form className="space-y-6">
              {/* Email or Membership ID */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 light:text-zinc-700 font-medium">
                  Email or Membership ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="you@email.com or ROBOCEK-2024-001"
                  required
                  className="h-11 rounded-xl border
                    dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                    light:border-zinc-300 light:bg-white light:text-black light:placeholder:text-zinc-500
                    px-4 text-sm focus:outline-none focus:ring-2
                    dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                    light:focus:ring-zinc-600 light:focus:border-zinc-600
                    transition"
                />
                <p className="text-[0.65rem] dark:text-zinc-500 light:text-zinc-600">
                  Use any email address or your ROBOCEK membership ID
                </p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 light:text-zinc-700 font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-11 rounded-xl border
                    dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                    light:border-zinc-300 light:bg-white light:text-black light:placeholder:text-zinc-500
                    px-4 text-sm focus:outline-none focus:ring-2
                    dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                    light:focus:ring-zinc-600 light:focus:border-zinc-600
                    transition"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border
                      dark:border-zinc-800 dark:bg-black dark:checked:bg-zinc-50 dark:checked:border-zinc-50
                      light:border-zinc-300 light:bg-white light:checked:bg-black light:checked:border-black
                      cursor-pointer"
                  />
                  <span className="dark:text-zinc-400 light:text-zinc-600">
                    Remember me
                  </span>
                </label>
                <a
                  href="mailto:robocek@gcek.ac.in"
                  className="dark:text-zinc-400 light:text-zinc-600 hover:dark:text-zinc-200 hover:light:text-zinc-800 transition"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-full dark:bg-zinc-50 light:bg-black px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] dark:text-black light:text-white dark:hover:bg-zinc-200 light:hover:bg-zinc-900 transition"
                >
                  Sign In
                </button>
              </div>
            </form>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px dark:bg-zinc-800 light:bg-zinc-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="dark:bg-zinc-950 light:bg-white dark:text-zinc-600 light:text-zinc-400 px-2">
                  Or
                </span>
              </div>
            </div>{" "}            {/* Info Box */}
            <div className="rounded-xl dark:bg-zinc-900/50 light:bg-gray-100 p-4 border dark:border-zinc-800 light:border-zinc-300">
              <p className="text-xs dark:text-zinc-400 light:text-zinc-700 leading-relaxed">
                First time logging in? Please{" "}
                <Link
                  href="/register"
                  className="font-semibold dark:text-zinc-50 light:text-black hover:underline"
                >
                  register your interest
                </Link>{" "}
                and contact us at{" "}
                <a
                  href="mailto:robocek@gcek.ac.in"
                  className="font-semibold dark:text-zinc-50 light:text-black hover:underline"
                >
                  robocek@gcek.ac.in
                </a>{" "}
                to get your membership ID.
              </p>
            </div>
          </div>
          {/* Back to Home Link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-xs dark:text-zinc-500 light:text-zinc-600 hover:dark:text-zinc-300 hover:light:text-zinc-800 transition uppercase tracking-[0.18em]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t dark:border-zinc-900 light:border-zinc-300 dark:bg-black/95 light:bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.7rem] dark:text-zinc-500 light:text-zinc-600">
          <p>
            © {new Date().getFullYear()} ROBOCEK · Robotics Club, Government
            College of Engineering Kannur.
          </p>
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-[0.18em] dark:text-zinc-600 light:text-zinc-500">
              Designed in B/W
            </span>
            <span className="h-px w-10 dark:bg-zinc-700 light:bg-zinc-300" />
            <a
              href="/"
              className="dark:hover:text-zinc-200 light:hover:text-zinc-800 transition uppercase tracking-[0.16em]"
            >
              Home
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
