"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import TiltCard from "../components/TiltCard";
import CyberBackground from "../components/CyberBackground";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/client";

type Project = {
  id: string;
  title: string;
  authorName: string;
  authorEmail?: string;
  description: string;
  githubUrl: string;
  demoUrl?: string;
  tags: string[];
  createdAt?: string;
};

const sampleProjects: Project[] = [
  {
    id: "sample-1",
    title: "Autonomous Line Follower & Maze Solver",
    authorName: "ROBOCEK members",
    description: "High-speed line follower robot using PID control algorithms, 8-channel IR sensor array, and STM32 microcontroller platform for national robotics challenges.",
    githubUrl: "https://github.com/ROBOCEKGCEK/lineFollowerBot",
    tags: ["Embedded C", "PID Control", "STM32", "Hardware"],
    createdAt: "2026-03-15",
  },
  {
    id: "sample-2",
    title: "ROS2 Swarm Robotics Platform",
    authorName: "ROBOCEK members",
    description: "Distributed swarm control framework for multi-agent obstacle avoidance, SLAM mapping, and dynamic path planning in indoor environments.",
    githubUrl: "https://github.com/ROBOCEKGCEK",
    tags: ["ROS2", "Python", "SLAM", "Robotics"],
    createdAt: "2026-02-28",
  },
  {
    id: "sample-3",
    title: "AI Visual Defect Inspector",
    authorName: "ROBOCEK members",
    description: "Real-time edge AI visual inspection system using YOLOv8 and OpenCV deployed on Jetson Nano for industrial PCB quality control.",
    githubUrl: "https://github.com/ROBOCEKGCEK",
    tags: ["Computer Vision", "YOLOv8", "Jetson Nano", "Python"],
    createdAt: "2026-01-20",
  },
  {
    id: "sample-4",
    title: "IoT Environmental Telemetry Node",
    authorName: "ROBOCEK members",
    description: "Low-power ESP32 sensor cluster for continuous lab environment monitoring, telemetry streaming over MQTT, and real-time dashboard analytics.",
    githubUrl: "https://github.com/ROBOCEKGCEK",
    tags: ["ESP32", "MQTT", "IoT", "C++"],
    createdAt: "2025-12-10",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  useEffect(() => {
    async function fetchProjects() {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched: Project[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: data.title || "Untitled Project",
              authorName: data.authorName || "ROBOCEK Member",
              authorEmail: data.authorEmail,
              description: data.description || "",
              githubUrl: data.githubUrl || "#",
              demoUrl: data.demoUrl,
              tags: Array.isArray(data.tags) ? data.tags : [],
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split("T")[0] : undefined,
            };
          });
          setProjects(fetched);
        }
      } catch {
        // Fall back to sample projects if Firestore fetch fails
      } finally {
        setLoading(false);
      }
    }

    void fetchProjects();
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    projects.forEach((p) => {
      p.tags.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === "All" || project.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [projects, searchQuery, selectedTag]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-[#030712] dark:text-zinc-50 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <CyberBackground />
      <ThemeToggle />

      {/* HEADER */}
      <header className="w-full border-b dark:border-cyan-500/20 border-slate-300 dark:bg-[#030712]/85 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
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
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-[0.25em] uppercase font-[family-name:var(--font-cyber)] text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 dark:from-cyan-400 dark:via-purple-300 dark:to-cyan-200">
                ROBOCEK
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                PROJECT HUB // ACTIVE BUILDS
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3 text-xs font-mono uppercase tracking-[0.14em]">
            <Link
              href="/events"
              className="px-3 py-1.5 rounded-lg border dark:border-zinc-800 border-zinc-300 text-zinc-600 dark:text-zinc-400 hover:text-cyan-400 transition"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-500/10 text-cyan-500 dark:text-cyan-300 font-semibold"
            >
              Projects
            </Link>
            <Link
              href="/downloads"
              className="px-3 py-1.5 rounded-lg border dark:border-zinc-800 border-zinc-300 text-zinc-600 dark:text-zinc-400 hover:text-cyan-400 transition"
            >
              Downloads
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold hover:opacity-90 transition"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 z-10">
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b dark:border-cyan-500/20 border-zinc-200">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-2">
              <span className="h-px w-6 bg-cyan-500" />
              Open Engineering Repository
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-cyber)]">
              Club Project Hub
            </h1>
            <p className="text-xs sm:text-base dark:text-zinc-300 text-zinc-600 max-w-2xl mt-3 leading-relaxed">
              Explore autonomous robotics prototypes, custom firmware codebases, embedded hardware designs, and AI perception pipelines built by ROBOCEK members.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 text-xs font-mono font-semibold uppercase tracking-[0.18em] text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition shrink-0"
          >
            <span>+ Publish Project</span>
          </Link>
        </div>

        {/* SEARCH AND TAG FILTERS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 font-mono text-xs">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="SEARCH BY BOT, TAG, OR AUTHOR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/80 bg-white px-4 text-xs dark:text-zinc-100 text-black dark:placeholder:text-zinc-600 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-mono transition shrink-0 border ${
                  selectedTag === tag
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 p-12 text-center text-sm font-mono text-cyan-400 animate-pulse">
            [ INITIALIZING TELEMETRY STREAM // LOADING PROJECTS... ]
          </div>
        ) : null}

        {/* EMPTY STATE */}
        {!loading && filteredProjects.length === 0 ? (
          <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 p-12 text-center font-mono">
            <p className="text-base font-semibold mb-2 text-zinc-300">No matching projects detected</p>
            <p className="text-xs text-zinc-500 mb-6">
              Refine your search parameters or reset tag filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag("All");
              }}
              className="inline-flex items-center justify-center rounded-lg border border-cyan-500/50 px-5 py-2 text-xs font-mono uppercase text-cyan-400 hover:bg-cyan-500/10"
            >
              Reset Filters
            </button>
          </div>
        ) : null}

        {/* PROJECT GRID */}
        {!loading && filteredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project, idx) => (
              <TiltCard
                key={project.id}
                glowColor={idx % 2 === 0 ? "cyan" : "purple"}
                className="flex flex-col justify-between dark:bg-zinc-950/70 bg-white p-6 sm:p-8 dark:border-zinc-800 border-zinc-200"
              >
                <div>
                  {/* Top metadata */}
                  <div className="flex items-center justify-between gap-3 mb-4 font-mono text-[11px]">
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                      BY // {project.authorName.toUpperCase()}
                    </span>
                    {project.createdAt ? (
                      <span className="text-zinc-500">
                        {project.createdAt}
                      </span>
                    ) : null}
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-3 font-[family-name:var(--font-cyber)] dark:text-white text-zinc-900 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-600 leading-relaxed mb-6 font-sans">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900/60 bg-zinc-100 text-zinc-400 px-2.5 py-0.5 text-[10px] font-mono"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* Links / Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t dark:border-zinc-900 border-zinc-100 font-mono text-xs">
                    {project.githubUrl && project.githubUrl !== "#" ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-cyan-500/20 border border-zinc-700 dark:border-cyan-400/50 px-4 py-2 text-white dark:text-cyan-300 hover:bg-cyan-500 hover:text-black transition"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>View Repository</span>
                      </a>
                    ) : null}

                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border dark:border-zinc-700 border-zinc-300 px-4 py-2 text-zinc-300 hover:text-white transition"
                      >
                        <span>Live Demo</span>
                        <span>↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        ) : null}
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t dark:border-cyan-500/20 border-zinc-300 dark:bg-[#02050c] bg-white py-6 mt-auto z-10 font-mono text-[11px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <p>© {new Date().getFullYear()} ROBOCEK · Robotics Club GCE Kannur</p>
          <div className="flex items-center gap-4 uppercase tracking-widest text-[10px]">
            <Link href="/" className="hover:text-cyan-400 transition">
              Home
            </Link>
            <Link href="/events" className="hover:text-cyan-400 transition">
              Events
            </Link>
            <Link href="/dashboard" className="hover:text-cyan-400 transition">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
