"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../firebase/client";

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
  hasRegistrationForm?: boolean;
  isPaid?: boolean;
  registrationFee?: string;
  whatsappGroupLink?: string;
  confirmationMessage?: string;
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
    hasRegistrationForm: true,
    isPaid: true,
    registrationFee: "₹100",
    confirmationMessage: "You are registered for ROBOCEK Hackathon 2026! Join the WhatsApp group for problem statements and track details.",
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
    hasRegistrationForm: true,
    isPaid: false,
    registrationFee: "Free",
    confirmationMessage: "Registration confirmed! Bring your laptop with STM32CubeIDE pre-installed.",
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

function formatFieldToString(val: any, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (typeof val.toDate === "function") {
      try {
        return val.toDate().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch {
        return fallback;
      }
    }
    if ("seconds" in val && typeof val.seconds === "number") {
      try {
        return new Date(val.seconds * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
  return String(val);
}

export default function EventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>(sampleEvents);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<ClubEvent | null>(null);
  const [regForm, setRegForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    branch: "",
    year: "",
    membershipId: "",
    utrNumber: "",
  });
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccessInfo, setRegSuccessInfo] = useState<{ message: string; whatsappLink?: string } | null>(null);
  const [qrLoadError, setQrLoadError] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u);
      if (u && db) {
        try {
          const userDoc = await getDoc(doc(db, "users", u.uid));
          if (userDoc.exists()) {
            const d = userDoc.data();
            setRegForm((prev) => ({
              ...prev,
              fullName: formatFieldToString(d.fullName, u.displayName || ""),
              email: formatFieldToString(d.email, u.email || ""),
              phone: formatFieldToString(d.phone || d.phoneNumber, ""),
              branch: formatFieldToString(d.branch, ""),
              year: formatFieldToString(d.yearSemester || d.year, ""),
              membershipId: formatFieldToString(d.membershipId, ""),
            }));
          } else {
            setRegForm((prev) => ({
              ...prev,
              fullName: u.displayName || "",
              email: u.email || "",
            }));
          }
        } catch (err) {
          console.warn("Could not prefill user profile:", err);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const eventsRef = collection(db, "events");
        const snapshot = await getDocs(eventsRef);
        if (!snapshot.empty) {
          const fetched: ClubEvent[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const rawStatus = formatFieldToString(data.status, "Upcoming");
            let finalStatus: "Upcoming" | "Ongoing" | "Completed" = "Upcoming";
            if (rawStatus.toLowerCase().includes("complete") || rawStatus.toLowerCase().includes("archived")) {
              finalStatus = "Completed";
            } else if (rawStatus.toLowerCase().includes("ongoing") || rawStatus.toLowerCase().includes("active")) {
              finalStatus = "Ongoing";
            } else if (rawStatus.toLowerCase().includes("upcoming")) {
              finalStatus = "Upcoming";
            }

            return {
              id: docSnap.id,
              title: formatFieldToString(data.title, "Untitled Event"),
              category: formatFieldToString(data.category, "Workshop"),
              date: formatFieldToString(data.date, "TBA"),
              time: formatFieldToString(data.time, ""),
              venue: formatFieldToString(data.venue || data.location, "GCE Kannur Campus"),
              description: formatFieldToString(data.description, ""),
              status: finalStatus,
              registrationUrl: typeof data.registrationUrl === "string" ? data.registrationUrl : undefined,
              image: typeof (data.imageUrl || data.image) === "string" ? (data.imageUrl || data.image) : undefined,
              hasRegistrationForm: Boolean(data.hasRegistrationForm),
              isPaid: Boolean(data.isPaid),
              registrationFee: formatFieldToString(data.registrationFee, "₹50"),
              whatsappGroupLink: formatFieldToString(data.whatsappGroupLink, ""),
              confirmationMessage: formatFieldToString(
                data.confirmationMessage,
                "You are registered successfully! Go on and join the official WhatsApp group for updates."
              ),
            };
          });
          setEvents(fetched);

          // Auto-open registration modal if URL query has ?register=id or ?form=id
          if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const autoTarget = urlParams.get("register") || urlParams.get("form");
            if (autoTarget && fetched.length > 0) {
              const targetClean = autoTarget.trim().toLowerCase();
              const found = fetched.find(
                (e) =>
                  e.id.toLowerCase() === targetClean ||
                  e.title.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/^-+|-+$/g, "") === targetClean
              );
              if (found && (found.hasRegistrationForm || found.registrationUrl)) {
                setRegisteringEvent(found);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch events from Firestore:", err);
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

  const handleOpenRegistration = (ev: ClubEvent) => {
    setRegisteringEvent(ev);
    setRegError("");
    setRegSuccessInfo(null);
    setQrLoadError(false);
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !registeringEvent) return;
    setRegError("");

    if (!regForm.fullName.trim() || !regForm.email.trim() || !regForm.phone.trim()) {
      setRegError("Please fill in your Full Name, Email Address, and Mobile Phone Number.");
      return;
    }

    if (registeringEvent.isPaid) {
      const cleanUtr = regForm.utrNumber.trim();
      if (!cleanUtr || cleanUtr.length < 6) {
        setRegError("Please enter your 12-digit UPI UTR / Transaction Reference Number.");
        return;
      }
    }

    setIsSubmittingReg(true);

    try {
      const regPayload = {
        eventId: registeringEvent.id,
        eventTitle: registeringEvent.title,
        userId: currentUser?.uid || null,
        fullName: regForm.fullName.trim(),
        email: regForm.email.trim().toLowerCase(),
        phone: regForm.phone.trim(),
        branch: regForm.branch.trim(),
        year: regForm.year.trim(),
        membershipId: regForm.membershipId.trim() || null,
        utrNumber: registeringEvent.isPaid ? regForm.utrNumber.trim() : "N/A",
        paymentStatus: registeringEvent.isPaid ? "Pending" : "Verified",
        registeredAt: new Date().toISOString(),
      };

      const eventRegRef = collection(db, "events", registeringEvent.id, "registrations");
      await addDoc(eventRegRef, regPayload);

      setRegSuccessInfo({
        message:
          registeringEvent.confirmationMessage ||
          "You are registered successfully! Go on and join the official WhatsApp group for updates.",
        whatsappLink: registeringEvent.whatsappGroupLink,
      });
    } catch (err: any) {
      console.error("Error submitting registration:", err);
      setRegError("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmittingReg(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans dark:bg-black dark:text-zinc-50 bg-zinc-50 text-zinc-900 transition-colors duration-200">
      <header className="w-full border-b dark:border-zinc-900 border-zinc-200 dark:bg-black/90 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm sm:text-base font-bold tracking-widest uppercase font-mono dark:text-white text-zinc-900">
              ROBOCEK <span className="text-zinc-500 font-normal">EVENTS</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs px-4 py-1.5 rounded-full border dark:border-zinc-800 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 dark:text-zinc-300 text-zinc-700 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
        <div className="space-y-4 mb-10">
          <span className="px-3 py-1 rounded-full text-[0.65rem] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
            Robotics Club GCE Kannur
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Events & Workshops
          </h1>
          <p className="text-xs sm:text-sm dark:text-zinc-400 text-zinc-600 max-w-2xl leading-relaxed">
            Hands-on technical boot camps, autonomous bot hackathons, masterclasses, and national hardware expos hosted by ROBOCEK.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                filterCategory === cat
                  ? "dark:bg-white bg-black dark:text-black text-white"
                  : "dark:bg-zinc-900 bg-zinc-200/80 dark:text-zinc-400 text-zinc-600 dark:hover:text-white hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-3xl border dark:border-zinc-800 border-zinc-200 p-8 text-center text-sm dark:text-zinc-400 text-zinc-600">
            Loading events...
          </div>
        ) : null}

        {!loading ? (
          <div className="space-y-6">
            {filteredEvents.map((ev) => (
              <article
                key={ev.id}
                className="rounded-3xl border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950/50 bg-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-400 dark:hover:border-zinc-700 transition shadow-sm"
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
                    {ev.hasRegistrationForm && (
                      <span className="rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {ev.isPaid ? `Paid (${ev.registrationFee || "₹50"})` : "Free Event"}
                      </span>
                    )}
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

                {ev.status === "Upcoming" && (ev.hasRegistrationForm || ev.registrationUrl) ? (
                  <div className="shrink-0 pt-2 md:pt-0">
                    {ev.hasRegistrationForm ? (
                      <button
                        onClick={() => handleOpenRegistration(ev)}
                        className="inline-flex items-center justify-center rounded-full dark:bg-emerald-500 bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-emerald-400 transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                      >
                        Register Now {ev.isPaid ? `(${ev.registrationFee || "₹50"})` : "(Free)"} →
                      </button>
                    ) : ev.registrationUrl ? (
                      <a
                        href={ev.registrationUrl}
                        target={ev.registrationUrl.startsWith("http") ? "_blank" : "_self"}
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition"
                      >
                        Register External →
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </main>

      {registeringEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-white p-6 sm:p-8 shadow-2xl my-8 dark:text-white text-zinc-900">
            <div className="flex items-center justify-between pb-4 border-b dark:border-zinc-800 border-zinc-200 mb-5">
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider font-semibold text-emerald-500 font-mono">
                  Event Registration · {registeringEvent.isPaid ? `Fee: ${registeringEvent.registrationFee || "₹50"}` : "Free"}
                </span>
                <h2 className="text-lg font-bold mt-0.5">{registeringEvent.title}</h2>
              </div>
              <button
                onClick={() => setRegisteringEvent(null)}
                className="text-zinc-400 hover:text-zinc-200 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {regSuccessInfo ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl animate-bounce">
                  ✓
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-emerald-400">Registration Confirmed!</h3>
                  <p className="text-xs dark:text-zinc-300 text-zinc-700 leading-relaxed max-w-md mx-auto">
                    {regSuccessInfo.message}
                  </p>
                </div>

                {regSuccessInfo.whatsappLink ? (
                  <div className="pt-2">
                    <a
                      href={regSuccessInfo.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider transition shadow-xl shadow-emerald-600/30"
                    >
                      💬 Join Official WhatsApp Group
                    </a>
                    <p className="text-[0.65rem] text-zinc-500 mt-2">
                      Join for important schedule updates, venue announcements, and Q&A.
                    </p>
                  </div>
                ) : null}

                <div className="pt-4">
                  <button
                    onClick={() => setRegisteringEvent(null)}
                    className="w-full py-3 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900 bg-zinc-100 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegistrationSubmit} className="space-y-4 text-xs">
                {regError ? (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    ⚠️ {regError}
                  </div>
                ) : null}

                <div>
                  <label className="block uppercase font-medium text-zinc-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    className="w-full h-10 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-medium text-zinc-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@gcek.ac.in"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full h-10 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-medium text-zinc-400 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile no."
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full h-10 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-medium text-zinc-400 mb-1">Branch / Department</label>
                    <input
                      type="text"
                      placeholder="e.g. ECE / EEE / CSE / ME"
                      value={regForm.branch}
                      onChange={(e) => setRegForm({ ...regForm, branch: e.target.value })}
                      className="w-full h-10 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-medium text-zinc-400 mb-1">Year / Semester</label>
                    <input
                      type="text"
                      placeholder="e.g. S4 / 2nd Year"
                      value={regForm.year}
                      onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                      className="w-full h-10 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {registeringEvent.isPaid && (
                  <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                        💳 UPI Payment Required ({registeringEvent.registrationFee || "₹50"})
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/40 border border-zinc-800 text-center">
                      {!qrLoadError ? (
                        <Image
                          src="/qr.jpg"
                          alt="ROBOCEK UPI Payment QR"
                          width={160}
                          height={160}
                          className="rounded-lg mb-2 object-contain"
                          onError={() => setQrLoadError(true)}
                        />
                      ) : (
                        <div className="w-36 h-36 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center p-3 mb-2">
                          <span className="text-2xl mb-1">📲</span>
                          <span className="text-[0.65rem] text-amber-300 font-semibold uppercase">Scan UPI QR</span>
                          <span className="text-[0.6rem] text-zinc-500">Scan & Pay fee</span>
                        </div>
                      )}
                      <p className="text-[0.65rem] text-zinc-400 leading-snug">
                        Scan QR code using GPay / PhonePe / Paytm to pay <strong>{registeringEvent.registrationFee || "₹50"}</strong>.
                      </p>
                    </div>

                    <div>
                      <label className="block uppercase font-semibold text-amber-300 mb-1">
                        12-Digit UPI UTR / Transaction Reference ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 423819028312"
                        value={regForm.utrNumber}
                        onChange={(e) => setRegForm({ ...regForm, utrNumber: e.target.value })}
                        className="w-full h-10 rounded-xl border border-amber-500/40 bg-black px-3 text-xs text-amber-200 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <p className="text-[0.6rem] text-zinc-500 mt-1">
                        Find the 12-digit UTR or Transaction Ref No on your payment confirmation screen.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-zinc-800 border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setRegisteringEvent(null)}
                    className="px-4 py-2 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900 bg-zinc-100 text-zinc-400 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReg}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold uppercase tracking-wider text-xs transition disabled:opacity-50 shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmittingReg ? "Submitting Registration..." : "Complete Registration"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
