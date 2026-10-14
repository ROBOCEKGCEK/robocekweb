"use client";

import Image from "next/image";
import ThemeToggle from "../ThemeToggle";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import UiIcon from "../components/UiIcon";
import TiltCard from "../components/TiltCard";
import CyberBackground from "../components/CyberBackground";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase/client";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
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
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!auth || !db) {
      setErrorMessage("Firebase authentication is not configured.");
      return;
    }

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setErrorMessage("Please enter your Email or Membership ID in the input box above, then click 'Forgot password?'.");
      return;
    }

    setIsSendingReset(true);
    try {
      let emailToUse = trimmedIdentifier;

      // Resolve Membership ID to Email if needed
      if (!trimmedIdentifier.includes("@")) {
        const userQuery = query(
          collection(db, "users"),
          where("membershipId", "==", trimmedIdentifier)
        );
        const snapshot = await getDocs(userQuery);

        if (snapshot.empty) {
          setErrorMessage("No registered member account was found with that Membership ID.");
          setIsSendingReset(false);
          return;
        }

        emailToUse = snapshot.docs[0].data().email as string;
      }

      await sendPasswordResetEmail(auth, emailToUse);
      setStatusMessage(
        `Password reset link sent to ${emailToUse}! Please check your email inbox (and spam folder).`
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to send password reset email.";
      if (msg.includes("auth/user-not-found")) {
        setErrorMessage("No registered account found with that email address.");
      } else if (msg.includes("auth/invalid-email")) {
        setErrorMessage("Please enter a valid email address.");
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!auth || !db) {
      setErrorMessage("Firebase authentication is not configured. Please check environment variables.");
      return;
    }

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
      let userDocSnap = null;

      // 1. Resolve identifier to email and find Firestore document
      if (!trimmedIdentifier.includes("@")) {
        const userQuery = query(
          collection(db, "users"),
          where("membershipId", "==", trimmedIdentifier),
        );
        const snapshot = await getDocs(userQuery);

        if (snapshot.empty) {
          setErrorMessage("No account matched that Membership ID.");
          setIsSubmitting(false);
          return;
        }

        userDocSnap = snapshot.docs[0];
        emailToUse = userDocSnap.data().email as string;
      } else {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", trimmedIdentifier),
        );
        const snapshot = await getDocs(userQuery);
        if (!snapshot.empty) {
          userDocSnap = snapshot.docs[0];
        } else {
          // Fallback: Case-insensitive email search across Firestore users
          const allSnap = await getDocs(collection(db, "users"));
          const match = allSnap.docs.find(
            (d) => (d.data().email || "").toString().trim().toLowerCase() === trimmedIdentifier.toLowerCase()
          );
          if (match) {
            userDocSnap = match;
            emailToUse = (match.data().email as string) || trimmedIdentifier;
          }
        }
      }

      // 2. Try standard Firebase Auth Sign-in
      try {
        const cred = await signInWithEmailAndPassword(auth, emailToUse, trimmedPassword);

        // Check if member profile document was deleted by admin
        if (cred.user) {
          const profileSnap = await getDoc(doc(db, "users", cred.user.uid));
          if (!profileSnap.exists() && !userDocSnap) {
            await signOut(auth);
            setErrorMessage("Your member account has been deleted by an administrator. Please contact robocek@gcek.ac.in for assistance.");
            setIsSubmitting(false);
            return;
          }
          // Block access until admin approves the user
          if (profileSnap.exists()) {
            const st = (profileSnap.data().status || "").toString().toLowerCase();
            if (st !== "approved") {
              await signOut(auth);
              setErrorMessage("Your account is pending admin approval. Please wait for confirmation or contact robocek@gcek.ac.in.");
              setIsSubmitting(false);
              return;
            }
          }
        }
      } catch (authErr: unknown) {
        const errCode = (authErr as { code?: string })?.code || "";
        const errStr = authErr instanceof Error ? authErr.message : "";
        const isUserNotFound =
          errCode === "auth/user-not-found" ||
          errCode === "auth/invalid-credential" ||
          errStr.includes("auth/user-not-found") ||
          errStr.includes("auth/invalid-credential");

        // 3. If member document exists in Firestore (e.g. uploaded via Excel or approved by Admin)
        if (userDocSnap && isUserNotFound) {
          const expectedDefaultPass = userDocSnap.data().defaultPassword || "Robocek@2026";
          
          // Verify provided password matches the default password
          if (trimmedPassword === expectedDefaultPass || trimmedPassword === "Robocek@2026") {
            try {
              // Auto-provision their Firebase Auth user account on the fly!
              const newCred = await createUserWithEmailAndPassword(auth, emailToUse, trimmedPassword);
              
              if (newCred.user) {
                const oldDocRef = doc(db, "users", userDocSnap.id);
                const newDocRef = doc(db, "users", newCred.user.uid);
                
                // Move document to new Auth UID
                await setDoc(newDocRef, {
                  ...userDocSnap.data(),
                  uid: newCred.user.uid,
                  mustChangePassword: true,
                });

                if (userDocSnap.id !== newCred.user.uid) {
                  await deleteDoc(oldDocRef);
                }
              }
            } catch (createErr: unknown) {
              const createCode = (createErr as { code?: string })?.code || "";
              if (createCode === "auth/email-already-in-use") {
                setErrorMessage("Incorrect password. If you forgot your password, please click 'Forgot password?' below to reset it.");
                return;
              }
              throw createErr;
            }
          } else {
            setErrorMessage("Incorrect password. For first-time login, use default password: Robocek@2026");
            return;
          }
        } else {
          setErrorMessage(
            errCode === "auth/invalid-credential" || errStr.includes("invalid-credential")
              ? "Invalid email or password. If logging in for the first time, use default password: Robocek@2026"
              : errStr || "Sign in failed."
          );
          return;
        }
      }

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
                SECURITY // AUTH PORTAL
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono uppercase tracking-[0.14em]">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-[0.16em] text-black shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition"
            >
              Join ROBOCEK
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full flex flex-col items-center justify-center py-12 sm:py-20 z-10 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border dark:border-cyan-500/40 dark:bg-cyan-950/30 border-cyan-700/30 bg-cyan-50 px-3.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AUTHENTICATION PROTOCOL
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[family-name:var(--font-cyber)] dark:text-white text-zinc-900">
              Member Sign In
            </h1>
            <p className="text-xs sm:text-sm dark:text-zinc-400 text-zinc-600">
              Enter your credentials to access the ROBOCEK internal network
            </p>
          </div>

          {/* Login Form Container */}
          <TiltCard
            glowColor="cyan"
            className="dark:bg-zinc-950/80 bg-white p-6 sm:p-8 dark:border-zinc-800 border-zinc-200"
          >
            {/* Notice */}
            <div className="mb-6 p-3 rounded-xl dark:bg-cyan-950/30 bg-cyan-50 border dark:border-cyan-500/30 border-cyan-200 flex items-center gap-2 text-xs font-mono dark:text-cyan-300 text-cyan-800">
              <UiIcon name="info" className="h-4 w-4 shrink-0 text-cyan-500" />
              <span>Enter either your email or Membership ID.</span>
            </div>

            <form className="space-y-5 font-mono text-xs" onSubmit={handleSubmit}>
              {errorMessage ? (
                <div className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs text-red-400 font-mono">
                  [ERROR]: {errorMessage}
                </div>
              ) : null}
              {statusMessage ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-400 font-mono">
                  [SUCCESS]: {statusMessage}
                </div>
              ) : null}

              {/* Email or Membership ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-bold">
                  Email or Membership ID *
                </label>
                <input
                  type="text"
                  placeholder="you@email.com or ROBOCEK-2024-001"
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="h-11 rounded-xl border dark:border-zinc-800 dark:bg-black/60 dark:text-zinc-100 dark:placeholder:text-zinc-600 border-zinc-300 bg-white text-black placeholder:text-zinc-400 px-4 text-xs focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-bold">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 rounded-xl border dark:border-zinc-800 dark:bg-black/60 dark:text-zinc-100 dark:placeholder:text-zinc-600 border-zinc-300 bg-white text-black placeholder:text-zinc-400 px-4 text-xs focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="w-4 h-4 rounded border dark:border-zinc-800 dark:bg-black border-zinc-300 accent-cyan-500 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSendingReset}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition cursor-pointer disabled:opacity-50"
                >
                  {isSendingReset ? "Sending reset..." : "Forgot password?"}
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-600 px-6 py-3.5 text-xs font-mono font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:scale-[1.01] cursor-pointer"
                >
                  {isSubmitting ? "Authenticating..." : "Sign In // Access Lab"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px dark:bg-zinc-800 bg-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs font-mono">
                <span className="dark:bg-zinc-950 bg-white dark:text-zinc-600 text-zinc-400 px-3 uppercase tracking-widest text-[10px]">
                  Cadet Notice
                </span>
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-xl dark:bg-zinc-900/40 bg-slate-100 p-4 border dark:border-zinc-800 border-zinc-200 font-sans text-xs dark:text-zinc-400 text-zinc-600 leading-relaxed">
              First time here? Please{" "}
              <Link href="/register" className="font-semibold dark:text-cyan-300 text-cyan-700 hover:underline">
                register your interest
              </Link>{" "}
              or contact{" "}
              <a href="mailto:robocek@gcek.ac.in" className="font-semibold dark:text-cyan-300 text-cyan-700 hover:underline">
                robocek@gcek.ac.in
              </a>{" "}
              to obtain your membership telemetry credentials.
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

