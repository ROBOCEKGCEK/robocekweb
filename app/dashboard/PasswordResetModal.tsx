"use client";

import { FormEvent, useState } from "react";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/client";

interface PasswordResetModalProps {
  onSuccess: () => void;
}

export default function PasswordResetModal({ onSuccess }: PasswordResetModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setErrorMessage("No active session found. Please try signing in again.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update password in Firebase Auth
      await updatePassword(currentUser, newPassword);

      // 2. Update Firestore user document: clear mustChangePassword flag
      if (db) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          mustChangePassword: false,
          updatedAt: new Date().toISOString(),
        });
      }

      setStatusMessage("✓ Password updated successfully! Redirecting...");
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not update password.";
      if (msg.includes("requires-recent-login")) {
        setErrorMessage("For security reasons, please sign out and sign in again before changing your password.");
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-emerald-500/40 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[0.65rem] uppercase tracking-[0.2em] font-mono text-emerald-400 font-medium mb-3">
            First-Time Security Setup
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Set Your New Password
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Your account was initialized by an administrator. Please set a personal password to activate your ROBOCEK membership.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          {errorMessage ? (
            <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-300">
              {errorMessage}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
              {statusMessage}
            </div>
          ) : null}

          <div className="space-y-1 text-left">
            <label className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-400 font-medium">
              New Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-11 rounded-xl border border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-600 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-400 font-medium">
              Confirm New Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 rounded-xl border border-zinc-800 bg-black text-zinc-100 placeholder:text-zinc-600 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 inline-flex items-center justify-center rounded-full bg-emerald-400 hover:bg-emerald-300 text-black px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] transition shadow-lg shadow-emerald-950/50 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Updating Password..." : "Save Password & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
