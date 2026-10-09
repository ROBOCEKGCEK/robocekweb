"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import UiIcon from "../components/UiIcon";

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
      className="min-h-screen flex flex-col font-sans bg-white text-black dark:bg-black dark:text-zinc-50"
      id="top"
    >
      <ThemeToggle />

      {/* HEADER */}
      <header className="w-full border-b dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-10 lg:px-16 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Image
              src="/logo_white.png"
              alt="ROBOCEK logo"
              width={30}
              height={30}
              className="hidden dark:block select-none"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              src="/logo_black.png"
              alt="ROBOCEK logo"
              width={30}
              height={30}
              className="block dark:hidden select-none"
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase">
              ROBOCEK
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full border
                dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
                border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
                px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-medium uppercase tracking-[0.12em] transition"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border
                dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
                border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
                px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-medium uppercase tracking-[0.12em] transition"
            >
              Project Hub
            </Link>
            <Link
              href="/downloads"
              className="inline-flex items-center justify-center rounded-full border
                border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
                px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] transition"
            >
              Downloads
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition"
            >
              Member Login
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full flex flex-col items-center">
        {/* HERO */}
        <section className="w-full max-w-6xl px-4 sm:px-10 lg:px-16 pt-8 pb-12 sm:pt-14 sm:pb-16 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1 flex flex-col items-center lg:items-start gap-4">
              <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full border dark:border-emerald-500/40 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-600/30 bg-emerald-50 text-emerald-700 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Version v0.2.1
                </span>
                <span className="text-xs dark:text-zinc-400 text-zinc-600">
                  Detected OS: <strong className="dark:text-zinc-200 text-zinc-900">{getOSLabel(detectedOS)}</strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                ROBOCEK Studio
                <span className="block text-xl sm:text-2xl dark:text-zinc-400 text-zinc-600 mt-2 font-normal">
                  Robotics &amp; Embedded Firmware Development Environment
                </span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base dark:text-zinc-400 text-zinc-700 leading-relaxed">
                Desktop tools for GCEK robotics teams: code editing, board flashing, serial monitoring, and ROBOCEK CLI support.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a
                  href="https://github.com/HarikeshopGCEK/robocek-platform/releases/tag/v0.2.1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border
                    dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
                    border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
                    px-6 py-2.5 text-xs font-medium uppercase tracking-[0.16em] transition gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Release files
                </a>
              </div>
            </div>

            {/* Included tools */}
            <div className="w-full max-w-md rounded-3xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-gray-50 p-6 shadow-xl">
              <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-zinc-600 border-b dark:border-zinc-800 border-zinc-200 pb-4 mb-4">
                <span className="font-semibold dark:text-zinc-200 text-zinc-900">Included tools</span>
                <span className="uppercase tracking-widest text-[0.65rem] dark:bg-zinc-800 bg-zinc-200 px-2 py-0.5 rounded dark:text-zinc-300 text-zinc-800">Tauri v2 Native</span>
              </div>
              <ul className="space-y-3 text-xs dark:text-zinc-300 text-zinc-700">
                <li className="flex items-start gap-2.5">
                  <UiIcon name="check" className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span><strong>Integrated Monaco Editor:</strong> Code highlighting &amp; auto-complete for robotics firmware.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <UiIcon name="check" className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span><strong>ROBOCEK CLI Engine:</strong> Flash microcontrollers, run test suites, generate bot templates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <UiIcon name="check" className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span><strong>Serial Monitor:</strong> Live stream sensor data &amp; diagnostic telemetrics.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <UiIcon name="check" className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span><strong>Cross-Platform:</strong> Native builds for Windows, macOS, and Linux.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* OS DOWNLOAD TABS & CARDS */}
        <section className="w-full max-w-6xl px-4 sm:px-10 lg:px-16 py-8">
          <div className="flex flex-col items-center">
            {/* Tab Controls */}
            <div className="flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-gray-100 mb-8 max-w-xl w-full">
              {(["windows", "mac", "linux", "cli"] as OSPlatform[]).map((os) => (
                <button
                  key={os}
                  onClick={() => setActiveTab(os)}
                  className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all relative ${
                    activeTab === os
                      ? "dark:bg-zinc-800 dark:text-white bg-white text-black shadow-md"
                      : "dark:text-zinc-400 text-zinc-600 hover:dark:text-zinc-200 hover:text-black"
                  }`}
                >
                  {getOSLabel(os)}
                  {detectedOS === os && os !== "cli" && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB CONTENT CARDS */}
            <div className="w-full max-w-3xl">
              {/* WINDOWS */}
              {activeTab === "windows" && (
                <div className="rounded-3xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/60 bg-white p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl dark:bg-zinc-900 bg-zinc-100 flex items-center justify-center text-xl">
                        <UiIcon name="monitor" className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">ROBOCEK Studio for Windows</h3>
                        <p className="text-xs dark:text-zinc-400 text-zinc-600">Supports Windows 10 / 11 (64-bit)</p>
                      </div>
                    </div>
                    {detectedOS === "windows" && (
                      <span className="text-[0.65rem] uppercase tracking-wider font-semibold dark:bg-emerald-950/60 dark:text-emerald-400 bg-emerald-100 text-emerald-800 border dark:border-emerald-800/40 border-emerald-300 px-3 py-1 rounded-full">
                        Recommended for your device
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <a
                      href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/ROBOCEK.Studio_0.2.0_x64-setup.exe"
                      className="group flex flex-col justify-between p-5 rounded-2xl border dark:border-zinc-700/80 border-zinc-300 dark:bg-zinc-900/60 bg-zinc-50 hover:border-emerald-500 dark:hover:border-emerald-500 transition"
                    >
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-widest font-bold text-emerald-500 block mb-1">
                          Windows installer
                        </span>
                        <h4 className="text-sm font-semibold dark:text-zinc-100 text-black">
                          Executable Installer (.exe)
                        </h4>
                        <p className="text-xs dark:text-zinc-400 text-zinc-600 mt-1">
                          NSIS setup package with auto-desktop shortcut &amp; uninstaller.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t dark:border-zinc-800 border-zinc-200 flex items-center justify-between text-xs font-semibold text-emerald-500 group-hover:translate-x-0.5 transition">
                        <span>Download .exe (x64)</span>
                        <UiIcon name="download" className="h-4 w-4" />
                      </div>
                    </a>

                    <a
                      href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/ROBOCEK.Studio_0.2.0_x64_en-US.msi"
                      className="group flex flex-col justify-between p-5 rounded-2xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900/30 bg-white hover:border-zinc-400 dark:hover:border-zinc-600 transition"
                    >
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-widest text-zinc-500 block mb-1">
                          Enterprise / MSI
                        </span>
                        <h4 className="text-sm font-semibold dark:text-zinc-100 text-black">
                          MSI Installer (.msi)
                        </h4>
                        <p className="text-xs dark:text-zinc-400 text-zinc-600 mt-1">
                          Standard Windows Installer package for lab deployments.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t dark:border-zinc-800 border-zinc-200 flex items-center justify-between text-xs font-semibold dark:text-zinc-300 text-zinc-700 group-hover:translate-x-0.5 transition">
                        <span>Download .msi (x64)</span>
                        <UiIcon name="download" className="h-4 w-4" />
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {/* MACOS */}
              {activeTab === "mac" && (
                <div className="rounded-3xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/60 bg-white p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl dark:bg-zinc-900 bg-zinc-100 flex items-center justify-center text-xl">
                        <UiIcon name="monitor" className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">ROBOCEK Studio for macOS</h3>
                        <p className="text-xs dark:text-zinc-400 text-zinc-600">Supports macOS Big Sur 11.0 or later (Apple Silicon &amp; Intel)</p>
                      </div>
                    </div>
                    {detectedOS === "mac" && (
                      <span className="text-[0.65rem] uppercase tracking-wider font-semibold dark:bg-emerald-950/60 dark:text-emerald-400 bg-emerald-100 text-emerald-800 border dark:border-emerald-800/40 border-emerald-300 px-3 py-1 rounded-full">
                        Recommended for your device
                      </span>
                    )}
                  </div>

                  <a
                    href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/ROBOCEK.Studio_0.2.0_x64.dmg"
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border dark:border-zinc-700/80 border-zinc-300 dark:bg-zinc-900/60 bg-zinc-50 hover:border-emerald-500 dark:hover:border-emerald-500 transition gap-4"
                  >
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-widest font-bold text-emerald-500 block mb-1">
                        Universal Disk Image
                      </span>
                      <h4 className="text-sm font-semibold dark:text-zinc-100 text-black">
                        ROBOCEK Studio macOS DMG (.dmg)
                      </h4>
                      <p className="text-xs dark:text-zinc-400 text-zinc-600 mt-1">
                        Drag &amp; drop installer compatible with both Apple Silicon (M1/M2/M3) and Intel Macs.
                      </p>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-full bg-emerald-500 text-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider shrink-0 group-hover:bg-emerald-400 transition">
                      Download .dmg
                    </span>
                  </a>
                </div>
              )}

              {/* LINUX */}
              {activeTab === "linux" && (
                <div className="rounded-3xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/60 bg-white p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl dark:bg-zinc-900 bg-zinc-100 flex items-center justify-center text-xl">
                        <UiIcon name="terminal" className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">ROBOCEK Studio for Linux</h3>
                        <p className="text-xs dark:text-zinc-400 text-zinc-600">Supports Ubuntu, Debian, Fedora, Arch &amp; derivative distributions</p>
                      </div>
                    </div>
                    {detectedOS === "linux" && (
                      <span className="text-[0.65rem] uppercase tracking-wider font-semibold dark:bg-emerald-950/60 dark:text-emerald-400 bg-emerald-100 text-emerald-800 border dark:border-emerald-800/40 border-emerald-300 px-3 py-1 rounded-full">
                        Recommended for your device
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <a
                      href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/robocek-studio_0.2.0_amd64.AppImage"
                      className="group flex flex-col justify-between p-5 rounded-2xl border dark:border-zinc-700/80 border-zinc-300 dark:bg-zinc-900/60 bg-zinc-50 hover:border-emerald-500 dark:hover:border-emerald-500 transition"
                    >
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-widest font-bold text-emerald-500 block mb-1">
                          Linux package
                        </span>
                        <h4 className="text-sm font-semibold dark:text-zinc-100 text-black">
                          AppImage (.AppImage)
                        </h4>
                        <p className="text-xs dark:text-zinc-400 text-zinc-600 mt-1">
                          Standalone executable package. Runs directly on any modern Linux distribution without installation.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t dark:border-zinc-800 border-zinc-200 flex items-center justify-between text-xs font-semibold text-emerald-500 group-hover:translate-x-0.5 transition">
                        <span>Download AppImage</span>
                        <UiIcon name="download" className="h-4 w-4" />
                      </div>
                    </a>

                    <a
                      href="https://github.com/HarikeshopGCEK/robocek-platform/releases/download/v0.2.1/robocek-studio_0.2.0_amd64.deb"
                      className="group flex flex-col justify-between p-5 rounded-2xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900/30 bg-white hover:border-zinc-400 dark:hover:border-zinc-600 transition"
                    >
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-widest text-zinc-500 block mb-1">
                          Debian / Ubuntu Package
                        </span>
                        <h4 className="text-sm font-semibold dark:text-zinc-100 text-black">
                          DEB Package (.deb)
                        </h4>
                        <p className="text-xs dark:text-zinc-400 text-zinc-600 mt-1">
                          Native package for Ubuntu, Debian, Linux Mint, and Elementary OS (`dpkg -i`).
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t dark:border-zinc-800 border-zinc-200 flex items-center justify-between text-xs font-semibold dark:text-zinc-300 text-zinc-700 group-hover:translate-x-0.5 transition">
                        <span>Download .deb Package</span>
                        <UiIcon name="download" className="h-4 w-4" />
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {/* CLI TOOL */}
              {activeTab === "cli" && (
                <div className="rounded-3xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/60 bg-white p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b dark:border-zinc-800 border-zinc-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl dark:bg-zinc-900 bg-zinc-100 flex items-center justify-center text-xl">
                        <UiIcon name="terminal" className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">ROBOCEK CLI Tool</h3>
                        <p className="text-xs dark:text-zinc-400 text-zinc-600">Command-line utility for bot creation, serial testing &amp; automated build scripts</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs dark:text-zinc-300 text-zinc-700">
                      You can install the ROBOCEK CLI tool on any system with Python 3.10+ installed:
                    </p>

                    <div className="relative flex items-center justify-between rounded-xl bg-zinc-900 text-zinc-100 p-4 font-mono text-xs border border-zinc-800">
                      <span>$ pip install robocek-cli</span>
                      <button
                        onClick={handleCopyCLI}
                        className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[0.7rem] uppercase font-sans tracking-wider text-zinc-300 transition"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <div className="p-4 rounded-xl dark:bg-zinc-900/40 bg-gray-100 border dark:border-zinc-800 border-zinc-200 text-xs space-y-2">
                      <p className="font-semibold text-emerald-500">Commands</p>
                      <ul className="space-y-1 font-mono text-[0.75rem] dark:text-zinc-300 text-zinc-800">
                        <li>robocek init my-bot &nbsp;&nbsp;# Generate project boilerplate</li>
                        <li>robocek flash &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Flash connected microcontroller</li>
                        <li>robocek monitor &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Open serial stream monitor</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PREREQUISITES & SYSTEM REQUIREMENTS */}
        <section className="w-full border-t dark:border-zinc-900 border-zinc-300 dark:bg-black/50 bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-10 lg:px-16 grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/40 bg-white p-6 space-y-3">
              <h3 className="text-base font-semibold dark:text-zinc-100 text-black flex items-center gap-2">
                <UiIcon name="monitor" className="h-4 w-4" /> System Prerequisites
              </h3>
              <p className="text-xs dark:text-zinc-400 text-zinc-700 leading-relaxed">
                Before running firmware compilation or board flashing within ROBOCEK Studio, please ensure the following runtime packages are installed on your machine:
              </p>
              <ul className="text-xs space-y-2 dark:text-zinc-300 text-zinc-800">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span><strong>Python 3.10+</strong> (Required for hardware communication scripts)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span><strong>PlatformIO Core</strong> (Cross-compiler for ESP32, STM32, Arduino)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span><strong>CH340 / CP2102 Drivers</strong> (For USB-to-UART serial flashing)</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/40 bg-white p-6 space-y-3">
              <h3 className="text-base font-semibold dark:text-zinc-100 text-black flex items-center gap-2">
                <UiIcon name="info" className="h-4 w-4" /> Release Notes (v0.2.1)
              </h3>
              <p className="text-xs dark:text-zinc-400 text-zinc-700 leading-relaxed">
                Key updates in ROBOCEK Studio release v0.2.1:
              </p>
              <ul className="text-xs space-y-2 dark:text-zinc-300 text-zinc-800">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">•</span>
                  <span>Upgraded embedded engine to Tauri v2 for 40% lower memory footprint.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">•</span>
                  <span>Integrated telemetry graphs for real-time sensor visualization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">•</span>
                  <span>Added pre-built project generators for Line Followers and Wall E bots.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.7rem] dark:text-zinc-500 text-zinc-600">
          <p>
            © {new Date().getFullYear()} ROBOCEK · Robotics Club, Government College of Engineering Kannur.
          </p>
          <div className="flex items-center gap-4">
            <span className="uppercase tracking-[0.18em] dark:text-zinc-600 text-zinc-500">
              Designed in B/W
            </span>
            <span className="h-px w-10 dark:bg-zinc-700 bg-zinc-300" />
            <Link
              href="/"
              className="dark:hover:text-zinc-200 hover:text-zinc-800 transition uppercase tracking-[0.16em]"
            >
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
