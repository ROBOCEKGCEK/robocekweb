"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
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
    authorName: "ROBOCEK Tech Team",
    description: "High-speed line follower robot using PID control algorithms, 8-channel IR sensor array, and STM32 microcontroller platform for national robotics challenges.",
    githubUrl: "https://github.com/ROBOCEKGCEK/lineFollowerBot",
    tags: ["Embedded C", "PID Control", "STM32", "Hardware"],
    createdAt: "2026-03-15",
  },
  {
    id: "sample-2",
    title: "ROS2 Swarm Robotics Platform",
    authorName: "Hardware & AI Lab",
    description: "Distributed swarm control framework for multi-agent obstacle avoidance, SLAM mapping, and dynamic path planning in indoor environments.",
    githubUrl: "https://github.com/ROBOCEKGCEK",
    tags: ["ROS2", "Python", "SLAM", "Robotics"],
    createdAt: "2026-02-28",
  },
  {
    id: "sample-3",
    title: "AI Visual Defect Inspector",
    authorName: "Computer Vision Division",
    description: "Real-time edge AI visual inspection system using YOLOv8 and OpenCV deployed on Jetson Nano for industrial PCB quality control.",
    githubUrl: "https://github.com/ROBOCEKGCEK",
    tags: ["Computer Vision", "YOLOv8", "Jetson Nano", "Python"],
    createdAt: "2026-01-20",
  },
  {
    id: "sample-4",
    title: "IoT Environmental Telemetry Node",
    authorName: "Embedded Systems Team",
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
    <div className="min-h-screen flex flex-col font-sans bg-white text-black dark:bg-black dark:text-zinc-50">
      <ThemeToggle />

      {/* HEADER */}
      <header className="w-full border-b dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-10 lg:px-16 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
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

          <nav className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-medium uppercase tracking-[0.12em]">
            <Link
              href="/events"
              className="dark:text-zinc-400 text-zinc-600 hover:dark:text-zinc-100 hover:text-black transition"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="dark:text-zinc-100 text-black font-semibold underline underline-offset-4"
            >
              Projects
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border
                dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
                border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
                px-3 py-1 sm:px-4 sm:py-1.5 transition"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-10 lg:px-16 py-6 sm:py-16">
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 border-b dark:border-zinc-800 border-zinc-200 pb-6 sm:pb-8">
          <div>
            <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
              ROBOCEK Innovation Hub
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mt-1.5 sm:mt-2">
              Project Hub
            </h1>
            <p className="text-xs sm:text-base dark:text-zinc-400 text-zinc-600 max-w-2xl mt-2 sm:mt-3 leading-relaxed">
              Explore hardware builds, autonomous robotics platforms, embedded firmware, and software innovations built by ROBOCEK members.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full dark:bg-zinc-50 bg-black px-4 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition shrink-0 w-full sm:w-auto"
          >
            + Publish Your Project
          </Link>
        </div>

        {/* SEARCH AND TAG FILTERS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search projects by title, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 rounded-full border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-white px-5 text-sm dark:text-zinc-100 text-black dark:placeholder:text-zinc-500 placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:focus:ring-zinc-400 focus:ring-zinc-600 transition"
            />
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition shrink-0 ${
                  selectedTag === tag
                    ? "dark:bg-zinc-100 bg-black dark:text-black text-white"
                    : "dark:bg-zinc-900 bg-zinc-100 dark:text-zinc-400 text-zinc-600 dark:hover:text-zinc-200 hover:text-black"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="rounded-3xl border dark:border-zinc-800 border-zinc-200 p-8 text-center text-sm dark:text-zinc-400 text-zinc-600">
            Loading projects from Firestore...
          </div>
        ) : null}

        {/* EMPTY STATE */}
        {!loading && filteredProjects.length === 0 ? (
          <div className="rounded-3xl border dark:border-zinc-800 border-zinc-200 p-12 text-center">
            <p className="text-lg font-medium mb-2">No projects found matching your search</p>
            <p className="text-xs dark:text-zinc-400 text-zinc-600 mb-6">
              Try adjusting your search terms or filter tags.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag("All");
              }}
              className="inline-flex items-center justify-center rounded-full border dark:border-zinc-700 border-zinc-300 px-5 py-2 text-xs font-medium uppercase tracking-[0.15em]"
            >
              Clear Filters
            </button>
          </div>
        ) : null}

        {/* PROJECT GRID */}
        {!loading && filteredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="flex flex-col justify-between rounded-3xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950/50 bg-white p-6 sm:p-8 hover:border-zinc-400 dark:hover:border-zinc-700 transition group"
              >
                <div>
                  {/* Top metadata */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      By <strong className="dark:text-zinc-200 text-zinc-800">{project.authorName}</strong>
                    </span>
                    {project.createdAt ? (
                      <span className="text-[0.7rem] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        {project.createdAt}
                      </span>
                    ) : null}
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-xl font-semibold tracking-tight mb-3 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition">
                    {project.title}
                  </h2>
                  <p className="text-xs sm:text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed mb-6">
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
                          className="rounded-md dark:bg-zinc-900 bg-zinc-100 dark:text-zinc-400 text-zinc-600 px-2.5 py-1 text-[0.7rem] font-mono"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* Links / Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t dark:border-zinc-900 border-zinc-100">
                    {project.githubUrl && project.githubUrl !== "#" ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full dark:bg-zinc-100 bg-black px-4 py-2 text-xs font-medium text-white dark:text-black hover:opacity-80 transition"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        View Code
                      </a>
                    ) : null}

                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border dark:border-zinc-700 border-zinc-300 px-4 py-2 text-xs font-medium hover:dark:border-zinc-500 hover:border-zinc-600 transition"
                      >
                        Live Demo ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.7rem] dark:text-zinc-500 text-zinc-600">
          <p>© {new Date().getFullYear()} ROBOCEK · Robotics Club GCE Kannur</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:dark:text-zinc-200 hover:text-zinc-800 transition uppercase tracking-[0.16em]">
              Home
            </Link>
            <Link href="/events" className="hover:dark:text-zinc-200 hover:text-zinc-800 transition uppercase tracking-[0.16em]">
              Events
            </Link>
            <Link href="/dashboard" className="hover:dark:text-zinc-200 hover:text-zinc-800 transition uppercase tracking-[0.16em]">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
