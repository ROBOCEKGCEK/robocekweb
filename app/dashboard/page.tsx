"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/client";
import MembershipCard from "./MembershipCard";

type UserProfile = {
  membershipId?: string | null;
  fullName: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  branch: string;
  yearSemester?: string;
  year?: string;
  interests?: string[];
  status?: string;
};

type UserProject = {
  id: string;
  title: string;
  authorName: string;
  description: string;
  githubUrl: string;
  demoUrl?: string;
  tags: string[];
  createdAt?: string;
};

const dashboardFeatures = [
  {
    title: "Announcements",
    description: "Catch up on club updates, deadlines, and new opportunities.",
  },
  {
    title: "Events Calendar",
    description: "Track workshops, meetings, and upcoming competitions.",
  },
  {
    title: "Project Hub",
    description: "Browse active teams, ideas, and where you can contribute.",
  },
  {
    title: "Resources",
    description: "Access documents, learning links, and member-only materials.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // User Published Projects State
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState("");
  const [publishError, setPublishError] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Form fields
  const [projectTitle, setProjectTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");

  const fetchUserProjects = async (uid: string, emailStr?: string | null) => {
    if (!db) return;
    try {
      const q = query(
        collection(db, "projects"),
        where("authorUid", "==", uid),
      );
      const snapshot = await getDocs(q);
      const projectsList: UserProject[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || "Untitled Project",
          authorName: data.authorName || "Member",
          description: data.description || "",
          githubUrl: data.githubUrl || "#",
          demoUrl: data.demoUrl,
          tags: Array.isArray(data.tags) ? data.tags : [],
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split("T")[0] : undefined,
        };
      });
      setUserProjects(projectsList);
    } catch {
      // Ignore if user has no projects or permissions missing
    }
  };

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      setErrorMessage("Firebase is not initialized. Check environment variables.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setErrorMessage("");

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data() as UserProfile;
          setProfile(profileData);
          setAuthorName(profileData.fullName || currentUser.displayName || currentUser.email || "");
        } else {
          // Fallback query by uid
          const userQuery = query(
            collection(db, "users"),
            where("uid", "==", currentUser.uid),
          );
          const snapshot = await getDocs(userQuery);

          if (!snapshot.empty) {
            const profileData = snapshot.docs[0].data() as UserProfile;
            setProfile(profileData);
            setAuthorName(profileData.fullName || currentUser.displayName || currentUser.email || "");
          } else {
            setProfile(null);
            setAuthorName(currentUser.displayName || currentUser.email || "");
            setErrorMessage("No user profile record was found for this account.");
          }
        }

        await fetchUserProjects(currentUser.uid, currentUser.email);
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "permission-denied") {
          setErrorMessage("Firestore permission denied. Please update Security Rules in your Firebase Console.");
        } else {
          setErrorMessage("Unable to load user profile right now.");
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handlePublishProject = async (e: FormEvent) => {
    e.preventDefault();
    setPublishError("");
    setPublishSuccess("");

    if (!user || !db) {
      setPublishError("You must be logged in to publish a project.");
      return;
    }

    const trimmedTitle = projectTitle.trim();
    const trimmedAuthor = authorName.trim() || profile?.fullName || user.email || "Member";
    const trimmedGithub = githubUrl.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle || !trimmedGithub || !trimmedDesc) {
      setPublishError("Project title, GitHub URL, and description are required.");
      return;
    }

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsPublishing(true);

    try {
      await addDoc(collection(db, "projects"), {
        title: trimmedTitle,
        authorName: trimmedAuthor,
        authorUid: user.uid,
        authorEmail: user.email,
        githubUrl: trimmedGithub,
        demoUrl: demoUrl.trim() || null,
        tags: tagsArray.length > 0 ? tagsArray : ["Robotics"],
        description: trimmedDesc,
        createdAt: serverTimestamp(),
      });

      setPublishSuccess("Project published successfully to Project Hub!");
      setProjectTitle("");
      setGithubUrl("");
      setDemoUrl("");
      setTagsInput("");
      setDescription("");
      setShowPublishModal(false);

      await fetchUserProjects(user.uid, user.email);
    } catch (err: unknown) {
      setPublishError(
        err instanceof Error ? err.message : "Failed to publish project.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!db || !user) return;
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteDoc(doc(db, "projects", projectId));
      await fetchUserProjects(user.uid, user.email);
    } catch {
      alert("Failed to delete project.");
    }
  };

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-zinc-50 font-sans">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-10 lg:px-16">
        {/* HEADER */}
        <header className="mb-6 sm:mb-10 flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
              ROBOCEK Member Area
            </p>
            <h1 className="mt-1 sm:mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Your personal control room for club updates, projects, and member-only resources.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-medium uppercase tracking-[0.15em] text-zinc-700 transition hover:border-zinc-800 hover:text-black dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
            >
              Events
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-medium uppercase tracking-[0.15em] text-zinc-700 transition hover:border-zinc-800 hover:text-black dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
            >
              Project Hub
            </Link>
            <Link
              href="/logout"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-medium uppercase tracking-[0.18em] text-zinc-700 transition hover:border-zinc-800 hover:text-black dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
            >
              Sign Out
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
            Loading your dashboard...
          </div>
        ) : null}

        {!loading && user ? (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
            <section className="space-y-6">
              {/* PROFILE SUMMARY CARD */}
              <div className="rounded-2xl sm:rounded-3xl border border-zinc-200 bg-zinc-50 p-4 sm:p-8 dark:border-zinc-800 dark:bg-zinc-950/40">
                <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Signed In As
                </p>
                <div className="mt-2 sm:mt-3 flex flex-col gap-1 sm:gap-2">
                  <h2 className="text-xl font-semibold sm:text-3xl">
                    {profile?.fullName ?? user.displayName ?? "Member"}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    {profile?.email ?? user.email}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                  <div className="rounded-xl sm:rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 dark:border-zinc-800 dark:bg-black/40">
                    <p className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                      Membership ID
                    </p>
                    <p className="mt-1 sm:mt-2 break-all text-xs sm:text-sm font-medium text-black dark:text-zinc-100">
                      {profile?.membershipId ? profile.membershipId : "Pending Admin Confirmation"}
                    </p>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 dark:border-zinc-800 dark:bg-black/40">
                    <p className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                      Branch
                    </p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-black dark:text-zinc-100">
                      {profile?.branch ?? "Not saved yet"}
                    </p>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 dark:border-zinc-800 dark:bg-black/40">
                    <p className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                      Batch
                    </p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-black dark:text-zinc-100">
                      {profile?.yearSemester || profile?.year || "Not saved yet"}
                    </p>
                  </div>
                  <div className="rounded-xl sm:rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 dark:border-zinc-800 dark:bg-black/40">
                    <p className="text-[0.62rem] sm:text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                      Interests
                    </p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-black dark:text-zinc-100">
                      {profile?.interests?.length ? profile.interests.length : 0} selected
                    </p>
                  </div>
                </div>
              </div>

              {/* DIGITAL MEMBERSHIP CARD SECTION */}
              <div className="rounded-2xl sm:rounded-3xl border border-emerald-900/40 bg-zinc-950 p-4 sm:p-8 relative overflow-hidden shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[0.68rem] uppercase tracking-[0.2em] font-mono text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      OFFICIAL ID CARD
                    </span>
                    <h3 className="text-xl font-semibold mt-2 text-white">Digital Membership Card</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                      Pitch-black & dark green ROBOCEK membership card credential. Available to verified members.
                    </p>
                  </div>
                </div>

                {profile?.membershipId &&
                profile.membershipId !== "Pending Admin Confirmation" &&
                (profile.status?.toLowerCase() === "approved" || profile.status?.toLowerCase() === "verified") ? (
                  <MembershipCard
                    fullName={profile?.fullName || user.displayName || "Member"}
                    membershipId={profile?.membershipId}
                    branch={profile?.branch}
                    yearSemester={profile?.yearSemester || profile?.year}
                    email={profile?.email || user.email}
                  />
                ) : (
                  <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">Verification Pending</h4>
                      <p className="mt-1 text-xs text-zinc-400 max-w-md mx-auto">
                        Your membership card will be unlocked and available to download once your account is verified and approved by a ROBOCEK administrator.
                      </p>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[0.7rem] uppercase tracking-wider font-mono text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                      Status: {profile?.status || "Pending Approval"}
                    </span>
                  </div>
                )}
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                  {errorMessage}
                </div>
              ) : null}

              {/* PUBLISH PROJECT SECTION */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950/50 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                      Showcase Your Work
                    </span>
                    <h3 className="text-xl font-semibold mt-1">Publish Project to Hub</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      Share your robotics builds, firmware, or hardware tools with the ROBOCEK community.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPublishModal(!showPublishModal)}
                    className="inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition shrink-0"
                  >
                    {showPublishModal ? "Cancel" : "+ New Project"}
                  </button>
                </div>

                {publishSuccess ? (
                  <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                    ✓ {publishSuccess}
                  </div>
                ) : null}

                {/* PUBLISH FORM MODAL/PANEL */}
                {showPublishModal ? (
                  <form onSubmit={handlePublishProject} className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    {publishError ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
                        {publishError}
                      </div>
                    ) : null}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
                          Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Autonomous Line Follower Bot"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
                          Author Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name or Team Name"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
                          GitHub Repository URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://github.com/username/repo"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
                          Live Demo / Video Link <span className="text-zinc-400">(Optional)</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://youtu.be/... or demo site"
                          value={demoUrl}
                          onChange={(e) => setDemoUrl(e.target.value)}
                          className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
                        Tech Stack & Tags <span className="text-zinc-400">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Embedded C, STM32, PID Control, ROS2"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="h-10 rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.7rem] uppercase tracking-wider text-zinc-500 font-medium">
                        Project Description & Remarks <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Explain the project features, hardware components used, algorithms, and results..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded-xl border border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-600 dark:focus:ring-zinc-400 resize-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isPublishing}
                        className="inline-flex items-center justify-center rounded-full dark:bg-zinc-50 bg-black px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] dark:text-black text-white dark:hover:bg-zinc-200 hover:bg-zinc-900 transition"
                      >
                        {isPublishing ? "Publishing..." : "Submit Project"}
                      </button>
                    </div>
                  </form>
                ) : null}

                {/* MY PUBLISHED PROJECTS LIST */}
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-sm font-semibold mb-4">Your Published Projects ({userProjects.length})</h4>
                  {userProjects.length === 0 ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      You haven't published any projects yet. Click "+ New Project" above to add your first build to Project Hub.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {userProjects.map((p) => (
                        <div
                          key={p.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 dark:bg-black/40 bg-zinc-50"
                        >
                          <div>
                            <h5 className="text-sm font-semibold">{p.title}</h5>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
                              {p.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {p.tags.map((t) => (
                                <span key={t} className="text-[0.65rem] font-mono px-2 py-0.5 rounded dark:bg-zinc-900 bg-zinc-200 text-zinc-600 dark:text-zinc-400">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              GitHub ↗
                            </a>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* DASHBOARD FEATURES GRID */}
              <div className="grid gap-4 sm:grid-cols-2">
                {dashboardFeatures.map((feature) => (
                  <article
                    key={feature.title}
                    className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/50"
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
                      Feature
                    </p>
                    <h3 className="mt-3 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {feature.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/40">
                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Quick Actions
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <Link
                    href="/projects"
                    className="block rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-800 dark:border-zinc-800 dark:bg-black/40 dark:hover:border-zinc-500"
                  >
                    Explore Project Hub
                  </Link>
                  <Link
                    href="/events"
                    className="block rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-800 dark:border-zinc-800 dark:bg-black/40 dark:hover:border-zinc-500"
                  >
                    View Upcoming Events
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-800 dark:border-zinc-800 dark:bg-black/40 dark:hover:border-zinc-500"
                  >
                    Update registration
                  </Link>
                  <a
                    href="mailto:robocek@gcek.ac.in"
                    className="block rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-800 dark:border-zinc-800 dark:bg-black/40 dark:hover:border-zinc-500"
                  >
                    Contact the team
                  </a>
                  <Link
                    href="/"
                    className="block rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-800 dark:border-zinc-800 dark:bg-black/40 dark:hover:border-zinc-500"
                  >
                    Back to home
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Member Snapshot
                </p>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Membership ID</dt>
                    <dd className="mt-1 break-all font-medium text-black dark:text-zinc-100">
                      {profile?.membershipId ? profile.membershipId : "Pending Admin Confirmation"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Phone</dt>
                    <dd className="mt-1 font-medium text-black dark:text-zinc-100">
                      {profile?.phoneNumber || profile?.phone || "Not saved yet"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Current Status</dt>
                    <dd
                      className={`mt-1 font-medium ${
                        profile?.status?.trim().toLowerCase() === "approved"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {profile?.status?.trim().toLowerCase() === "approved"
                        ? "Approved Member"
                        : profile?.status ?? "Pending Admin Confirmation"}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  );
}