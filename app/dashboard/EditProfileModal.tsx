"use client";

import { FormEvent, useMemo, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/client";
import UiIcon from "../components/UiIcon";

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

      setStatusMessage("Telemetry record updated successfully!");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl border border-cyan-500/40 bg-zinc-950/95 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative my-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.24em] font-mono text-cyan-400">
              SYS.TELEMETRY // MEMBER SETTINGS
            </span>
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold tracking-tight text-white mt-1">
              Update Profile Record
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-white hover:border-cyan-500/40 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
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

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
              Full Name <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 px-4 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 px-4 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>

          {/* Branch & Batch Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
                Branch <span className="text-cyan-400">*</span>
              </label>
              <select
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 px-3.5 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              >
                {branchOptions.map((b) => (
                  <option key={b} value={b} className="bg-zinc-900 text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
                Batch / Year <span className="text-cyan-400">*</span>
              </label>
              <select
                required
                value={yearSemester}
                onChange={(e) => setYearSemester(e.target.value)}
                className="h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 px-3.5 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              >
                {batchOptions.map((batch) => (
                  <option key={batch} value={batch} className="bg-zinc-900 text-white">
                    {batch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interests */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
              Areas of Specialization
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-3 py-1.5 text-xs font-mono transition cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                        : "bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    <UiIcon name={isSelected ? "check" : "plus"} className="mr-1 inline h-3 w-3 align-text-bottom" />
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white hover:border-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-6 py-2.5 text-xs font-orbitron font-bold uppercase tracking-[0.15em] text-black transition shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50"
            >
              {isSaving ? "Syncing..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
