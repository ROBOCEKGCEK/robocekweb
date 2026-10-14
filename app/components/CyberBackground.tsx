"use client";

import React from "react";

export default function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient Radial Energy Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[120px]" />
      <div className="absolute top-1/4 -right-40 w-[550px] h-[550px] rounded-full bg-purple-600/10 dark:bg-purple-600/15 blur-[130px]" />
      <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px]" />

      {/* Cybernetic Blueprint Grid (Subtle) */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* High-Tech Scanlines (Very subtle) */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            currentColor 2px,
            currentColor 3px
          )`,
        }}
      />
    </div>
  );
}
