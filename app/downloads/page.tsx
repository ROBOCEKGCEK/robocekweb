"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import UiIcon from "../components/UiIcon";
import CyberBackground from "../components/CyberBackground";
import TiltCard from "../components/TiltCard";

type OSPlatform = "windows" | "mac" | "linux" | "cli";

export default function DownloadsPage() {
  const [detectedOS, setDetectedOS] = useState<OSPlatform>("windows");
  const [activeTab, setActiveTab] = useState<OSPlatform>("windows");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      let targetOS: OSPlatform = "windows";
      if (userAgent.includes("mac")) {
        targetOS = "mac";
      } else if (userAgent.includes("linux")) {
        targetOS = "linux";
      }
      setTimeout(() => {
        setDetectedOS(targetOS);
        setActiveTab(targetOS);
      }, 0);
    }
  }, []);

  const handleCopyCLI = () => {
    navigator.clipboard.writeText("pip install robocek-cli");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getOSLabel = (os: OSPlatform) => {
    switch (os) {
      case "windows":
        return "Windows";
      case "mac":
        return "macOS";
      case "linux":
        return "Linux";
      case "cli":
        return "ROBOCEK CLI";
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-[#030712] text-zinc-100 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200"
      id="top"
    >
      <CyberBackground />
      <ThemeToggle />

      {/* FUTURISTIC HUD NAVIGATION HEADER */}
      <header className="w-full border-b border-cyan-500/20 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition">
              <Image
                src="/logo_white.png"
                alt="ROBOCEK"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-extrabold text-base tracking-[0.2em] bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  ROBOCEK
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-400 bg-cyan-950/40">
                  v0.2.1
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                GCE KANNUR ROBOTICS
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link
              href="/events"
              className="px-3 sm:px-4 py-1.5 rounded-full border border-zinc-800 hover:border-cyan-500/40 text-zinc-400 hover:text-cyan-300 bg-zinc-950/60 hover:bg-cyan-950/20 text-[11px] font-mono tracking-wider transition"
            >
              [01] Events
            </Link>
            <Link
              href="/projects"
              className="px-3 sm:px-4 py-1.5 rounded-full border border-zinc-800 hover:border-cyan-500/40 text-zinc-400 hover:text-cyan-300 bg-zinc-950/60 hover:bg-cyan-950/20 text-[11px] font-mono tracking-wider transition"
            >
              [02] Projects
            </Link>
            <Link
              href="/execom"
              className="px-3 sm:px-4 py-1.5 rounded-full border border-zinc-800 hover:border-purple-500/40 text-zinc-400 hover:text-purple-300 bg-zinc-950/60 hover:bg-purple-950/20 text-[11px] font-mono tracking-wider transition"
            >
              [03] ExeCom
            </Link>
            <Link
              href="/downloads"
              className="px-3 sm:px-4 py-1.5 rounded-full border border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)] text-[11px] font-mono tracking-wider transition font-semibold"
            >
              [04] Downloads
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-orbitron font-bold text-[11px] tracking-wider uppercase transition shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              Access Portal
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full flex flex-col items-center relative z-10">
        {/* HERO */}
        <section className="w-full max-w-7xl px-4 sm:px-8 lg:px-12 pt-10 pb-12 sm:pt-16 sm:pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
              {/* Telemetry Pill */}
              <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 px-3.5 py-1 text-xs font-mono tracking-wider uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  SYS.BINARIES // VER: v0.2.1 STABLE
                </span>
                <span className="text-xs font-mono text-zinc-400 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/50">
                  Target Host: <strong className="text-cyan-400">{getOSLabel(detectedOS)}</strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-orbitron font-extrabold tracking-tight leading-tight">
                <span className="block text-zinc-400 text-sm sm:text-base font-mono tracking-[0.3em] uppercase mb-2">
                  Integrated Firmware Environment
                </span>
                <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                  ROBOCEK Studio
                </span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
                Unified desktop suite built specifically for robotics engineers at GCEK: micro-controller flashing, real-time serial telemetry streams, and embedded C/C++ firmware toolchains.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="https://github.com/HarikeshopGCEK/robocek-platform/releases/tag/v0.2.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-cyan-500/50 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 px-6 py-3 text-xs font-mono font-semibold uppercase tracking-wider transition gap-2.5 shadow-[0_0_15px_rgba(0,240,255,0.15)] group"
                >
                  <svg className="w-4 h-4 fill-current group-hover:scale-110 transition" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub Release Assets ↗
                </a>
              </div>
            </div>

            {/* Included tools TiltCard */}
            <div className="w-full max-w-md">
              <TiltCard className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-zinc-950/90 to-[#030712]/90 p-6 sm:p-7 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-black text-[9px] font-orbitron font-extrabold tracking-widest uppercase shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  TAURI v2 NATIVE
                </div>

                <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-4 mb-4">
                  <span className="font-semibold text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Built-in Modules
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    LOW LATENCY ENGINE
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs text-zinc-300 font-sans">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                      <UiIcon name="check" className="h-3.5 w-3.5" />
                    </div>
                    <span>
                      <strong className="text-white font-mono text-[11px] block text-cyan-300">
                        Integrated Monaco IDE:
                      </strong>
                      Syntax highlighting, auto-complete &amp; linting for C++, Python, and Rust firmware.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                      <UiIcon name="check" className="h-3.5 w-3.5" />
                    </div>
                    <span>
                      <strong className="text-white font-mono text-[11px] block text-cyan-300">
                        ROBOCEK CLI Flasher:
                      </strong>
                      One-click binary burn for ESP32, STM32, RP2040, and Arduino Nano.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                      <UiIcon name="check" className="h-3.5 w-3.5" />
                    </div>
                    <span>
                      <strong className="text-white font-mono text-[11px] block text-cyan-300">
                        High-Speed Serial Monitor:
                      </strong>
                      Real-time CSV telemetry plotting, baud-rate auto-negotiation, and log export.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                      <UiIcon name="check" className="h-3.5 w-3.5" />
                    </div>
                    <span>
                      <strong className="text-white font-mono text-[11px] block text-cyan-300">
                        Cross-Architecture Builds:
                      </strong>
                      Fast native packages engineered for Windows 64-bit, macOS, and Linux.
                    </span>
                  </li>
                </ul>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* OS DOWNLOAD TABS & CARDS */}
        <section className="w-full max-w-7xl px-4 sm:px-8 lg:px-12 py-8">
          <div className="flex flex-col items-center">
            {/* Tab Controls */}
            <div className="flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-md mb-8 max-w-2xl w-full shadow-[0_0_20px_rgba(0,240,255,0.08)]">
              {(["windows", "mac", "linux", "cli"] as OSPlatform[]).map((os) => (
                <button
                  key={os}
                  onClick={() => setActiveTab(os)}
                  className={`flex-1 min-w-[110px] py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all relative ${
                    activeTab === os
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                      : "text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/20"
                  }`}
                >
                  {getOSLabel(os)}
                  {detectedOS === os && os !== "cli" && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB CONTENT CARDS */}
            <div className="w-full max-w-4xl">
              {/* WINDOWS */}
              {activeTab === "windows" && (
                <div className="rounded-3xl border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-5 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <UiIcon name="monitor" className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-orbitron font-bold text-white">
                          ROBOCEK Studio for Windows
                        </h3>
                        <p className="text-xs font-mono text-zinc-400">
                          Supports Windows 10 &amp; 11 (64-bit Architecture)
                        </p>
                      </div>
                    </div>
                    {detectedOS === "windows" && (
                      <span className="text-[0.65rem] font-mono uppercase tracking-wider font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.3)] self-start sm:self-auto">
                        Recommended for this device
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <TiltCard className="rounded-2xl border border-cyan-500/40 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-cyan-400 transition group shadow-[0_0_20px_rgba(0,240,255,0.08)]">
                      <div>
                        <span className="text-[0.65rem] font-mono uppercase tracking-widest font-bold text-cyan-400 block mb-1">
                          Standard Setup Package
                        </span>
                        <h4 className="text-base font-orbitron font-bold text-white">
                          Executable Installer (.exe)
                        </h4>
                        <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed">
                          NSIS setup package with automatic desktop shortcuts, driver detection &amp; clean uninstaller.
                        </p>
                      </div>
                      <a
                        href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/ROBOCEK.Studio_0.2.0_x64-setup.exe"
                        className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition"
                      >
                        <span>Download .exe (x64)</span>
                        <UiIcon name="download" className="h-4 w-4" />
                      </a>
                    </TiltCard>

                    <TiltCard className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col justify-between hover:border-zinc-700 transition group">
                      <div>
                        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                          Lab / Silent Deployment
                        </span>
                        <h4 className="text-base font-orbitron font-bold text-white">
                          MSI Installer (.msi)
                        </h4>
                        <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed">
                          Standard Windows Installer package for lab computers and multi-user batch installations.
                        </p>
                      </div>
                      <a
                        href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/ROBOCEK.Studio_0.2.0_x64_en-US.msi"
                        className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono font-bold text-zinc-400 group-hover:text-zinc-200 group-hover:translate-x-1 transition"
                      >
                        <span>Download .msi (x64)</span>
                        <UiIcon name="download" className="h-4 w-4" />
                      </a>
                    </TiltCard>
                  </div>
                </div>
              )}

              {/* MACOS */}
              {activeTab === "mac" && (
                <div className="rounded-3xl border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-5 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <UiIcon name="monitor" className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-orbitron font-bold text-white">
                          ROBOCEK Studio for macOS
                        </h3>
                        <p className="text-xs font-mono text-zinc-400">
                          macOS Big Sur 11.0 or later (Apple Silicon M1/M2/M3 &amp; Intel)
                        </p>
                      </div>
                    </div>
                    {detectedOS === "mac" && (
                      <span className="text-[0.65rem] font-mono uppercase tracking-wider font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.3)] self-start sm:self-auto">
                        Recommended for this device
                      </span>
                    )}
                  </div>

                  <TiltCard className="rounded-2xl border border-cyan-500/40 bg-zinc-900/60 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-cyan-400 transition group shadow-[0_0_20px_rgba(0,240,255,0.08)]">
                    <div>
                      <span className="text-[0.65rem] font-mono uppercase tracking-widest font-bold text-cyan-400 block mb-1">
                        Universal Binary
                      </span>
                      <h4 className="text-lg font-orbitron font-bold text-white">
                        macOS Disk Image (.dmg)
                      </h4>
                      <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-lg">
                        Drag-and-drop installer natively optimized for Apple Silicon (M-series ARM64) and Intel x86_64 Mac systems.
                      </p>
                    </div>
                    <a
                      href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/ROBOCEK.Studio_0.2.0_x64.dmg"
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-orbitron font-bold px-6 py-3.5 text-xs uppercase tracking-wider shrink-0 transition shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    >
                      Download .dmg
                    </a>
                  </TiltCard>
                </div>
              )}

              {/* LINUX */}
              {activeTab === "linux" && (
                <div className="rounded-3xl border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-5 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <UiIcon name="terminal" className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-orbitron font-bold text-white">
                          ROBOCEK Studio for Linux
                        </h3>
                        <p className="text-xs font-mono text-zinc-400">
                          Compatible with Ubuntu, Debian, Arch Linux, Fedora &amp; derivatives
                        </p>
                      </div>
                    </div>
                    {detectedOS === "linux" && (
                      <span className="text-[0.65rem] font-mono uppercase tracking-wider font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.3)] self-start sm:self-auto">
                        Recommended for this device
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <TiltCard className="rounded-2xl border border-cyan-500/40 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-cyan-400 transition group shadow-[0_0_20px_rgba(0,240,255,0.08)]">
                      <div>
                        <span className="text-[0.65rem] font-mono uppercase tracking-widest font-bold text-cyan-400 block mb-1">
                          Universal Distro Binary
                        </span>
                        <h4 className="text-base font-orbitron font-bold text-white">
                          AppImage (.AppImage)
                        </h4>
                        <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed">
                          Standalone executable package. Run directly on any modern Linux distribution without installing packages (<code className="text-cyan-400 font-mono">chmod +x</code>).
                        </p>
                      </div>
                      <a
                        href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/robocek-studio_0.2.0_amd64.AppImage"
                        className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition"
                      >
                        <span>Download AppImage</span>
                        <UiIcon name="download" className="h-4 w-4" />
                      </a>
                    </TiltCard>

                    <TiltCard className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col justify-between hover:border-zinc-700 transition group">
                      <div>
                        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                          Debian / Ubuntu Repository
                        </span>
                        <h4 className="text-base font-orbitron font-bold text-white">
                          DEB Package (.deb)
                        </h4>
                        <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed">
                          Native system installer package for Ubuntu, Debian, Linux Mint, and Pop!_OS (<code className="text-zinc-300 font-mono">sudo dpkg -i</code>).
                        </p>
                      </div>
                      <a
                        href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/robocek-studio_0.2.0_amd64.deb"
                        className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono font-bold text-zinc-400 group-hover:text-zinc-200 group-hover:translate-x-1 transition"
                      >
                        <span>Download .deb Package</span>
                        <UiIcon name="download" className="h-4 w-4" />
                      </a>
                    </TiltCard>
                  </div>
                </div>
              )}

              {/* CLI TOOL */}
              {activeTab === "cli" && (
                <div className="rounded-3xl border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <UiIcon name="terminal" className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-orbitron font-bold text-white">
                          ROBOCEK CLI Utility
                        </h3>
                        <p className="text-xs font-mono text-zinc-400">
                          Lightweight command-line tool for headless servers, CI pipelines &amp; fast terminal flashing
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-zinc-300 font-sans">
                      Install the ROBOCEK command-line engine on any machine equipped with Python 3.10 or newer:
                    </p>

                    <div className="relative flex items-center justify-between rounded-xl bg-black border border-cyan-500/30 p-4 font-mono text-xs shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                      <span className="text-cyan-400 flex items-center gap-2">
                        <span className="text-zinc-500">$</span> pip install robocek-cli
                      </span>
                      <button
                        onClick={handleCopyCLI}
                        className="px-3.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-[10px] font-mono tracking-wider text-cyan-300 transition"
                      >
                        {copied ? "COPIED ✓" : "COPY CMD"}
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs space-y-3 font-mono">
                      <p className="font-orbitron font-bold text-cyan-400 text-xs uppercase tracking-wider">
                        Telemetry CLI Commands
                      </p>
                      <ul className="space-y-2 text-[11px] text-zinc-300">
                        <li className="flex items-center gap-2">
                          <code className="text-cyan-300 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                            robocek init &lt;name&gt;
                          </code>
                          <span className="text-zinc-500">— Generate new robotics bot template</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <code className="text-cyan-300 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                            robocek flash
                          </code>
                          <span className="text-zinc-500">— Compile and flash to connected target board</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <code className="text-cyan-300 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                            robocek monitor
                          </code>
                          <span className="text-zinc-500">— Launch real-time serial sensor telemetry</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PREREQUISITES & SYSTEM REQUIREMENTS */}
        <section className="w-full border-t border-cyan-500/20 bg-zinc-950/60 backdrop-blur-md py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid md:grid-cols-2 gap-8">
            <TiltCard className="rounded-3xl border border-zinc-800 bg-[#030712]/80 p-7 space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
              <h3 className="text-base font-orbitron font-bold text-white flex items-center gap-2.5">
                <UiIcon name="monitor" className="h-4 w-4 text-cyan-400" />
                Hardware &amp; Toolchain Prerequisites
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                To compile embedded firmware and communicate via USB-UART bridge with connected microcontrollers:
              </p>
              <ul className="text-xs space-y-2.5 text-zinc-300 font-mono">
                <li className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                  <span>
                    <strong className="text-white">Python 3.10+</strong> (Hardware RPC scripts)
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                  <span>
                    <strong className="text-white">PlatformIO Core</strong> (Cross-compiler for ESP32, STM32, Arduino)
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                  <span>
                    <strong className="text-white">CH340 / CP2102 Drivers</strong> (USB-to-UART serial interface)
                  </span>
                </li>
              </ul>
            </TiltCard>

            <TiltCard className="rounded-3xl border border-zinc-800 bg-[#030712]/80 p-7 space-y-4 shadow-[0_0_20px_rgba(168,85,247,0.05)]">
              <h3 className="text-base font-orbitron font-bold text-white flex items-center gap-2.5">
                <UiIcon name="info" className="h-4 w-4 text-purple-400" />
                Release Notes (Build v0.2.1)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Key updates shipped in ROBOCEK Studio v0.2.1:
              </p>
              <ul className="text-xs space-y-2.5 text-zinc-300 font-sans">
                <li className="flex items-start gap-2.5">
                  <span className="text-purple-400 font-mono">▸</span>
                  <span>Migrated native embedded engine to Tauri v2 for 40% reduced RAM footprint.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-purple-400 font-mono">▸</span>
                  <span>Interactive serial telemetry canvas graphs with real-time PID tuning.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-purple-400 font-mono">▸</span>
                  <span>Automated line follower and robotic arm boilerplate project generators.</span>
                </li>
              </ul>
            </TiltCard>
          </div>
        </section>
      </main>

      {/* FUTURISTIC HUD FOOTER */}
      <footer className="w-full border-t border-cyan-500/20 bg-[#030712]/90 backdrop-blur-xl mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            <p>
              © {new Date().getFullYear()} ROBOCEK · Robotics Club, Government College of Engineering Kannur.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <span className="uppercase tracking-widest text-[10px] text-zinc-600">
              SYS.BUILD // 2026.10
            </span>
            <span className="h-3 w-px bg-zinc-800" />
            <Link href="/" className="hover:text-cyan-400 transition uppercase tracking-wider">
              Home
            </Link>
            <Link href="/execom" className="hover:text-purple-400 transition uppercase tracking-wider">
              ExeCom
            </Link>
            <Link href="/events" className="hover:text-cyan-400 transition uppercase tracking-wider">
              Events
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
