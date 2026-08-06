"use client";

import Image from "next/image";
import ThemeToggle from "../ThemeToggle";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase/client";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier || !trimmedPassword) {
      setErrorMessage("Enter your email or membership ID and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );

      let emailToUse = trimmedIdentifier;

      if (!trimmedIdentifier.includes("@")) {
        const userQuery = query(
          collection(db, "users"),
          where("membershipId", "==", trimmedIdentifier),
        );
        const snapshot = await getDocs(userQuery);

        if (snapshot.empty) {
          setErrorMessage("No membership ID matched that account.");
          return;
        }

        emailToUse = snapshot.docs[0].data().email as string;
      }

      await signInWithEmailAndPassword(auth, emailToUse, trimmedPassword);
      setStatusMessage("Signed in successfully. Redirecting...");
      router.replace("/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Sign in failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            href="/register"
            className="inline-flex items-center justify-center rounded-full border
              dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
              border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
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
            <p className="text-sm sm:text-base dark:text-zinc-400 text-zinc-700">
              Access exclusive member resources and updates
            </p>
          </div>{" "}
          {/* Login Form Container */}
          <div className="rounded-3xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/40 bg-white p-6 sm:p-8">            {/* Email Requirement Notice */}
            <div className="mb-6 p-3 rounded-lg dark:bg-blue-950/40 bg-blue-50 border dark:border-blue-900/50 border-blue-200">
              <p className="text-xs dark:text-blue-200 text-blue-800">
                ⓘ Enter either your email or membership ID to login.
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                  {errorMessage}
                </div>
              ) : null}
              {statusMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                  {statusMessage}
                </div>
              ) : null}
              {/* Email or Membership ID */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                  Email or Membership ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="you@email.com or ROBOCEK-2024-001"
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="h-11 rounded-xl border
                    dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                    border-zinc-300 bg-white text-black placeholder:text-zinc-500
                    px-4 text-sm focus:outline-none focus:ring-2
                    dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                    focus:ring-zinc-600 focus:border-zinc-600
                    transition"
                />
                <p className="text-[0.65rem] dark:text-zinc-500 text-zinc-600">
                  Use any email address or your ROBOCEK membership ID
                </p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 rounded-xl border
                    dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                    border-zinc-300 bg-white text-black placeholder:text-zinc-500
                    px-4 text-sm focus:outline-none focus:ring-2
                    dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                    focus:ring-zinc-600 focus:border-zinc-600
                    transition"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="w-4 h-4 rounded border
                      dark:border-zinc-800 dark:bg-black dark:checked:bg-zinc-50 dark:checked:border-zinc-50
                      border-zinc-300 bg-white checked:bg-black checked:border-black
                      cursor-pointer"
                  />
                  <span className="dark:text-zinc-400 text-zinc-600">
                    Remember me
                  </span>
                </label>
                <a
                  href="mailto:robocek@gcek.ac.in"
                  className="dark:text-zinc-400 text-zinc-600 hover:dark:text-zinc-200 hover:text-zinc-800 transition"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px dark:bg-zinc-800 bg-zinc-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="dark:bg-zinc-950 bg-white dark:text-zinc-600 text-zinc-400 px-2">
                  Or
                </span>
              </div>
            </div>{" "}            {/* Info Box */}
            <div className="rounded-xl dark:bg-zinc-900/50 bg-gray-100 p-4 border dark:border-zinc-800 border-zinc-300">
              <p className="text-xs dark:text-zinc-400 text-zinc-700 leading-relaxed">
                First time logging in? Please{" "}
                <Link
                  href="/register"
                  className="font-semibold dark:text-zinc-50 text-black hover:underline"
                >
                  register your interest
                </Link>{" "}
                and contact us at{" "}
                <a
                  href="mailto:robocek@gcek.ac.in"
                  className="font-semibold dark:text-zinc-50 text-black hover:underline"
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

