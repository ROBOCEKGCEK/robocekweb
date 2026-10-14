"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import UiIcon from "../components/UiIcon";
import TiltCard from "../components/TiltCard";
import CyberBackground from "../components/CyberBackground";

type Member = {
  role: string;
  name: string;
  photo?: string | null;
  category: "core" | "extended" | "media";
  department?: string;
};

const execomMembers: Member[] = [
  // Core Committee
  { role: "President", name: "Harikesh O P", photo: "/execom/president.jpg", category: "core", department: "ECE · Final Year" },
  { role: "Vice President", name: "Vismaya P", photo: "/execom/Vismaya.jpg", category: "core", department: "EEE · Final Year" },
  { role: "Secretary", name: "Rahul S", photo: "/execom/rahul.jpg", category: "core", department: "ME · Final Year" },
  { role: "Treasurer", name: "Alex K Joseph", photo: "/execom/Alex.jpg", category: "core", department: "ECE · Final Year" },
  { role: "Project Manager", name: "Arjav P", photo: "/execom/Arjav.jpg", category: "core", department: "CSE · Final Year" },
  { role: "Chief Technical Lead", name: "Shan Francis", photo: "/execom/shan.jpg", category: "core", department: "ECE · Final Year" },
  { role: "Outreach Head", name: "Yadhu Krishna P", photo: "/execom/yadu.jpg", category: "core", department: "ME · Final Year" },
  { role: "Documentation Head", name: "Sooryadath P K", photo: "/execom/surya.jpg", category: "core", department: "ECE · Final Year" },
  { role: "Alumni Connect", name: "Gopika P E", photo: "/execom/Gopika.jpg", category: "core", department: "CE · Final Year" },

  // Extended Team
  { role: "Component Manager", name: "Arjun K", photo: "/execom/arjun.jpg", category: "extended", department: "ECE · Third Year" },
  { role: "Component Manager", name: "Richard Chinthu", photo: "/execom/richard.jpg", category: "extended", department: "EEE · Third Year" },
  { role: "Social Media Strategist", name: "Prarthana VP", photo: "/execom/Prarthana.JPG", category: "extended", department: "CSE · Third Year" },
  { role: "Event Manager", name: "Keerthana D Nair", photo: "/execom/Keerthana.jpg", category: "extended", department: "ECE · Third Year" },
  { role: "Event Manager", name: "Goutham Krishna", photo: "/execom/goutham.jpg", category: "extended", department: "ME · Third Year" },
  { role: "Event Manager", name: "Sayanthana S", photo: "/execom/sayanthana.jpg", category: "extended", department: "EEE · Third Year" },

  // Media & Design Team
  { role: "Media Head", name: "Joshna KM", photo: "/execom/joshna.jpg", category: "media", department: "CSE · Third Year" },
  { role: "Media Team", name: "Rekha PK", photo: "/execom/rekha.jpg", category: "media", department: "ECE · Third Year" },
  { role: "Media Team", name: "Dhanush VK", photo: "/execom/dhanush.jpg", category: "media", department: "ME · Third Year" },
];

export default function ExecomPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "core" | "extended" | "media">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = useMemo(() => {
    return execomMembers.filter((m) => {
      const matchesCat = selectedCategory === "all" || m.category === selectedCategory;
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.department && m.department.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
                EXECOM DIRECTORY // 2026
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3 text-xs font-mono uppercase tracking-[0.14em]">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg border dark:border-zinc-800 border-zinc-300 text-zinc-600 dark:text-zinc-400 hover:text-cyan-400 transition"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="px-3 py-1.5 rounded-lg border dark:border-zinc-800 border-zinc-300 text-zinc-600 dark:text-zinc-400 hover:text-cyan-400 transition"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="px-3 py-1.5 rounded-lg border dark:border-zinc-800 border-zinc-300 text-zinc-600 dark:text-zinc-400 hover:text-cyan-400 transition"
            >
              Projects
            </Link>
            <Link
              href="/execom"
              className="px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-500/10 text-cyan-500 dark:text-cyan-300 font-semibold"
            >
              ExeCom
            </Link>
            <Link
              href="/downloads"
              className="px-3 py-1.5 rounded-lg border dark:border-zinc-800 border-zinc-300 text-zinc-600 dark:text-zinc-400 hover:text-cyan-400 transition"
            >
              Downloads
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold hover:opacity-90 transition"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 z-10">
        {/* HERO TITLE & INTRO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b dark:border-cyan-500/20 border-zinc-200">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-2">
              <span className="h-px w-6 bg-cyan-500" />
              Leadership &amp; Operations Protocol
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-[family-name:var(--font-cyber)]">
              ROBOCEK &apos;26 ExeCom
            </h1>
            <p className="text-xs sm:text-base dark:text-zinc-300 text-zinc-600 max-w-2xl mt-3 leading-relaxed">
              Meet the executive committee, project leads, technical directors, and media specialists driving the robotics ecosystem at Government College of Engineering Kannur.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3.5 py-1.5 rounded-xl border dark:border-cyan-500/30 border-cyan-600/30 dark:bg-cyan-950/20 bg-cyan-50 text-cyan-600 dark:text-cyan-300">
              ACTIVE CADRE: {execomMembers.length} MEMBERS
            </span>
          </div>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 font-mono text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Members" },
              { id: "core", label: "Core Committee" },
              { id: "extended", label: "Extended Team" },
              { id: "media", label: "Media & Design" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`rounded-xl px-4 py-2 font-mono text-xs uppercase tracking-wider transition whitespace-nowrap border ${
                  selectedCategory === tab.id
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-bold"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="SEARCH BY NAME OR ROLE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950/80 bg-white px-4 text-xs dark:text-zinc-100 text-black dark:placeholder:text-zinc-600 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>

        {/* EXECOM MEMBERS GRID */}
        {filteredMembers.length === 0 ? (
          <div className="rounded-2xl border dark:border-zinc-800 border-zinc-200 p-12 text-center font-mono">
            <p className="text-sm text-zinc-400">No members match your search criteria.</p>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMembers.map((m, idx) => {
              const glow = m.category === "core" ? "cyan" : m.category === "extended" ? "purple" : "emerald";
              return (
                <TiltCard
                  key={`${m.role}-${m.name}-${idx}`}
                  glowColor={glow}
                  className="dark:bg-zinc-950/70 bg-white dark:border-zinc-800 border-zinc-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-[3/4] dark:bg-zinc-900 bg-zinc-100 border-b dark:border-zinc-800 border-zinc-200 overflow-hidden">
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <UiIcon name="user" className="h-8 w-8 opacity-20" />
                        <span className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-500">
                          Photo
                        </span>
                      </div>
                    )}

                    {/* Category Pill on Photo */}
                    <div className="absolute top-2 left-2 z-20">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-md border ${
                        m.category === "core"
                          ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
                          : m.category === "extended"
                          ? "bg-purple-950/80 text-purple-300 border-purple-500/40"
                          : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                      }`}>
                        {m.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col">
                    <p className={`text-[10px] font-mono uppercase tracking-[0.16em] mb-1 font-semibold ${
                      m.category === "core"
                        ? "text-cyan-600 dark:text-cyan-400"
                        : m.category === "extended"
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {m.role}
                    </p>
                    <p className="text-sm font-bold dark:text-zinc-100 text-black leading-snug">
                      {m.name}
                    </p>
                    {m.department && (
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">
                        {m.department}
                      </p>
                    )}
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}
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
            <Link href="/projects" className="hover:text-cyan-400 transition">
              Projects
            </Link>
            <Link href="/downloads" className="hover:text-cyan-400 transition">
              Downloads
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
