"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/client";

type ClubEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  venue: string;
  description: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  registrationUrl?: string;
  image?: string;
};

const sampleEvents: ClubEvent[] = [
  {
    id: "event-1",
    title: "ROBOCEK Annual Hackathon & Line Follower Clash",
    category: "Competition",
    date: "April 18-19, 2026",
    time: "09:00 AM IST",
    venue: "Main Auditorium, GCE Kannur",
    description: "24-hour hardware hackathon & autonomous line follower competition. Build, calibrate, and race your bot on complex track obstacle layouts.",
    status: "Upcoming",
    registrationUrl: "/register",
  },
  {
    id: "event-2",
    title: "Hands-on Embedded Systems & STM32 Boot Camp",
    category: "Workshop",
    date: "March 28, 2026",
    time: "10:00 AM IST",
    venue: "ROBOCEK Lab, Electrical Block",
    description: "Master STM32 HAL drivers, timers, interrupts, and motor control PWM for high-performance robotics applications.",
    status: "Upcoming",
    registrationUrl: "/register",
  },
  {
    id: "event-3",
    title: "PCB Design Masterclass with KiCAD",
    category: "Workshop",
    date: "February 14, 2026",
    time: "02:00 PM IST",
    venue: "CAD Lab, Mechanical Dept",
    description: "Learn schematic capture, component footprint generation, and multi-layer PCB layout routing for custom robot mainboards.",
    status: "Completed",
  },
  {
    id: "event-4",
    title: "ROS2 & Autonomous Mobile Robots Orientation",
    category: "Tech Talk",
    date: "January 22, 2026",
    time: "03:30 PM IST",
    venue: "Seminar Hall 2",
    description: "Introductory workshop on ROS2 nodes, publisher-subscriber communication, sensor fusion, and Gazebo robot simulations.",
    status: "Completed",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>(sampleEvents);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    async function fetchEvents() {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "events"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched: ClubEvent[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: data.title || "Untitled Event",
              category: data.category || "General",
              date: data.date || "TBA",
              time: data.time,
              venue: data.venue || "GCE Kannur Campus",
              description: data.description || "",
              status: data.status || "Upcoming",
              registrationUrl: data.registrationUrl,
              image: data.image,
            };
          });
          setEvents(fetched);
        }
      } catch {
        // Fall back to sample events if fetch fails
      } finally {
        setLoading(false);
      }
    }

    void fetchEvents();
  }, []);

  const categories = ["All", "Upcoming", "Workshop", "Competition", "Completed"];

  const filteredEvents = events.filter((ev) => {
    if (filterCategory === "All") return true;
    if (filterCategory === "Upcoming") return ev.status === "Upcoming";
    if (filterCategory === "Completed") return ev.status === "Completed";
    return ev.category.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-black dark:bg-black dark:text-zinc-50">
      <ThemeToggle />

      {/* HEADER */}
      <header className="w-full border-b dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
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
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4 text-xs font-medium uppercase tracking-[0.15em]">
            <Link
              href="/events"
              className="dark:text-zinc-100 text-black font-semibold underline underline-offset-4"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="dark:text-zinc-400 text-zinc-600 hover:dark:text-zinc-100 hover:text-black transition"
            >
              Projects
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border
                dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50
                border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black hover:bg-gray-100
                px-4 py-1.5 transition"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
        {/* HERO SECTION */}
        <div className="mb-12 border-b dark:border-zinc-800 border-zinc-200 pb-8">
          <span className="text-[0.7rem] uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
            ROBOCEK Club Activities
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mt-2">
            Events & Workshops
          </h1>
          <p className="text-sm sm:text-base dark:text-zinc-400 text-zinc-600 max-w-2xl mt-3 leading-relaxed">
            Hands-on technical boot camps, hackathons, guest lectures, and robotics competitions organized by ROBOCEK at GCE Kannur.
          </p>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-medium transition shrink-0 ${
                filterCategory === cat
                  ? "dark:bg-zinc-100 bg-black dark:text-black text-white"
                  : "dark:bg-zinc-900 bg-zinc-100 dark:text-zinc-400 text-zinc-600 dark:hover:text-zinc-200 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="rounded-3xl border dark:border-zinc-800 border-zinc-200 p-8 text-center text-sm dark:text-zinc-400 text-zinc-600">
            Loading events...
          </div>
        ) : null}

        {/* EVENTS LIST */}
        {!loading ? (
          <div className="space-y-6">
            {filteredEvents.map((ev) => (
              <article
                key={ev.id}
                className="rounded-3xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950/50 bg-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-400 dark:hover:border-zinc-700 transition"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ${
                        ev.status === "Upcoming"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : ev.status === "Ongoing"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800"
                      }`}
                    >
                      {ev.status}
                    </span>
                    <span className="text-xs font-mono dark:text-zinc-400 text-zinc-500">
                      {ev.category}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                    {ev.title}
                  </h2>

                  <p className="text-xs sm:text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed max-w-3xl">
                    {ev.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs dark:text-zinc-400 text-zinc-500 flex-wrap pt-2">
                    <span className="flex items-center gap-1.5">
                      🗓️ <strong>{ev.date}</strong> {ev.time ? `· ${ev.time}` : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      📍 {ev.venue}
                    </span>
                  </div>
                </div>

                {ev.status === "Upcoming" && ev.registrationUrl ? (
                  <div className="shrink-0 pt-2 md:pt-0">
                    <Link
                      href={ev.registrationUrl}
                      className="inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition"
                    >
                      Register Now →
                    </Link>
                  </div>
                ) : null}
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
            <Link href="/projects" className="hover:dark:text-zinc-200 hover:text-zinc-800 transition uppercase tracking-[0.16em]">
              Projects
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
