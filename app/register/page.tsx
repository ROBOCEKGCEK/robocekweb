"use client";

import Image from "next/image";
import ThemeToggle from "../ThemeToggle";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UiIcon from "../components/UiIcon";
import TiltCard from "../components/TiltCard";
import CyberBackground from "../components/CyberBackground";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [yearSemester, setYearSemester] = useState("");
  const [comments, setComments] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [membershipIdState, setMembershipIdState] = useState<string | null>(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  const interestOptions = useMemo(
    () => [
      "Robotics & Autonomous Systems",
      "Embedded Systems",
      "Computer Vision",
      "Mechanical Design & Fabrication",
      "Coding & Control",
      "Research & Innovation",
    ],
    [],
  );

  const batchOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 4 }, (_, i) => {
      const year = currentYear - i;
      return `2k${year.toString().slice(-2)}`;
    });
  }, []);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((value) => value !== interest)
        : [...current, interest],
    );
  };

  useEffect(() => {
    if (!auth || !db) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedInUser(true);
        setEmail(user.email || "");
        setFullName(user.displayName || "");
        try {
          const userDocSnap = await getDoc(doc(db, "users", user.uid));
          if (userDocSnap.exists()) {
            const d = userDocSnap.data();
            if (d.fullName) setFullName(d.fullName);
            if (d.phoneNumber || d.phone) setPhoneNumber(d.phoneNumber || d.phone);
            if (d.branch) setBranch(d.branch);
            if (d.yearSemester || d.year) setYearSemester(d.yearSemester || d.year);
            if (Array.isArray(d.interests)) setSelectedInterests(d.interests);
          }
        } catch (err) {
          console.warn("Could not pre-fill registration details:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!auth || !db) {
      setErrorMessage("Firebase registration is not configured. Please check environment variables.");
      return;
    }

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phoneNumber.trim();
    const trimmedBranch = branch.trim();
    const trimmedYearSemester = yearSemester.trim();
    const trimmedPassword = password.trim();

    if (!trimmedFullName || !trimmedEmail || !trimmedPhone || !trimmedBranch || !trimmedYearSemester) {
      setErrorMessage("Fill in all required fields.");
      return;
    }

    if (selectedInterests.length === 0) {
      setErrorMessage("Select at least one area of interest.");
      return;
    }

    // If existing logged-in user updating profile
    if (isLoggedInUser && auth.currentUser) {
      setIsSubmitting(true);
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          fullName: trimmedFullName,
          phone: trimmedPhone,
          phoneNumber: trimmedPhone,
          branch: trimmedBranch,
          yearSemester: trimmedYearSemester,
          year: trimmedYearSemester,
          interests: selectedInterests,
          comments: comments.trim(),
          updatedAt: serverTimestamp(),
        });

        await updateProfile(auth.currentUser, { displayName: trimmedFullName });
        setStatusMessage("Profile registration details updated successfully!");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1200);
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to update profile.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!trimmedPassword) {
      setErrorMessage("Password is required.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (trimmedPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword,
      );

      await updateProfile(userCredential.user, {
        displayName: trimmedFullName,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName: trimmedFullName,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
        phone: trimmedPhone,
        branch: trimmedBranch,
        yearSemester: trimmedYearSemester,
        year: trimmedYearSemester,
        interests: selectedInterests,
        comments: comments.trim(),
        status: "Pending Approval",
        membershipId: null,
        createdAt: serverTimestamp(),
      });

      setStatusMessage(
        "Registration successful! Your account was saved and is pending admin confirmation.",
      );
      setIsPendingApproval(true);
      // Do not auto-redirect — wait for admin approval. Provide membershipId if assigned later.
    } catch (error: unknown) {
      let msg = "Registration failed.";
      if (typeof error === "object" && error !== null && "code" in error) {
        const errCode = (error as { code: string }).code;
        if (errCode === "auth/email-already-in-use") {
          msg = "This email is already registered. Please sign in instead.";
        } else if (errCode === "auth/weak-password") {
          msg = "Password must be at least 6 characters long.";
        } else if (errCode === "auth/invalid-email") {
          msg = "Please enter a valid email address.";
        } else if (error instanceof Error) {
          msg = error.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkApprovalStatus = async () => {
    if (!auth || !db || !auth.currentUser) return;
    try {
      const userDocSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (!userDocSnap.exists()) {
        setStatusMessage("No profile found yet. Please wait for admin to approve your registration.");
        return;
      }

      const data = userDocSnap.data();
      const status = (data.status || "").toString().toLowerCase();
      const mid = data.membershipId || null;
      if (mid) setMembershipIdState(mid as string);

      if (status === "approved") {
        setStatusMessage("Your account has been approved. Redirecting to dashboard...");
        setTimeout(() => router.replace("/dashboard"), 800);
      } else {
        setStatusMessage("Your account is still pending approval. Click Refresh to check again.");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to check approval status.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-[#030712] dark:text-zinc-50 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <CyberBackground />
      <ThemeToggle />

      {/* HEADER */}
      <header className="w-full border-b dark:border-cyan-500/20 border-slate-300 dark:bg-[#030712]/85 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center p-1 rounded-lg border border-cyan-500/30 dark:bg-black/40 bg-slate-100 group-hover:border-cyan-400 transition-colors">
              <Image
                src="/logo_white.png"
                alt="ROBOCEK logo"
                width={32}
                height={32}
                className="hidden dark:block select-none"
                style={{ width: "auto", height: "auto" }}
                priority
              />
              <Image
                src="/logo_black.png"
                alt="ROBOCEK logo"
                width={32}
                height={32}
                className="block dark:hidden select-none"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-[0.25em] uppercase font-[family-name:var(--font-cyber)] text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 dark:from-cyan-400 dark:via-purple-300 dark:to-cyan-200">
                ROBOCEK
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                CADET INDUCTION // 2026
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono uppercase tracking-[0.14em]">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border dark:border-zinc-800 border-zinc-300 text-zinc-600 dark:text-zinc-400 hover:text-cyan-400 px-4 py-2 transition"
            >
              Member Login
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full flex flex-col items-center py-10 sm:py-16 z-10 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border dark:border-cyan-500/40 dark:bg-cyan-950/30 border-cyan-700/30 bg-cyan-50 px-3.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              MEMBERSHIP REGISTRATION
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-cyber)] dark:text-white text-zinc-900">
              Join ROBOCEK Cadre
            </h1>
            <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-600 max-w-md mx-auto leading-relaxed">
              Register your interest to join Government College of Engineering Kannur&apos;s robotics and autonomous systems squads.
            </p>
          </div>

          {/* Registration Form */}
          <TiltCard
            glowColor="purple"
            className="dark:bg-zinc-950/80 bg-white p-6 sm:p-10 dark:border-zinc-800 border-zinc-200"
          >
            {/* Email Requirement Notice */}
            <div className="mb-6 p-3 rounded-xl dark:bg-cyan-950/30 bg-cyan-50 border dark:border-cyan-500/30 border-cyan-200 flex items-center gap-2 text-xs font-mono dark:text-cyan-300 text-cyan-800">
              <UiIcon name="info" className="h-4 w-4 shrink-0 text-cyan-500" />
              <span>Any valid college or personal email address is accepted.</span>
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
              {isPendingApproval ? (
                <div className="rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 text-sm text-zinc-800 dark:text-zinc-200">
                  <p className="font-semibold">Registration pending approval</p>
                  <p className="text-xs mt-2">Your account is waiting for an administrator to approve it. You can refresh the status below to check for updates.</p>
                  {membershipIdState ? (
                    <p className="mt-2 text-sm">Membership ID: <span className="font-mono">{membershipIdState}</span></p>
                  ) : null}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={checkApprovalStatus}
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium"
                    >
                      Refresh status
                    </button>
                    <Link
                      href="/login"
                      className="text-xs underline text-zinc-700 dark:text-zinc-300"
                    >
                      Go to Login
                    </Link>
                  </div>
                </div>
              ) : null}
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-11 w-full rounded-xl border
                        dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                        border-zinc-300 bg-white text-black placeholder:text-zinc-500
                        pl-4 pr-10 text-sm focus:outline-none focus:ring-2
                        dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                        focus:ring-zinc-600 focus:border-zinc-600
                        transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 select-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="text-[0.65rem] dark:text-zinc-500 text-zinc-600">
                    Minimum 6 characters
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="h-11 w-full rounded-xl border
                        dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                        border-zinc-300 bg-white text-black placeholder:text-zinc-500
                        pl-4 pr-10 text-sm focus:outline-none focus:ring-2
                        dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                        focus:ring-zinc-600 focus:border-zinc-600
                        transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 select-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="text-[0.65rem] dark:text-zinc-500 text-zinc-600">
                    Re-enter your password
                  </p>
                </div>
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
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="h-11 rounded-xl border
                    dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                    border-zinc-300 bg-white text-black placeholder:text-zinc-500
                    px-4 text-sm focus:outline-none focus:ring-2
                    dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                    focus:ring-zinc-600 focus:border-zinc-600
                    transition"
                />
              </div>
              {/* Branch and Batch Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={branch}
                    onChange={(event) => setBranch(event.target.value)}
                    className="h-11 rounded-xl border
                      dark:border-zinc-800 dark:bg-black dark:text-zinc-100
                      border-zinc-300 bg-white text-black
                      px-4 text-sm focus:outline-none focus:ring-2
                      dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                      focus:ring-zinc-600 focus:border-zinc-600
                      transition cursor-pointer"
                  >
                    <option value="" disabled>Select Branch</option>
                    <option value="CS">CS</option>
                    <option value="CE">CE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                    Batch <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={yearSemester}
                    onChange={(event) => setYearSemester(event.target.value)}
                    className="h-11 rounded-xl border
                      dark:border-zinc-800 dark:bg-black dark:text-zinc-100
                      border-zinc-300 bg-white text-black
                      px-4 text-sm focus:outline-none focus:ring-2
                      dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                      focus:ring-zinc-600 focus:border-zinc-600
                      transition cursor-pointer"
                  >
                    <option value="" disabled>Select Batch</option>
                    {batchOptions.map((batchYr) => (
                      <option key={batchYr} value={batchYr}>
                        {batchYr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Areas of Interest */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] uppercase tracking-[0.18em] dark:text-zinc-400 text-zinc-700 font-medium">
                  Areas of Interest <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {interestOptions.map((interest) => (
                    <label
                      key={interest}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedInterests.includes(interest)}
                        onChange={() => toggleInterest(interest)}
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
                  value={comments}
                  onChange={(event) => setComments(event.target.value)}
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
              <div className="pt-4 font-mono">
                <button
                  type="submit"
                  disabled={isSubmitting || isPendingApproval}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-600 px-6 py-3.5 text-xs font-mono font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPendingApproval ? "Pending Approval..." : isSubmitting ? "Registering Cadre..." : "Complete Registration [ → ]"}
                </button>
              </div>
            </form>

            {/* Important Notice */}
            <div className="mt-8 pt-6 border-t dark:border-zinc-800 border-zinc-200">
              <div className="rounded-xl dark:bg-zinc-900/40 bg-slate-100 p-4 border dark:border-zinc-800 border-zinc-200 font-sans text-xs">
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-500 font-semibold mb-2">
                  <UiIcon name="bolt" className="mr-1 inline h-4 w-4 align-text-bottom text-cyan-400" />
                  Cadet Dispatch Instructions
                </p>
                <p className="dark:text-zinc-300 text-zinc-700 leading-relaxed">
                  After submitting this form, dispatch a confirmation email to{" "}
                  <a
                    href="mailto:robocek@gcek.ac.in"
                    className="font-semibold text-cyan-500 dark:text-cyan-400 hover:underline"
                  >
                    robocek@gcek.ac.in
                  </a>{" "}
                  mentioning your name and branch in the email subject line for rapid registration verification.
                </p>
              </div>
            </div>
          </TiltCard>

          {/* Back to Home Link */}
          <div className="mt-8 text-center font-mono text-xs">
            <Link
              href="/"
              className="text-zinc-500 hover:text-cyan-400 transition uppercase tracking-[0.18em]"
            >
              ← Return to Main Terminal
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-[#02050c] bg-white py-6 mt-auto z-10 font-mono text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <p>© {new Date().getFullYear()} ROBOCEK GCEK // AUTONOMOUS ROBOTICS CLUB</p>
          <div className="flex items-center gap-4 uppercase tracking-widest text-[10px]">
            <Link href="/" className="hover:text-cyan-400 transition">
              Home
            </Link>
            <Link href="/execom" className="hover:text-cyan-400 transition">
              ExeCom
            </Link>
            <Link href="/events" className="hover:text-cyan-400 transition">
              Events
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

