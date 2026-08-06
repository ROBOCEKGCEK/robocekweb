"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

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
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);
  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-white text-black dark:bg-black dark:text-zinc-50"
      id="top"
    >
      <ThemeToggle />

      {/* HEADER with Member Login */}
      <header className="w-full border-b dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo_white.png"
              alt="ROBOCEK logo"
              width={32}
              height={32}
              className="hidden dark:block select-none"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              src="/logo_black.png"
              alt="ROBOCEK logo"
              width={32}
              height={32}
              className="block dark:hidden select-none"
              style={{ width: "auto", height: "auto" }}
            />
            <span className="text-sm font-semibold tracking-widest uppercase">
              ROBOCEK
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full border
                dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
                border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
                px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border
                dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
                border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
                px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition"
            >
              Project Hub
            </Link>
            <a
              href="https://robocek-components.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center justify-center rounded-full border
                dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
                border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
                px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Components
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition"
            >
              Member Login
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="flex-1 w-full flex flex-col items-center">
        <section className="w-full max-w-6xl px-6 sm:px-10 lg:px-16 pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
            {/* Left: Title + CTAs */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo_white.png"
                  alt="ROBOCEK logo"
                  width={52}
                  height={52}
                  className="hidden dark:block select-none"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
                <Image
                  src="/logo_black.png"
                  alt="ROBOCEK logo"
                  width={52}
                  height={52}
                  className="block dark:hidden select-none"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
                <span
                  className="inline-flex items-center gap-2 rounded-full border
                  dark:border-zinc-700/70 dark:bg-zinc-900/60 dark:text-zinc-400
                  border-zinc-300 bg-zinc-100 text-zinc-700
                  px-4 py-1 text-xs font-medium tracking-[0.18em] uppercase"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full
                    dark:bg-zinc-100 bg-zinc-800"
                  />
                  Robotics Club · GCE Kannur
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight leading-tight">
                ROBOCEK
                <span className="block dark:text-zinc-400 text-zinc-600 text-xl sm:text-2xl lg:text-3xl mt-2 font-normal tracking-[0.25em] uppercase">
                  Robotics & Innovation Collective
                </span>
              </h1>

              <p className="max-w-xl text-sm sm:text-base dark:text-zinc-400 text-zinc-700 leading-relaxed">
                Official robotics club of Government College of Engineering
                Kannur — designing autonomous systems, intelligent machines and
                the engineers who build them.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <a
                  href="/register"
                  className="group inline-flex items-center justify-center rounded-full border
                    dark:border-zinc-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-black dark:hover:text-zinc-50 dark:hover:border-zinc-500
                    border-black bg-black text-white hover:bg-white hover:text-black hover:border-zinc-700
                    px-7 py-2.5 text-sm font-medium uppercase tracking-[0.18em] transition"
                >
                  Join the circuit
                  <span className="ml-2 h-px w-6 dark:bg-black bg-black group-hover:dark:bg-zinc-50 group-hover:bg-white transition-all group-hover:w-10" />
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-full border
                    dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50
                    border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black
                    px-7 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-[0.18em] transition"
                >
                  View projects
                </a>
              </div>

              <div
                className="mt-6 grid grid-cols-3 gap-4 text-xs sm:text-sm
                dark:text-zinc-400 text-zinc-700"
              >
                <div>
                  <p className="dark:text-zinc-200 text-black font-semibold">
                    Est. 2012
                  </p>
                  <p className="dark:text-zinc-500 text-zinc-600">
                    Continuously evolving lab culture
                  </p>
                </div>
                <div>
                  <p className="dark:text-zinc-200 text-black font-semibold">
                    Robotics
                  </p>
                  <p className="dark:text-zinc-500 text-zinc-600">
                    Autonomous, embedded & AI systems
                  </p>
                </div>
                <div>
                  <p className="dark:text-zinc-200 text-black font-semibold">
                    Community
                  </p>
                  <p className="dark:text-zinc-500 text-zinc-600">
                    Students · Mentors · Alumni
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Techy card */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg">
              <div className="relative rounded-3xl border border-zinc-800 bg-linear-to-br from-zinc-900 via-black to-zinc-950 p-6 sm:p-8 shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden">
                {/* glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
                  aria-hidden="true"
                >
                  <div className="absolute -inset-px bg-[radial-gradient(circle_at_top,white_0,transparent_60%)]" />
                </div>

                <div className="relative flex items-center justify-between mb-6 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Lab status · Online
                  </span>
                  <span className="tracking-[0.25em] uppercase">ROBOCEK</span>
                </div>

                <div className="relative flex flex-col gap-6">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-zinc-500 mb-2">
                      Focus Areas
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-zinc-200">
                      <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-2">
                        <p className="font-medium">Robotics</p>
                        <p className="text-[0.7rem] text-zinc-500 mt-1">
                          Line follower · Battle bot · Swarm
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-2">
                        <p className="font-medium">Embedded</p>
                        <p className="text-[0.7rem] text-zinc-500 mt-1">
                          Microcontrollers · ROS · Control
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-2">
                        <p className="font-medium">Computer Vision</p>
                        <p className="text-[0.7rem] text-zinc-500 mt-1">
                          Perception · Tracking
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-2">
                        <p className="font-medium">Autonomy</p>
                        <p className="text-[0.7rem] text-zinc-500 mt-1">
                          Navigation · Decision systems
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-4 flex items-center justify-between text-[0.7rem] text-zinc-500">
                    <div className="flex flex-col gap-1">
                      <span className="uppercase tracking-[0.2em] text-zinc-400">
                        Campus
                      </span>
                      <span className="text-zinc-300">
                        Government College of Engineering Kannur
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="uppercase tracking-[0.2em] text-zinc-400">
                        Mode
                      </span>
                      <span className="text-zinc-300">
                        Build · Learn · Compete
                      </span>
                    </div>
                  </div>
                </div>

                {/* subtle grid */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  aria-hidden="true"
                >
                  <div className="h-full w-full bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[32px_32px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="w-full border-t dark:border-zinc-900/80 border-zinc-300
            dark:bg-black/40 bg-gray-50 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  What we build
                </h2>
                <p className="mt-2 text-sm dark:text-zinc-400 text-zinc-700 max-w-md">
                  From idea to track‑ready prototypes, ROBOCEK teams design,
                  fabricate and program robots that compete in college and
                  national‑level events.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-600">
                <span className="rounded-full border dark:border-zinc-700 border-zinc-400 px-3 py-1">
                  Hackathons
                </span>
                <span className="rounded-full border dark:border-zinc-700 border-zinc-400 px-3 py-1">
                  Robowars
                </span>
                <span className="rounded-full border dark:border-zinc-700 border-zinc-400 px-3 py-1">
                  Line Followers
                </span>
                <span className="rounded-full border dark:border-zinc-700 border-zinc-400 px-3 py-1">
                  Ideathons
                </span>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="group rounded-2xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/40 bg-white p-5 hover:border-zinc-100 transition-colors">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-600 mb-2">
                  Autonomous Navigation
                </p>
                <h3 className="text-sm font-semibold mb-2 dark:text-zinc-50 text-black">
                  Line Follower & Maze Solvers
                </h3>
                <p className="text-xs dark:text-zinc-400 text-zinc-700 mb-3">
                  High‑speed bots tuned with PID, sensor fusion and optimized
                  path planning for complex tracks and mazes.
                </p>
                <p className="text-[0.65rem] dark:text-zinc-500 text-zinc-600">
                  Infrared · Encoders · Microcontrollers
                </p>
              </div>

              <div className="group rounded-2xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/40 bg-white p-5 hover:border-zinc-100 transition-colors">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-600 mb-2">
                  Competitive Robotics
                </p>
                <h3 className="text-sm font-semibold mb-2 dark:text-zinc-50 text-black">
                  Battle & Task‑Based Bots
                </h3>
                <p className="text-xs dark:text-zinc-400 text-zinc-700 mb-3">
                  Mechanically robust bots with torque‑heavy drivetrains and
                  precise remote control systems for arena competitions.
                </p>
                <p className="text-[0.65rem] dark:text-zinc-500 text-zinc-600">
                  CAD · Fabrication · Powertrain
                </p>
              </div>

              <div className="group rounded-2xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/40 bg-white p-5 hover:border-zinc-100 transition-colors">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-600 mb-2">
                  Research & Experiments
                </p>
                <h3 className="text-sm font-semibold mb-2 dark:text-zinc-50 text-black">
                  Vision & Automation
                </h3>
                <p className="text-xs dark:text-zinc-400 text-zinc-700 mb-3">
                  Mini‑projects that explore computer vision, embedded AI and
                  semi‑autonomous systems under senior guidance.
                </p>
                <p className="text-[0.65rem] dark:text-zinc-500 text-zinc-600">
                  Python · OpenCV · Control
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="w-full border-t dark:border-zinc-900 border-zinc-300 dark:bg-black/60 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 flex flex-col lg:flex-row gap-10 items-stretch">
            <div className="flex-1 flex flex-col gap-3 justify-center">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                The team behind the bots.
              </h2>
              <p className="text-sm dark:text-zinc-400 text-zinc-700 max-w-md">
                ROBOCEK is a mix of makers, coders, designers and mentors from
                across branches at Government College of Engineering Kannur —
                collaborating on robots, research and competitions.
              </p>
              <p className="text-xs dark:text-zinc-500 text-zinc-600 max-w-md">
                Visit the lab during club hours to meet the current core team,
                explore ongoing builds and see how you can contribute.
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-xl rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950/60 shadow-[0_0_60px_rgba(255,255,255,0.04)]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={slideshowImages[activeIndex].src}
                    alt={slideshowImages[activeIndex].alt}
                    fill
                    className="object-cover"
                    priority={activeIndex === 0}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[0.7rem] text-zinc-200">
                    <span className="uppercase tracking-[0.18em] text-zinc-300">
                      ROBOCEK · Team
                    </span>
                    <span className="text-zinc-400">
                      Group photo · {new Date().getFullYear()}
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
                      className={`h-2.5 w-2.5 rounded-full border border-white/40 transition ${
                        index === activeIndex
                          ? "bg-white"
                          : "bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPONENTS STORE */}
        <section
          id="components"
          className="w-full border-t dark:border-zinc-900 border-zinc-300
            dark:bg-black/60 bg-gray-50"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
            <div className="flex flex-col lg:flex-row items-center gap-10">

              {/* Text */}
              <div className="flex-1 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] dark:text-zinc-500 text-zinc-600">
                  <span className="h-px w-6 dark:bg-zinc-700 bg-zinc-400" />
                  ROBOCEK Store
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Rent components &amp; tools.
                </h2>
                <p className="text-sm dark:text-zinc-400 text-zinc-700 max-w-md leading-relaxed">
                  Need sensors, microcontrollers, motors or lab equipment for
                  your project? ROBOCEK runs a community components rental
                  service — browse available parts and book them online.
                </p>
                <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.14em] dark:text-zinc-500 text-zinc-600">
                  {["Sensors", "Microcontrollers", "Motors", "Displays", "Power", "Tools"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border dark:border-zinc-800 border-zinc-300 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <div className="flex-1 w-full max-w-md">
                <div className="relative rounded-2xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-white p-6 sm:p-8 overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.03)]">
                  {/* glow accent */}
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full
                      dark:bg-emerald-500/10 bg-emerald-400/20 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] uppercase tracking-[0.22em] dark:text-zinc-500 text-zinc-500">
                        robocek-components.web.app
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[0.65rem] dark:text-emerald-400 text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    </div>

                    <div>
                      <p className="text-lg font-semibold tracking-tight dark:text-zinc-50 text-black">
                        ROBOCEK Component Hub
                      </p>
                      <p className="mt-1 text-xs dark:text-zinc-400 text-zinc-600">
                        Browse · Reserve · Pick up from lab
                      </p>
                    </div>

                    <a
                      href="https://robocek-components.web.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center rounded-full
                        dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200
                        bg-black text-white hover:bg-zinc-800
                        px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition"
                    >
                      Browse Components
                      <span className="ml-2 h-px w-5 dark:bg-black bg-white group-hover:w-8 transition-all" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* EXECOM */}
        <section
          id="execom"
          className="w-full border-t dark:border-zinc-900 border-zinc-300
            dark:bg-black bg-white"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
            <div className="mb-10">
              <span className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] dark:text-zinc-500 text-zinc-600 mb-3">
                <span className="h-px w-6 dark:bg-zinc-700 bg-zinc-400" />
                ROBOCEK &apos;26
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Meet our ExeCom.
              </h2>
              <p className="mt-2 text-sm dark:text-zinc-400 text-zinc-700 max-w-md">
                The executive committee driving ROBOCEK&apos;s vision — organising events, mentoring members and keeping the lab running.
              </p>
            </div>

            {/* Core ExeCom */}
            <p className="text-[0.68rem] uppercase tracking-[0.22em] dark:text-zinc-500 text-zinc-600 mb-5 flex items-center gap-3">
              <span className="h-px flex-1 dark:bg-zinc-800 bg-zinc-200" />
              Core Committee
              <span className="h-px flex-1 dark:bg-zinc-800 bg-zinc-200" />
            </p>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
              {([
                { role: "President", name: "Harikesh O P", photo: "/execom/president.jpg" },
                { role: "Vice President", name: "Vismaya P", photo: "/execom/Vismaya.jpg" },
                { role: "Secretary", name: "Rahul S", photo: "/execom/rahul.jpg" },
                { role: "Treasurer", name: "Alex K Joseph", photo: "/execom/Alex.jpg" },
                { role: "Project Manager", name: "Arjav P", photo: "/execom/Arjav.jpg" },
                { role: "Chief Technical Lead", name: "Shan Francis", photo: "/execom/shan.jpg" },
                { role: "Outreach Head", name: "Yadhu Krishna P", photo: "/execom/yadu.jpg" },
                { role: "Documentation Head", name: "Sooryadath P K", photo: "/execom/surya.jpg" },
                { role: "Alumni Connect", name: "Gopika P E", photo: "/execom/Gopika.jpg" },
              ] as { role: string; name: string; photo: string | null }[]).map((m) => (
                <div
                  key={m.role}
                  className="group rounded-2xl border dark:border-zinc-800 border-zinc-300
                    dark:bg-zinc-950/50 bg-white overflow-hidden
                    hover:dark:border-zinc-600 hover:border-zinc-500 transition-colors"
                >
                  <div className="relative w-full aspect-[3/4] dark:bg-zinc-900 bg-zinc-100
                    border-b dark:border-zinc-800 border-zinc-200 overflow-hidden">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <span className="text-3xl opacity-20">👤</span>
                        <span className="text-[0.6rem] uppercase tracking-widest dark:text-zinc-600 text-zinc-400">Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-500 mb-0.5">{m.role}</p>
                    <p className="text-sm font-semibold dark:text-zinc-100 text-black leading-tight">{m.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Extended Team */}
            <p className="text-[0.68rem] uppercase tracking-[0.22em] dark:text-zinc-500 text-zinc-600 mb-5 flex items-center gap-3">
              <span className="h-px flex-1 dark:bg-zinc-800 bg-zinc-200" />
              Extended Team
              <span className="h-px flex-1 dark:bg-zinc-800 bg-zinc-200" />
            </p>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
              {([
                { role: "Component Manager", name: "Arjun K", photo: "/execom/arjun.jpg" },
                { role: "Component Manager", name: "Richard Chinthu", photo: "/execom/richard.jpg" },
                { role: "Social Media Strategist", name: "Prarthana VP", photo: "/execom/Prarthana.JPG" },
                { role: "Event Manager", name: "Keerthana D Nair", photo: "/execom/Keerthana.jpg" },
                { role: "Event Manager", name: "Goutham Krishna", photo: "/execom/goutham.jpg" },
                { role: "Event Manager", name: "Sayanthana S", photo: "/execom/sayanthana.jpg" },
              ] as { role: string; name: string; photo?: string | null }[]).map((m, i) => (
                <div
                  key={`ext-${i}`}
                  className="group rounded-2xl border dark:border-zinc-800 border-zinc-300
                    dark:bg-zinc-950/50 bg-white overflow-hidden
                    hover:dark:border-zinc-600 hover:border-zinc-500 transition-colors"
                >
                  <div className="relative w-full aspect-[3/4] dark:bg-zinc-900 bg-zinc-100
                    border-b dark:border-zinc-800 border-zinc-200 overflow-hidden">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <span className="text-3xl opacity-20">👤</span>
                        <span className="text-[0.6rem] uppercase tracking-widest dark:text-zinc-600 text-zinc-400">Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-500 mb-0.5">{m.role}</p>
                    <p className="text-sm font-semibold dark:text-zinc-100 text-black leading-tight">{m.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Media Team */}
            <p className="text-[0.68rem] uppercase tracking-[0.22em] dark:text-zinc-500 text-zinc-600 mb-5 flex items-center gap-3">
              <span className="h-px flex-1 dark:bg-zinc-800 bg-zinc-200" />
              Media Team
              <span className="h-px flex-1 dark:bg-zinc-800 bg-zinc-200" />
            </p>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
              {([
                { role: "Media Head", name: "Joshna KM", photo: "/execom/joshna.jpg" },
                { role: "Media Team", name: "Rekha PK", photo: "/execom/rekha.jpg" },
                { role: "Media Team", name: "Dhanush VK", photo: "/execom/dhanush.jpg" },
              ] as { role: string; name: string; photo?: string | null }[]).map((m, i) => (
                <div
                  key={`media-${i}`}
                  className="group rounded-2xl border dark:border-zinc-800 border-zinc-300
                    dark:bg-zinc-950/50 bg-white overflow-hidden
                    hover:dark:border-zinc-600 hover:border-zinc-500 transition-colors"
                >
                  <div className="relative w-full aspect-[3/4] dark:bg-zinc-900 bg-zinc-100
                    border-b dark:border-zinc-800 border-zinc-200 overflow-hidden">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <span className="text-3xl opacity-20">👤</span>
                        <span className="text-[0.6rem] uppercase tracking-widest dark:text-zinc-600 text-zinc-400">Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-500 mb-0.5">{m.role}</p>
                    <p className="text-sm font-semibold dark:text-zinc-100 text-black leading-tight">{m.name}</p>
                  </div>
                </div>
              ))}
            </div>



          </div>
        </section>

        {/* JOIN */}
        <section
          id="join"
          className="w-full border-t dark:border-zinc-900 border-zinc-300
            dark:bg-black bg-white py-12 sm:py-16"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Plug into the ROBOCEK network.
              </h2>
              <p className="text-sm dark:text-zinc-400 text-zinc-700 max-w-xl">
                Whether you are just starting with electronics or already
                prototyping complex systems, there is a squad for you. We host
                workshops, build sessions, late‑night debugging and competition
                teams through the year.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 text-xs dark:text-zinc-300 text-zinc-700">
                <div className="border dark:border-zinc-800 border-zinc-300 rounded-xl p-3 dark:bg-zinc-950/40 bg-white">
                  <p className="font-semibold mb-1">Foundation</p>
                  <p className="dark:text-zinc-500 text-zinc-600">
                    Basics of electronics, sensors, microcontrollers and CAD.
                  </p>
                </div>
                <div className="border dark:border-zinc-800 border-zinc-300 rounded-xl p-3 dark:bg-zinc-950/40 bg-white">
                  <p className="font-semibold mb-1">Build</p>
                  <p className="dark:text-zinc-500 text-zinc-600">
                    Focused project teams for college events and expos.
                  </p>
                </div>
                <div className="border dark:border-zinc-800 border-zinc-300 rounded-xl p-3 dark:bg-zinc-950/40 bg-white">
                  <p className="font-semibold mb-1">Research</p>
                  <p className="dark:text-zinc-500 text-zinc-600">
                    Experiments with autonomy, AI integration and advanced
                    control.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md self-stretch">
              <div className="relative border dark:border-zinc-800 border-zinc-300 rounded-2xl dark:bg-zinc-950/60 bg-white p-5 sm:p-6">
                <p className="text-[0.7rem] uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-600 mb-3">
                  Register Interest
                </p>
                <p className="text-xs dark:text-zinc-400 text-zinc-700 mb-4">
                  Official registrations happen via department notices and
                  campus drives. Share your mail and branch so we can notify you
                  about upcoming sessions.
                </p>

                <form className="flex flex-col gap-3 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.7rem] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-600">
                      College email
                    </label>
                    <input
                      type="email"
                      placeholder="you@gcek.ac.in"
                      className="h-9 rounded-full border
                        dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                        border-zinc-300 bg-white text-black placeholder:text-zinc-500
                        px-3 text-xs focus:outline-none focus:ring-1
                        dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                        focus:ring-zinc-600 focus:border-zinc-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.7rem] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-600">
                      Branch / Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ECE · S3"
                      className="h-9 rounded-full border
                        dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                        border-zinc-300 bg-white text-black placeholder:text-zinc-500
                        px-3 text-xs focus:outline-none focus:ring-1
                        dark:focus:ring-zinc-400 dark:focus:border-zinc-400
                        focus:ring-zinc-600 focus:border-zinc-600"
                    />
                  </div>

                  <button
                    type="button"
                    className="mt-2 inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-6 py-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition"
                  >
                    Coming soon
                  </button>
                </form>

                <p className="mt-4 text-[0.65rem] dark:text-zinc-600 text-zinc-500">
                  For collaborations or event invites, contact us through the
                  staff coordinator or official GCEK communication channels.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="w-full border-t dark:border-zinc-900 border-zinc-300
            dark:bg-zinc-950 bg-gray-50"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
            <div className="flex flex-col lg:flex-row gap-12 items-start">

              {/* Left */}
              <div className="flex-1 flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] dark:text-zinc-500 text-zinc-600">
                  <span className="h-px w-6 dark:bg-zinc-700 bg-zinc-400" />
                  Get in touch
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Contact us.
                </h2>
                <p className="text-sm dark:text-zinc-400 text-zinc-700 max-w-md leading-relaxed">
                  Have a question, want to collaborate, or looking to sponsor an event?
                  Reach out to the ROBOCEK team and we&apos;ll get back to you.
                </p>

                <div className="flex flex-col gap-3 mt-2">
                  {/* Email */}
                  <a
                    href="mailto:robocek@gcek.ac.in"
                    className="group flex items-center gap-4 rounded-2xl border
                      dark:border-zinc-800 border-zinc-300
                      dark:bg-zinc-900/40 bg-white
                      dark:hover:border-zinc-600 hover:border-zinc-500
                      p-4 transition-colors"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-full border dark:border-zinc-700 border-zinc-300
                      dark:bg-zinc-900 bg-zinc-100
                      flex items-center justify-center text-base">
                      ✉️
                    </div>
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-500 mb-0.5">
                        Official Email
                      </p>
                      <p className="text-sm font-medium dark:text-zinc-100 text-black group-hover:underline underline-offset-2">
                        robocek@gcek.ac.in
                      </p>
                    </div>
                    <span className="ml-auto text-xs dark:text-zinc-600 text-zinc-400 group-hover:dark:text-zinc-300 group-hover:text-zinc-700 transition">
                      ↗
                    </span>
                  </a>

                  {/* Location */}
                  <div className="flex items-center gap-4 rounded-2xl border
                    dark:border-zinc-800 border-zinc-300
                    dark:bg-zinc-900/40 bg-white
                    p-4">
                    <div className="h-10 w-10 shrink-0 rounded-full border dark:border-zinc-700 border-zinc-300
                      dark:bg-zinc-900 bg-zinc-100
                      flex items-center justify-center text-base">
                      📍
                    </div>
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-500 mb-0.5">
                        Location
                      </p>
                      <p className="text-sm font-medium dark:text-zinc-100 text-black">
                        ROBOCEK Lab
                      </p>
                      <p className="text-xs dark:text-zinc-500 text-zinc-600">
                        Govt. College of Engineering Kannur, Mangattuparamba
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-center gap-4 rounded-2xl border
                    dark:border-zinc-800 border-zinc-300
                    dark:bg-zinc-900/40 bg-white
                    p-4">
                    <div className="h-10 w-10 shrink-0 rounded-full border dark:border-zinc-700 border-zinc-300
                      dark:bg-zinc-900 bg-zinc-100
                      flex items-center justify-center text-base">
                      🕐
                    </div>
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.16em] dark:text-zinc-500 text-zinc-500 mb-0.5">
                        Lab Hours
                      </p>
                      <p className="text-sm font-medium dark:text-zinc-100 text-black">
                        Mon – Sat &nbsp;·&nbsp; 3 PM – 6 PM
                      </p>
                      <p className="text-xs dark:text-zinc-500 text-zinc-600">
                        During academic semester
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — quick message prompt */}
              <div className="flex-1 w-full max-w-md">
                <div className="relative rounded-2xl border dark:border-zinc-800 border-zinc-300
                  dark:bg-zinc-900/60 bg-white p-6 sm:p-8 overflow-hidden">
                  <div
                    className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full
                      dark:bg-zinc-700/20 bg-zinc-200/60 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative flex flex-col gap-5">
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-600 mb-1">
                        Send us a message
                      </p>
                      <p className="text-xs dark:text-zinc-400 text-zinc-700">
                        Drop us an email and we&apos;ll respond within a working day.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 text-xs">
                      <input
                        type="text"
                        placeholder="Your name"
                        className="h-9 rounded-full border
                          dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                          border-zinc-300 bg-white text-black placeholder:text-zinc-500
                          px-4 text-xs focus:outline-none focus:ring-1
                          dark:focus:ring-zinc-400 focus:ring-zinc-600"
                      />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="h-9 rounded-full border
                          dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                          border-zinc-300 bg-white text-black placeholder:text-zinc-500
                          px-4 text-xs focus:outline-none focus:ring-1
                          dark:focus:ring-zinc-400 focus:ring-zinc-600"
                      />
                      <textarea
                        rows={4}
                        placeholder="Your message..."
                        className="rounded-2xl border resize-none
                          dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-600
                          border-zinc-300 bg-white text-black placeholder:text-zinc-500
                          px-4 py-3 text-xs focus:outline-none focus:ring-1
                          dark:focus:ring-zinc-400 focus:ring-zinc-600"
                      />
                    </div>

                    <a
                      href="mailto:robocek@gcek.ac.in"
                      className="inline-flex items-center justify-center rounded-full
                        dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200
                        bg-black text-white hover:bg-zinc-800
                        px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition"
                    >
                      Send via Email
                    </a>

                    <p className="text-[0.65rem] dark:text-zinc-600 text-zinc-500 text-center">
                      Or email us directly at{" "}
                      <a
                        href="mailto:robocek@gcek.ac.in"
                        className="dark:text-zinc-400 text-zinc-600 underline underline-offset-2"
                      >
                        robocek@gcek.ac.in
                      </a>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.7rem] dark:text-zinc-500 text-zinc-600">
          <p>
            © {new Date().getFullYear()} ROBOCEK · Robotics Club, Government
            College of Engineering Kannur.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://robocek-components.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="dark:hover:text-zinc-200 hover:text-zinc-800 transition uppercase tracking-[0.16em] inline-flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Components Store
            </a>
            <span className="h-px w-6 dark:bg-zinc-700 bg-zinc-300" />
            <span className="uppercase tracking-[0.18em] dark:text-zinc-600 text-zinc-500">
              Designed in B/W
            </span>
            <span className="h-px w-10 dark:bg-zinc-700 bg-zinc-300" />
            <a
              href="#top"
              className="dark:hover:text-zinc-200 hover:text-zinc-800 transition uppercase tracking-[0.16em]"
            >
              Top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


