"use client";

import { FormEvent, useMemo, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/client";

interface EditProfileModalProps {
  profile: {
    fullName?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string;
    branch?: string;
    yearSemester?: string;
    year?: string;
    interests?: string[];
    membershipId?: string | null;
    status?: string;
  } | null;
  userUid: string;
  onClose: () => void;
  onUpdate: (updated: any) => void;
}

export default function EditProfileModal({ profile, userUid, onClose, onUpdate }: EditProfileModalProps) {
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone || profile?.phoneNumber || "");
  const [branch, setBranch] = useState(profile?.branch || "CS");
  const [yearSemester, setYearSemester] = useState(profile?.yearSemester || profile?.year || "2k26");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile?.interests || []);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const interestOptions = useMemo(
    () => [
      "Robotics & Autonomous Systems",
      "Embedded Systems",
      "Computer Vision",
      "Mechanical Design & Fabrication",
      "Coding & Control",
      "Research & Innovation",
    ],
    []
  );

  const branchOptions = ["CS", "CE", "ECE", "ME", "EEE"];

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
        : [...current, interest]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!db || !userUid) {
      setErrorMessage("Database is not initialized.");
      return;
    }

    const trimmedFullName = fullName.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedFullName) {
      setErrorMessage("Full Name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const userRef = doc(db, "users", userUid);
      const updatedPayload = {
        fullName: trimmedFullName,
        phone: trimmedPhone,
        phoneNumber: trimmedPhone,
        branch: branch,
        yearSemester: yearSemester,
        year: yearSemester,
        interests: selectedInterests,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, updatedPayload);

      if (auth?.currentUser) {
        await updateProfile(auth.currentUser, { displayName: trimmedFullName });
      }

      setStatusMessage("✓ Registration details updated successfully!");
      onUpdate({
        ...profile,
        ...updatedPayload,
      });

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl sm:rounded-3xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl relative my-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Member Profile Settings
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
              Update Registration Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              {errorMessage}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
              {statusMessage}
            </div>
          ) : null}

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400"
            />
          </div>

          {/* Branch & Batch Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
                Branch <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400"
              >
                {branchOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
                Batch / Year <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={yearSemester}
                onChange={(e) => setYearSemester(e.target.value)}
                className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400"
              >
                {batchOptions.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interests */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
              Areas of Interest
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? "dark:bg-emerald-400 bg-black dark:text-black text-white"
                        : "dark:bg-zinc-900 bg-zinc-100 dark:text-zinc-400 text-zinc-600 hover:dark:text-zinc-200 hover:text-black"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-800 dark:hover:border-zinc-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
