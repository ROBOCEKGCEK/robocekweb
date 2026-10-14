"use client";

import { FormEvent, useState } from "react";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/client";
import UiIcon from "../components/UiIcon";

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

      setStatusMessage("Password updated successfully! Redirecting...");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-cyan-500/40 bg-zinc-950/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/20 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[0.65rem] uppercase tracking-[0.2em] font-mono text-cyan-400 font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SECURITY ENCLAVE // SETUP
          </span>
          <h2 className="text-2xl sm:text-3xl font-orbitron font-bold tracking-tight text-white">
            Set Your Password
          </h2>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
            Your account credentials were initialized by administrator. Define your personal password to unlock complete ROBOCEK systems access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4 font-mono text-xs">
          {errorMessage ? (
            <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-red-300">
              {errorMessage}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/40 p-3 text-cyan-300">
              <UiIcon name="check" className="mr-1 inline h-4 w-4 align-text-bottom" />
              {statusMessage}
            </div>
          ) : null}

          <div className="space-y-1.5 text-left">
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
              className="w-full h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 placeholder:text-zinc-600 px-4 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>

          <div className="space-y-1.5 text-left">
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
              className="w-full h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 placeholder:text-zinc-600 px-4 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-orbitron font-bold px-6 py-3.5 text-xs uppercase tracking-[0.18em] transition shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Updating..." : "Authorize & Proceed"}
          </button>
        </form>
      </div>
    </div>
  );
}
