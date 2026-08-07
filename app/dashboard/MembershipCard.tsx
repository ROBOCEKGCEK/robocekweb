"use client";

import React, { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import Image from "next/image";

export interface MembershipCardProps {
  fullName: string;
  membershipId?: string | null;
  branch?: string | null;
  yearSemester?: string | null;
  batch?: string | null;
  email?: string | null;
}

export default function MembershipCard({
  fullName,
  membershipId,
  branch,
  yearSemester,
  batch,
  email,
}: MembershipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  // Fallbacks for display
  const displayName = fullName?.trim() || "ROBOCEK MEMBER";
  const displayId = membershipId?.trim() || "RC-2026-PENDING";
  const displayBranch = branch?.trim() || "Robotics & Automation";
  const displayBatch = batch?.trim() || yearSemester?.trim() || "Batch 2023-2027";
  const displayEmail = email?.trim() || "member@robocek.org";

  // Generate functional QR Code on load/data update
  useEffect(() => {
    const qrPayload = `ROBOCEK OFFICIAL MEMBER CARD
---------------------------
Name: ${displayName}
Membership ID: ${displayId}
Branch: ${displayBranch}
Batch: ${displayBatch}
Email: ${displayEmail}
Status: VERIFIED MEMBER`;

    QRCode.toDataURL(qrPayload, {
      width: 250,
      margin: 1,
      color: {
        dark: "#00ff88",
        light: "#050806",
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [displayName, displayId, displayBranch, displayBatch, displayEmail]);

  const handleCopyId = () => {
    if (navigator.clipboard && displayId) {
      navigator.clipboard.writeText(displayId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateImage = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    return await toPng(cardRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#050806",
      quality: 0.98,
    });
  };

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) throw new Error("Could not capture card image");

      // Standard CR80 ID Card dimensions: 85.6mm x 53.98mm landscape
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, 85.6, 53.98);
      const safeName = displayName.replace(/[^a-zA-Z0-9]/g, "_");
      pdf.save(`ROBOCEK_MembershipCard_${safeName}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPNG = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) throw new Error("Could not capture card image");

      const link = document.createElement("a");
      const safeName = displayName.replace(/[^a-zA-Z0-9]/g, "_");
      link.download = `ROBOCEK_MembershipCard_${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG generation error:", err);
      alert("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 items-center w-full max-w-2xl mx-auto my-2 sm:my-4">
      {/* RESPONSIVE SCROLL CONTAINER FOR MOBILE SAFEGUARD */}
      <div className="relative group w-full flex justify-center overflow-x-auto py-1 scrollbar-none">
        {/* Glow backdrop behind card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-600/30 via-green-500/20 to-emerald-800/40 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

        {/* PHYSICAL ID CARD (CR80 Ratio 85.6 : 53.98 approx 1.586) */}
        <div
          ref={cardRef}
          style={{
            backgroundColor: "#050806",
            borderColor: "rgba(16, 185, 129, 0.4)",
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(5, 150, 105, 0.15) 0%, transparent 45%),
              linear-gradient(135deg, rgba(12, 22, 16, 0.95) 0%, rgba(3, 7, 4, 1) 100%)
            `,
          }}
          className="relative w-full min-w-[300px] max-w-[560px] aspect-[1.586/1] rounded-xl sm:rounded-2xl border p-3.5 sm:p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden select-none"
        >
          {/* Cybernetic Circuit Grid Background Overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,255,136,0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,255,136,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Accent Corner Lines */}
          <div
            className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-2xl pointer-events-none"
            style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 rounded-full blur-xl pointer-events-none"
            style={{ backgroundColor: "rgba(5, 150, 105, 0.15)" }}
          />

          {/* Glowing Top Emerald Stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-[2.5px] sm:h-[3px]"
            style={{
              background: "linear-gradient(to right, #059669, #34d399, #15803d)",
              boxShadow: "0 0 12px #10b981",
            }}
          />

          {/* 1. HEADER ROW */}
          <div
            className="relative z-10 flex items-center justify-between gap-1.5 border-b pb-1.5 sm:pb-3"
            style={{ borderColor: "rgba(16, 185, 129, 0.2)" }}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {/* ROBOCEK Official White Logo */}
              <div className="relative flex items-center justify-center shrink-0">
                <Image
                  src="/logo_white.png"
                  alt="ROBOCEK Logo"
                  width={42}
                  height={42}
                  className="h-7 sm:h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h3
                  className="font-extrabold tracking-wider text-xs sm:text-lg uppercase drop-shadow leading-tight truncate"
                  style={{
                    background: "linear-gradient(to right, #6ee7b7, #ecfdf5, #ffffff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ROBOCEK
                </h3>
                <p
                  className="text-[7.5px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.25em] font-mono uppercase truncate"
                  style={{ color: "#34d399" }}
                >
                  Robotics & Automation
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-end">
                <span
                  className="text-[6.5px] sm:text-[8px] font-mono tracking-widest uppercase"
                  style={{ color: "rgba(52, 211, 153, 0.8)" }}
                >
                  STATUS
                </span>
                <span
                  className="text-[8.5px] sm:text-[10px] font-semibold tracking-wider flex items-center gap-1"
                  style={{ color: "#6ee7b7" }}
                >
                  <span
                    className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full"
                    style={{ backgroundColor: "#34d399" }}
                  ></span>
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* 2. MAIN BODY ROW (Member Details) */}
          <div className="relative z-10 my-auto py-1 sm:py-2 grid grid-cols-[1fr_auto] gap-2 sm:gap-4 items-center">
            <div className="space-y-1.5 sm:space-y-2.5 min-w-0">
              {/* Member Full Name */}
              <div>
                <p
                  className="text-[6.5px] sm:text-[8.5px] uppercase tracking-[0.18em] font-mono"
                  style={{ color: "rgba(52, 211, 153, 0.8)" }}
                >
                  MEMBER NAME
                </p>
                <h2 className="text-xs sm:text-lg font-bold tracking-tight text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate max-w-[200px] sm:max-w-[340px]">
                  {displayName}
                </h2>
              </div>

              {/* Membership ID - FULLY VISIBLE ALWAYS */}
              <div>
                <p
                  className="text-[6.5px] sm:text-[8.5px] uppercase tracking-wider font-mono"
                  style={{ color: "rgba(52, 211, 153, 0.8)" }}
                >
                  MEMBERSHIP ID
                </p>
                <p
                  className="text-[10px] sm:text-sm font-mono font-extrabold tracking-widest text-emerald-300 whitespace-nowrap overflow-visible"
                  style={{ color: "#6ee7b7" }}
                >
                  {displayId}
                </p>
              </div>

              {/* Branch & Batch Row */}
              <div className="flex items-center gap-4 sm:gap-8 text-left">
                {/* Branch */}
                <div>
                  <p
                    className="text-[6.5px] sm:text-[8.5px] uppercase tracking-wider font-mono"
                    style={{ color: "rgba(52, 211, 153, 0.7)" }}
                  >
                    BRANCH
                  </p>
                  <p className="text-[9px] sm:text-[11px] font-semibold text-zinc-100 uppercase">
                    {displayBranch}
                  </p>
                </div>

                {/* Batch */}
                <div>
                  <p
                    className="text-[6.5px] sm:text-[8.5px] uppercase tracking-wider font-mono"
                    style={{ color: "rgba(52, 211, 153, 0.7)" }}
                  >
                    BATCH
                  </p>
                  <p className="text-[9px] sm:text-[11px] font-semibold text-zinc-100 uppercase">
                    {displayBatch}
                  </p>
                </div>
              </div>
            </div>

            {/* DYNAMIC FUNCTIONAL QR CODE */}
            <div
              className="flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-lg sm:rounded-xl border shadow-inner shrink-0"
              style={{
                backgroundColor: "#050806",
                borderColor: "rgba(16, 185, 129, 0.35)",
              }}
            >
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Scannable Verification QR Code"
                  className="w-12 h-12 sm:w-20 sm:h-20 rounded object-contain"
                />
              ) : (
                <div className="w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center text-[7px] font-mono text-emerald-400">
                  Loading...
                </div>
              )}
              <span
                className="mt-0.5 text-[6px] sm:text-[7px] font-mono tracking-tighter"
                style={{ color: "rgba(52, 211, 153, 0.9)" }}
              >
                SCAN TO VERIFY
              </span>
            </div>
          </div>

          {/* 3. FOOTER ROW */}
          <div
            className="relative z-10 flex items-end justify-between border-t pt-1 sm:pt-2 text-[7px] sm:text-[9px] font-mono"
            style={{
              borderColor: "rgba(16, 185, 129, 0.2)",
              color: "rgba(52, 211, 153, 0.8)",
            }}
          >
            <div className="min-w-0">
              <p className="truncate max-w-[150px] sm:max-w-[240px] text-zinc-400 text-[6.5px] sm:text-[9px]">{displayEmail}</p>
              <p
                className="text-[6px] sm:text-[7px] tracking-widest uppercase truncate"
                style={{ color: "#10b981" }}
              >
                ROBOCEK ADMIN CORE
              </p>
            </div>

            {/* Holographic Seal graphic */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full border font-bold text-[6.5px] sm:text-[8px] shadow-sm shrink-0"
              style={{
                borderColor: "rgba(52, 211, 153, 0.4)",
                background: "linear-gradient(to right, #022c22, #064e3b, #000000)",
                color: "#6ee7b7",
              }}
            >
              <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3" style={{ color: "#34d399" }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>OFFICIAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full max-w-[560px]">
        {/* DOWNLOAD PDF */}
        <button
          type="button"
          onClick={downloadPDF}
          disabled={isExporting}
          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs py-2.5 sm:py-3 px-3 sm:px-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isExporting ? "Generating PDF..." : "Download Card (PDF)"}
        </button>

        {/* DOWNLOAD PNG */}
        <button
          type="button"
          onClick={downloadPNG}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-zinc-950 hover:bg-emerald-950/60 text-emerald-300 font-semibold text-xs py-2.5 sm:py-3 px-3.5 sm:px-4 transition active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          PNG
        </button>

        {/* COPY ID */}
        <button
          type="button"
          onClick={handleCopyId}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs py-2.5 sm:py-3 px-3.5 sm:px-4 transition active:scale-[0.98] uppercase tracking-wider cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? "Copied!" : "Copy ID"}
        </button>
      </div>
    </div>
  );
}
