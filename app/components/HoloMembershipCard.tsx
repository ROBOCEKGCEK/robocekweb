"use client";

import React, { useRef, useState } from "react";

export type HoloCardProps = {
  name?: string;
  fullName?: string;
  memberId?: string;
  membershipId?: string | null;
  role?: string;
  branch?: string;
  batch?: string;
  yearSemester?: string;
  email?: string;
};

export default function HoloMembershipCard({
  name,
  fullName,
  memberId,
  membershipId,
  role,
  branch,
  batch,
  yearSemester,
}: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const displayName = fullName || name || "ROBOCEK Engineer";
  const displayId = membershipId || memberId || "RC-2026-0042";
  const displayRole = branch ? `Department: ${branch}` : (role || "Robotics Engineer / ExeCom");
  const displayBatch = yearSemester || batch || "2023 - 2027";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -14;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 14;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`
    );
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div className="w-full max-w-sm mx-auto select-none py-4">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-[1.586/1] rounded-2xl p-6 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-cyan-500/40 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_30px_rgba(6,182,212,0.15)] overflow-hidden cursor-pointer group"
      >
        {/* Holographic Iridescent Glare */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, rgba(0,240,255,0.25), rgba(168,85,247,0.2) 40%, transparent 80%)`,
            opacity: glare.opacity,
            mixBlendMode: "screen",
          }}
        />

        {/* Cyber Holographic Circuit Lines in Background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#00f0ff 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px, 30px 30px",
          }}
        />

        {/* Top Section: Chip + Logo */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Metallic Gold Chip */}
            <div className="w-10 h-7 rounded bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 p-[1px] shadow-sm">
              <div className="w-full h-full bg-amber-950/40 rounded flex flex-col justify-around px-1 py-0.5">
                <div className="h-[1px] bg-amber-400/80 w-full" />
                <div className="h-[1px] bg-amber-400/80 w-3/4" />
                <div className="h-[1px] bg-amber-400/80 w-full" />
              </div>
            </div>
            {/* RFID Contactless Wave */}
            <svg
              className="w-4 h-4 text-cyan-400/80 rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              ROBOCEK // PASS
            </span>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Member ID Code */}
        <div className="relative z-10 font-mono text-xs tracking-[0.25em] text-zinc-400 mb-3">
          {displayId}
        </div>

        {/* Member Name */}
        <div className="relative z-10 mt-auto">
          <p className="text-sm font-semibold tracking-wide text-zinc-100 uppercase group-hover:text-cyan-300 transition-colors">
            {displayName}
          </p>
          <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-zinc-400">
            <span className="text-purple-400">{displayRole}</span>
            <span>{displayBatch}</span>
          </div>
        </div>

        {/* Corner Neon Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-purple-500 pointer-events-none" />
      </div>
    </div>
  );
}
