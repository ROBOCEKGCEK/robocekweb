"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import UiIcon from "./components/UiIcon";
import RoboCore3D from "./components/RoboCore3D";
import TiltCard from "./components/TiltCard";
import CyberBackground from "./components/CyberBackground";
import HoloMembershipCard from "./components/HoloMembershipCard";

const slideshowImages = [
  {
    src: "/slideshow/IMG-20260329-WA0028.jpg",
    alt: "ROBOCEK team group photo",
  },
  {
    src: "/slideshow/IMG-20260329-WA0012.jpg",
    alt: "ROBOCEK team at a club event",
  },
  {
    src: "/slideshow/IMG-20260329-WA0013.jpg",
    alt: "ROBOCEK members in the lab",
  },
  {
    src: "/slideshow/IMG-20260329-WA0016.jpg",
    alt: "ROBOCEK team collaboration photo",
  },
  {
    src: "/slideshow/IMG-20260226-WA0021.jpg",
    alt: "ROBOCEK team activity photo",
  },
  {
    src: "/slideshow/IMG-20250227-WA0042.jpg",
    alt: "ROBOCEK team photo",
  },
  {
    src: "/slideshow/IMG-20260329-WA0027.jpg",
    alt: "ROBOCEK members posing together",
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideshowImages.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-[#030712] dark:text-zinc-50 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200"
      id="top"
    >
      <CyberBackground />
      <ThemeToggle />

      {/* FUTURISTIC HUD HEADER */}
      <header className="w-full border-b dark:border-cyan-500/20 border-slate-300 dark:bg-[#030712]/85 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Callout */}
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
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-[0.25em] uppercase font-[family-name:var(--font-cyber)] text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 dark:from-cyan-400 dark:via-purple-300 dark:to-cyan-200">
                ROBOCEK
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                GCEK LAB // SYSTEM READY
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-lg border
                dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-cyan-500/60 dark:hover:text-cyan-300 dark:hover:bg-cyan-950/20
                border-zinc-300 text-zinc-700 hover:border-cyan-600 hover:text-cyan-700 hover:bg-cyan-50
                px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] transition"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-lg border
                dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-cyan-500/60 dark:hover:text-cyan-300 dark:hover:bg-cyan-950/20
                border-zinc-300 text-zinc-700 hover:border-cyan-600 hover:text-cyan-700 hover:bg-cyan-50
                px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] transition"
            >
              Projects
            </Link>
            <Link
              href="/execom"
              className="inline-flex items-center justify-center rounded-lg border
                dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-cyan-500/60 dark:hover:text-cyan-300 dark:hover:bg-cyan-950/20
                border-zinc-300 text-zinc-700 hover:border-cyan-600 hover:text-cyan-700 hover:bg-cyan-50
                px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] transition"
            >
              ExeCom
            </Link>
            <Link
              href="/downloads"
              className="inline-flex items-center justify-center rounded-lg border
                dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-cyan-500/60 dark:hover:text-cyan-300 dark:hover:bg-cyan-950/20
                border-zinc-300 text-zinc-700 hover:border-cyan-600 hover:text-cyan-700 hover:bg-cyan-50
                px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] transition"
            >
              Downloads
            </Link>
            <a
              href="https://robocek-components.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center justify-center rounded-lg border
                dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-emerald-500/60 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/20
                border-zinc-300 text-zinc-700 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50
                px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] transition gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Components
            </a>
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] font-semibold text-black dark:text-cyan-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
            >
              <span>Member Login</span>
              <span className="ml-1.5 font-bold group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH 3D WEBGL CORE */}
      <main className="flex-1 w-full flex flex-col items-center z-10">
        <section className="w-full max-w-7xl px-4 sm:px-8 lg:px-12 pt-8 pb-16 sm:pt-14 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left: Cybernetic Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left gap-5">
              {/* Telemetry Status Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border dark:border-cyan-500/40 dark:bg-cyan-950/30 border-cyan-700/30 bg-cyan-50 px-3.5 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span>SYSTEM ACTIVE // ROBOTICS LAB · GCE KANNUR</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] font-[family-name:var(--font-cyber)]">
                <span className="block text-slate-900 dark:text-white">
                  ROBOCEK
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 dark:from-cyan-400 dark:via-purple-400 dark:to-cyan-200 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[0.16em] uppercase mt-2">
                  Robotics & Autonomous Systems
                </span>
              </h1>

              {/* Mission Statement */}
              <p className="max-w-xl text-sm sm:text-base dark:text-zinc-300 text-zinc-700 leading-relaxed font-sans">
                Student innovators at Government College of Engineering Kannur
                architecting autonomous ground vehicles, computer vision pipelines,
                embedded micro-architectures, and high-performance competitive bots.
              </p>

              {/* Futuristic Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-2 w-full sm:w-auto font-mono text-xs">
                <Link
                  href="/register"
                  className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-600 text-black font-semibold uppercase tracking-[0.18em] px-7 py-3 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.65)] hover:scale-[1.02]"
                >
                  <span>Initialize Membership</span>
                  <span className="ml-2.5 transition-transform group-hover:translate-x-1 font-bold">
                    [ → ]
                  </span>
                </Link>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black/40 bg-white/80 dark:text-zinc-200 text-zinc-800 hover:border-cyan-500/60 dark:hover:text-cyan-300 hover:text-cyan-700 uppercase tracking-[0.18em] px-6 py-3 transition-colors backdrop-blur-md"
                >
                  Explore Projects
                </a>
              </div>

              {/* Live Telemetry Metrics Strip */}
              <div className="mt-4 pt-6 border-t dark:border-zinc-800/80 border-zinc-300 grid grid-cols-3 gap-6 w-full max-w-lg font-mono text-xs">
                <div>
                  <p className="text-cyan-600 dark:text-cyan-400 font-bold text-base sm:text-lg">
                    EST. 2012
                  </p>
                  <p className="dark:text-zinc-500 text-zinc-600 text-[11px] uppercase tracking-wider">
                    Continuous Innovation
                  </p>
                </div>
                <div>
                  <p className="text-purple-600 dark:text-purple-400 font-bold text-base sm:text-lg">
                    4+ DOMAINS
                  </p>
                  <p className="dark:text-zinc-500 text-zinc-600 text-[11px] uppercase tracking-wider">
                    Autonomous & Hardware
                  </p>
                </div>
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-base sm:text-lg">
                    LIVE LAB
                  </p>
                  <p className="dark:text-zinc-500 text-zinc-600 text-[11px] uppercase tracking-wider">
                    GCE Kannur Campus
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Flagship 3D WebGL Robotic Core & Cockpit Frame */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-[480px] p-2 sm:p-4 rounded-3xl border dark:border-cyan-500/30 border-cyan-700/20 dark:bg-zinc-950/70 bg-white/70 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.12)]">
                {/* Cockpit HUD Top Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b dark:border-zinc-800 border-zinc-200 px-2 font-mono text-[10px] text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-cyan-600 dark:text-cyan-300 font-bold">
                      ROBOTIC GIMBAL CORE
                    </span>
                  </div>
                  <span className="uppercase tracking-widest text-zinc-500">
                    REALTIME 3D WEBGL
                  </span>
                </div>

                {/* Interactive 3D WebGL Canvas */}
                <RoboCore3D />

                {/* Cockpit HUD Subtitle */}
                <div className="pt-3 mt-2 border-t dark:border-zinc-800 border-zinc-200 px-2 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span>INTERACT: DRAG TO ROTATE 3D</span>
                  <span className="text-cyan-500 dark:text-cyan-400">
                    STATUS: SYNCHRONIZED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROBOTICS DOMAIN MATRIX / CURRENT WORK */}
        <section
          id="domains"
          className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-zinc-950/60 bg-white/60 backdrop-blur-md py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-2">
                  <span className="h-px w-6 bg-cyan-500" />
                  Engineering Verticals
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-[family-name:var(--font-cyber)]">
                  What Members Build
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-sans dark:text-zinc-400 text-zinc-600 max-w-md">
                From microsecond motor feedback loops to distributed multi-agent swarm
                algorithms, our domains bridge mechanical fabrication and cutting-edge software.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <TiltCard
                glowColor="cyan"
                className="dark:bg-zinc-900/60 bg-white dark:border-zinc-800 border-zinc-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500">
                      DOMAIN // 01
                    </span>
                    <UiIcon name="bolt" className="h-5 w-5 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-bold dark:text-white text-zinc-900 mb-2 font-mono">
                    Autonomous Navigation
                  </h3>
                  <p className="text-xs dark:text-zinc-400 text-zinc-600 leading-relaxed mb-4">
                    High-precision line followers, maze solvers, and obstacle course bots
                    engineered with tuned PID loops, IR sensor arrays, and optical odometry.
                  </p>
                </div>
                <div className="pt-4 border-t dark:border-zinc-800/80 border-zinc-200 font-mono text-[10px] text-cyan-600 dark:text-cyan-400">
                  PID · Sensor Fusion · Encoders
                </div>
              </TiltCard>

              <TiltCard
                glowColor="purple"
                className="dark:bg-zinc-900/60 bg-white dark:border-zinc-800 border-zinc-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-purple-500">
                      DOMAIN // 02
                    </span>
                    <UiIcon name="terminal" className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-base font-bold dark:text-white text-zinc-900 mb-2 font-mono">
                    Embedded &amp; RTOS
                  </h3>
                  <p className="text-xs dark:text-zinc-400 text-zinc-600 leading-relaxed mb-4">
                    Firmware architecture on STM32 ARM Cortex, ESP32 microcontrollers,
                    CAN bus telemetry, custom PWM timers, and real-time task scheduling.
                  </p>
                </div>
                <div className="pt-4 border-t dark:border-zinc-800/80 border-zinc-200 font-mono text-[10px] text-purple-600 dark:text-purple-400">
                  STM32 · FreeRTOS · CAN Bus
                </div>
              </TiltCard>

              <TiltCard
                glowColor="emerald"
                className="dark:bg-zinc-900/60 bg-white dark:border-zinc-800 border-zinc-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-500">
                      DOMAIN // 03
                    </span>
                    <UiIcon name="monitor" className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold dark:text-white text-zinc-900 mb-2 font-mono">
                    Vision &amp; Perception
                  </h3>
                  <p className="text-xs dark:text-zinc-400 text-zinc-600 leading-relaxed mb-4">
                    Edge AI neural networks on NVIDIA Jetson Nano, OpenCV tracking,
                    depth camera estimation, and SLAM mapping for real-time spatial awareness.
                  </p>
                </div>
                <div className="pt-4 border-t dark:border-zinc-800/80 border-zinc-200 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                  YOLOv8 · OpenCV · LiDAR SLAM
                </div>
              </TiltCard>

              <TiltCard
                glowColor="amber"
                className="dark:bg-zinc-900/60 bg-white dark:border-zinc-800 border-zinc-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500">
                      DOMAIN // 04
                    </span>
                    <UiIcon name="bolt" className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-base font-bold dark:text-white text-zinc-900 mb-2 font-mono">
                    Combat &amp; Mechanics
                  </h3>
                  <p className="text-xs dark:text-zinc-400 text-zinc-600 leading-relaxed mb-4">
                    High-strength CAD chassis fabrication, hardened gearbox drivetrains,
                    brushless weapon motors, and impact telemetry for national robowars arenas.
                  </p>
                </div>
                <div className="pt-4 border-t dark:border-zinc-800/80 border-zinc-200 font-mono text-[10px] text-amber-600 dark:text-amber-400">
                  CAD · Powertrain · Robowars
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section
          id="projects"
          className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-black/40 bg-slate-100/50 backdrop-blur-sm py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-2">
                  <span className="h-px w-6 bg-cyan-500" />
                  Active R&amp;D
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-[family-name:var(--font-cyber)]">
                  Featured Club Projects
                </h2>
                <p className="mt-2 text-xs sm:text-sm dark:text-zinc-400 text-zinc-700 max-w-md">
                  From track-tested bots to open-source robotics research codebases, explore what ROBOCEK engineers have shipped.
                </p>
              </div>

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl border dark:border-cyan-500/40 border-cyan-600/30 px-5 py-2.5 text-xs font-mono uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/10 transition"
              >
                <span>Full Project Hub</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <TiltCard
                glowColor="cyan"
                className="dark:bg-zinc-950/60 bg-white p-6 dark:border-zinc-800 border-zinc-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                    NAVIGATION
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <h3 className="text-base font-bold mb-2 dark:text-zinc-100 text-black font-mono">
                  Autonomous Line Follower &amp; Maze Solver
                </h3>
                <p className="text-xs dark:text-zinc-400 text-zinc-700 mb-4 leading-relaxed">
                  High-speed bot tuned with PID algorithm, 8-channel optical array, and STM32 microcontroller for obstacle handling.
                </p>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-zinc-400">
                  <span className="px-2 py-0.5 rounded border dark:border-zinc-800 border-zinc-200">
                    STM32
                  </span>
                  <span className="px-2 py-0.5 rounded border dark:border-zinc-800 border-zinc-200">
                    PID
                  </span>
                  <span className="px-2 py-0.5 rounded border dark:border-zinc-800 border-zinc-200">
                    Encoders
                  </span>
                </div>
              </TiltCard>

              <TiltCard
                glowColor="purple"
                className="dark:bg-zinc-950/60 bg-white p-6 dark:border-zinc-800 border-zinc-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">
                    MULTI-AGENT
                  </span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                <h3 className="text-base font-bold mb-2 dark:text-zinc-100 text-black font-mono">
                  ROS2 Swarm Robotics Platform
                </h3>
                <p className="text-xs dark:text-zinc-400 text-zinc-700 mb-4 leading-relaxed">
                  Distributed multi-agent coordination system with mesh communication, SLAM mapping, and dynamic path convergence.
                </p>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-zinc-400">
                  <span className="px-2 py-0.5 rounded border dark:border-zinc-800 border-zinc-200">
                    ROS2
                  </span>
                  <span className="px-2 py-0.5 rounded border dark:border-zinc-800 border-zinc-200">
                    Python
                  </span>
                  <span className="px-2 py-0.5 rounded border dark:border-zinc-800 border-zinc-200">
                    SLAM
                  </span>
                </div>
              </TiltCard>

              <TiltCard
                glowColor="emerald"
                className="dark:bg-zinc-950/60 bg-white p-6 dark:border-zinc-800 border-zinc-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                    EDGE AI
                  </span>
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                </div>
                <h3 className="text-base font-bold mb-2 dark:text-zinc-100 text-black font-mono">
                  AI Edge Visual Defect Inspector
                </h3>
                <p className="text-xs dark:text-zinc-400 text-zinc-700 mb-4 leading-relaxed">
                  Real-time edge neural inference for automated PCB quality verification using YOLOv8 on NVIDIA Jetson Nano.
                </p>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-zinc-400">
                  <span className="px-2 py-0.5 rounded border dark:border-zinc-800 border-zinc-200">
                    Jetson Nano
                  </span>
                  <span className="px-2 py-0.5 rounded border dark:border-zinc-800 border-zinc-200">
                    YOLOv8
                  </span>
                  <span className="px-2 py-0.5 rounded border dark:border-zinc-800 border-zinc-200">
                    OpenCV
                  </span>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* 3D HOLOGRAPHIC DIGITAL MEMBERSHIP CARD SHOWCASE */}
        <section className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-zinc-950/40 bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
                  <span className="h-px w-6 bg-cyan-500" />
                  Smart Access System
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-[family-name:var(--font-cyber)]">
                  Interactive 3D Digital Membership Pass
                </h2>
                <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-700 leading-relaxed font-sans max-w-xl">
                  Every verified ROBOCEK member is issued a unique digital cryptographic
                  pass. Access the college lab equipment, check out components from the
                  inventory, and unlock exclusive workshops and hackathon participation.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-2 font-mono text-xs">
                  <div className="p-3.5 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-black/40 bg-slate-50">
                    <p className="text-cyan-500 font-bold mb-1">
                      RFID &amp; QR Telemetry
                    </p>
                    <p className="text-[11px] dark:text-zinc-400 text-zinc-600">
                      Instant lab gate check-in and automated attendance tracking.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-black/40 bg-slate-50">
                    <p className="text-purple-500 font-bold mb-1">
                      Component Rental Access
                    </p>
                    <p className="text-[11px] dark:text-zinc-400 text-zinc-600">
                      Reserve sensors and microcontrollers with 1-click verification.
                    </p>
                  </div>
                </div>

                <div className="mt-2">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-semibold uppercase tracking-[0.18em] px-6 py-3 font-mono text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition"
                  >
                    <span>View Member Dashboard</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* 3D Holo Card Component */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <HoloMembershipCard
                  name="ROBOCEK CADET"
                  memberId="RC-GCEK-2026"
                  role="Hardware & Robotics Squad"
                  batch="GCE Kannur"
                />
                <span className="font-mono text-[10px] text-zinc-500 mt-2">
                  HOVER TO TILT 3D HOLO PASS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SLIDESHOW / LAB ARCHIVE */}
        <section className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-black/60 bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex-1 flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400">
                <span className="h-px w-6 bg-cyan-500" />
                Community &amp; Culture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-[family-name:var(--font-cyber)]">
                The Squad Behind the Machines
              </h2>
              <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-700 max-w-lg leading-relaxed">
                ROBOCEK brings together passionate makers, coders, PCB designers, and
                mechanical engineers across every department of Government College of Engineering Kannur.
              </p>
              <p className="text-xs dark:text-zinc-500 text-zinc-600 max-w-lg">
                Step into the lab during evening club hours to experiment with 3D printers,
                oscilloscopes, soldiering stations, and autonomous track testbeds.
              </p>
            </div>

            <div className="flex-1 w-full max-w-xl">
              <div className="relative rounded-3xl overflow-hidden border dark:border-cyan-500/30 border-zinc-300 dark:bg-zinc-950/80 bg-white shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={slideshowImages[activeIndex].src}
                    alt={slideshowImages[activeIndex].alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={activeIndex === 0}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-zinc-200">
                    <span className="uppercase tracking-[0.2em] text-cyan-400">
                      ROBOCEK · LAB CHRONICLES
                    </span>
                    <span className="text-zinc-400">
                      FRAME [{activeIndex + 1}/{slideshowImages.length}]
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  {slideshowImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Show slide ${index + 1}`}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "w-6 bg-cyan-400"
                          : "w-2 bg-white/40 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPONENTS STORE CALLOUT */}
        <section
          id="components"
          className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-zinc-950/80 bg-white py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex-1 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-emerald-500">
                  <span className="h-px w-6 bg-emerald-500" />
                  Hardware Ecosystem
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-[family-name:var(--font-cyber)]">
                  Component Rental Hub
                </h2>
                <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-700 max-w-lg leading-relaxed">
                  Need sensors, development boards, motors, ESCs, or lab tools for your project?
                  Browse our real-time hardware catalogue and reserve components online.
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-400">
                  {["LiDAR", "STM32", "ESP32", "Brushless ESC", "IR Arrays", "OLEDs", "Tools"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border dark:border-zinc-800 border-zinc-200 px-3 py-1 bg-zinc-900/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full max-w-md">
                <TiltCard
                  glowColor="emerald"
                  className="dark:bg-zinc-950 bg-white p-7 dark:border-zinc-800 border-zinc-200"
                >
                  <div className="flex items-center justify-between mb-4 font-mono text-[10px] text-zinc-500">
                    <span>robocek-components.web.app</span>
                    <span className="text-emerald-400">LIVE INVENTORY</span>
                  </div>
                  <h3 className="text-lg font-bold font-mono dark:text-white text-zinc-900 mb-1">
                    Reserve Hardware in 3 Steps
                  </h3>
                  <p className="text-xs dark:text-zinc-400 text-zinc-600 mb-5">
                    Browse catalog → Reserve using Member ID → Collect from lab counter
                  </p>
                  <a
                    href="https://robocek-components.web.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold uppercase tracking-[0.18em] px-6 py-3 font-mono text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition"
                  >
                    <span>Browse Component Hub</span>
                    <span className="ml-2 font-bold">↗</span>
                  </a>
                </TiltCard>
              </div>
            </div>
          </div>
        </section>

        {/* EXECOM SPOTLIGHT TEASER */}
        <section
          id="execom"
          className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-black/70 bg-slate-100/60 py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <TiltCard
              glowColor="cyan"
              className="dark:bg-zinc-950/80 bg-white p-8 sm:p-12 dark:border-zinc-800 border-zinc-200"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-500">
                    <span className="h-px w-6 bg-cyan-500" />
                    Leadership &amp; Cadre
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-[family-name:var(--font-cyber)]">
                    ROBOCEK &apos;26 Executive Committee
                  </h2>
                  <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-700 max-w-xl leading-relaxed font-sans">
                    Meet the student mentors, technical directors, hardware managers, and media strategists powering the club&apos;s robotics workshops, lab inventory, and hackathons.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs">
                    <div className="px-3 py-1.5 rounded-lg border dark:border-zinc-800 border-zinc-200 dark:bg-black/40 bg-slate-50 text-cyan-400">
                      9 Core Committee
                    </div>
                    <div className="px-3 py-1.5 rounded-lg border dark:border-zinc-800 border-zinc-200 dark:bg-black/40 bg-slate-50 text-purple-400">
                      6 Extended Leads
                    </div>
                    <div className="px-3 py-1.5 rounded-lg border dark:border-zinc-800 border-zinc-200 dark:bg-black/40 bg-slate-50 text-emerald-400">
                      3 Media &amp; Design
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href="/execom"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-600 px-8 py-4 text-xs font-mono font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all hover:scale-[1.02]"
                  >
                    <span>View ExeCom Directory</span>
                    <span className="font-bold">[ → ]</span>
                  </Link>
                </div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* JOIN / CONTACT HUD CONSOLE */}
        <section
          id="contact"
          className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-zinc-950 bg-gray-50 py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Telemetry Details */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                  <span className="h-px w-6 bg-cyan-500" />
                  Communications Relay
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-[family-name:var(--font-cyber)]">
                  Connect With ROBOCEK
                </h2>
                <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-700 max-w-md leading-relaxed font-sans">
                  Have a competition query, sponsorship proposal, or want to collaborate with our hardware team? Contact the lab team directly.
                </p>

                <div className="flex flex-col gap-3 mt-2">
                  <a
                    href="mailto:robocek@gcek.ac.in"
                    className="flex items-center gap-4 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/40 bg-white p-4 hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-lg border dark:border-zinc-700 border-zinc-300 dark:bg-zinc-950 bg-zinc-100 flex items-center justify-center font-mono text-cyan-400">
                      @
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500 mb-0.5">
                        Official Communications
                      </p>
                      <p className="text-sm font-mono dark:text-cyan-300 text-cyan-700">
                        robocek@gcek.ac.in
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 rounded-xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/40 bg-white p-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg border dark:border-zinc-700 border-zinc-300 dark:bg-zinc-950 bg-zinc-100 flex items-center justify-center font-mono text-purple-400">
                      LOC
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500 mb-0.5">
                        Campus Coordinates
                      </p>
                      <p className="text-sm font-mono dark:text-zinc-200 text-zinc-800">
                        ROBOCEK Robotics Lab · Electrical Dept, GCE Kannur
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Terminal Console Message Form */}
              <div className="lg:col-span-6 w-full">
                <TiltCard
                  glowColor="cyan"
                  className="dark:bg-zinc-950/80 bg-white p-6 sm:p-8 dark:border-zinc-800 border-zinc-200"
                >
                  <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-zinc-800 border-zinc-200 font-mono text-[10px] text-zinc-500">
                    <span>TERMINAL PROTOCOL // DISPATCH</span>
                    <span className="text-cyan-400">ENCRYPTED</span>
                  </div>

                  <form className="flex flex-col gap-3 font-mono text-xs">
                    <input
                      type="text"
                      placeholder="CALLSIGN / YOUR NAME"
                      className="h-10 rounded-lg border dark:border-zinc-800 dark:bg-black/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 border-zinc-300 bg-white px-4 text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="email"
                      placeholder="CONTACT EMAIL"
                      className="h-10 rounded-lg border dark:border-zinc-800 dark:bg-black/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 border-zinc-300 bg-white px-4 text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <textarea
                      rows={3}
                      placeholder="MESSAGE PAYLOAD..."
                      className="rounded-lg border resize-none dark:border-zinc-800 dark:bg-black/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 border-zinc-300 bg-white p-4 text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <a
                      href="mailto:robocek@gcek.ac.in"
                      className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-semibold uppercase tracking-[0.18em] py-3 text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition"
                    >
                      Transmit Message
                    </a>
                  </form>
                </TiltCard>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FUTURISTIC HUD FOOTER */}
      <footer className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-[#02050c] bg-white py-6 z-10 font-mono text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p>
              © {new Date().getFullYear()} ROBOCEK GCEK // AUTONOMOUS ROBOTICS CLUB
            </p>
          </div>

          <div className="flex items-center gap-5 uppercase tracking-widest text-[10px]">
            <Link href="/execom" className="hover:text-cyan-400 transition">
              ExeCom
            </Link>
            <span>//</span>
            <a
              href="https://robocek-components.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition"
            >
              Components Store
            </a>
            <span>//</span>
            <a href="#top" className="hover:text-cyan-400 transition">
              Return to Top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
