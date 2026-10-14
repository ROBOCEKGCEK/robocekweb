"use client";

import Link from "next/link";
import Image from "next/image";
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
import UiIcon from "../components/UiIcon";
import MembershipCard from "./MembershipCard";
import HoloMembershipCard from "../components/HoloMembershipCard";
import PasswordResetModal from "./PasswordResetModal";
import EditProfileModal from "./EditProfileModal";
import CyberBackground from "../components/CyberBackground";
import TiltCard from "../components/TiltCard";

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
  mustChangePassword?: boolean;
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
    tag: "COMMS // PRIORITY",
    description: "Catch up on club directives, lab access windows, hackathon deadlines, and telemetry releases.",
  },
  {
    title: "Events Calendar",
    tag: "TIMELINE // WORKSHOPS",
    description: "Track robotics bootcamps, hardware hackathons, guest lectures, and inter-college competitions.",
  },
  {
    title: "Project Hub",
    tag: "ENGINEERING // REPO",
    description: "Inspect collaborative firmware repos, bot designs, CAD blueprints, and sensor fusion modules.",
  },
  {
    title: "Lab Resources",
    tag: "ARCHIVE // HARDWARE",
    description: "Access datasheet library, PlatformIO development boilerplates, and component inventory checkout.",
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
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [use3dCard, setUse3dCard] = useState(true);

  // Form fields
  const [projectTitle, setProjectTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");

  const fetchUserProjects = async (uid: string, _emailStr?: string | null) => {
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

  const handlePasswordResetSuccess = () => {
    if (profile) {
      setProfile({ ...profile, mustChangePassword: false });
    }
  };

  const isApproved =
    profile?.membershipId &&
    profile.membershipId !== "Pending Admin Confirmation" &&
    (profile.status?.toLowerCase() === "approved" || profile.status?.toLowerCase() === "verified");

  return (
    <main className="min-h-screen bg-[#030712] text-zinc-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <CyberBackground />

      {profile?.mustChangePassword ? (
        <PasswordResetModal onSuccess={handlePasswordResetSuccess} />
      ) : null}

      {showEditProfileModal && user ? (
        <EditProfileModal
          profile={profile}
          userUid={user.uid}
          onClose={() => setShowEditProfileModal(false)}
          onUpdate={(updated) => setProfile(updated)}
        />
      ) : null}

      {/* FUTURISTIC HUD NAVIGATION HEADER */}
      <header className="w-full border-b border-cyan-500/20 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-40">
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
                  COMMAND
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                MEMBER DASHBOARD
              </p>
            </div>
          </Link>

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
              className="px-3 sm:px-4 py-1.5 rounded-full border border-zinc-800 hover:border-cyan-500/40 text-zinc-400 hover:text-cyan-300 bg-zinc-950/60 hover:bg-cyan-950/20 text-[11px] font-mono tracking-wider transition"
            >
              [04] Downloads
            </Link>
            <Link
              href="/logout"
              className="px-3.5 py-1.5 rounded-full border border-red-500/40 text-red-400 hover:bg-red-950/30 text-[11px] font-mono tracking-wider transition"
            >
              Sign Out ⎋
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-65px)] w-full max-w-7xl flex-col px-4 py-8 sm:px-8 lg:px-12 relative z-10">
        {/* DASHBOARD HERO BANNER */}
        <div className="mb-8 flex flex-col gap-4 border-b border-cyan-500/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
              <p className="text-[0.65rem] sm:text-[0.7rem] uppercase font-mono tracking-[0.25em] text-cyan-400">
                SYS.TERMINAL // TELEMETRY LINK ACTIVE
              </p>
            </div>
            <h1 className="mt-2 text-2xl sm:text-4xl font-orbitron font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              Command Center
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-zinc-400 font-sans">
              Welcome back. Manage your digital membership credentials, track published engineering projects, and access exclusive lab resources.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEditProfileModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 text-xs font-mono font-semibold tracking-wider transition shadow-[0_0_15px_rgba(0,240,255,0.15)] cursor-pointer"
            >
              <span>⚙</span> Edit Telemetry Record
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-cyan-500/30 bg-zinc-950/80 p-8 text-center text-sm font-mono text-cyan-400 flex flex-col items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            <span className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Establishing Secure Session Stream...</span>
          </div>
        ) : null}

        {!loading && user ? (
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
            <section className="space-y-8">
              {/* PROFILE SUMMARY TILT CARD */}
              <TiltCard className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-zinc-950/90 to-[#030712]/90 p-6 sm:p-8 shadow-[0_0_30px_rgba(0,240,255,0.08)] relative overflow-hidden">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <p className="text-[0.65rem] sm:text-[0.7rem] uppercase font-mono tracking-[0.24em] text-cyan-400">
                      AUTHENTICATED PROFILE
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-zinc-800 bg-black/60 text-zinc-400">
                    UID: {user.uid.slice(0, 8)}...
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  <h2 className="text-xl sm:text-3xl font-orbitron font-bold text-white">
                    {profile?.fullName ?? user.displayName ?? "ROBOCEK Engineer"}
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-zinc-400">
                    {profile?.email ?? user.email}
                  </p>
                </div>

                {/* Telemetry Stats Grid */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 font-mono">
                  <div className="rounded-2xl border border-zinc-800 bg-black/60 p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-zinc-500">
                      Member ID
                    </p>
                    <p className="mt-1.5 text-xs font-bold text-cyan-400 break-all">
                      {profile?.membershipId ? profile.membershipId : "PENDING CONFIRM"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/60 p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-zinc-500">
                      Branch
                    </p>
                    <p className="mt-1.5 text-xs font-bold text-white">
                      {profile?.branch ?? "Not saved"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/60 p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-zinc-500">
                      Batch
                    </p>
                    <p className="mt-1.5 text-xs font-bold text-white">
                      {profile?.yearSemester || profile?.year || "Not saved"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/60 p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-zinc-500">
                      Specialties
                    </p>
                    <p className="mt-1.5 text-xs font-bold text-purple-400">
                      {profile?.interests?.length ? `${profile.interests.length} Domains` : "0 Domains"}
                    </p>
                  </div>
                </div>
              </TiltCard>

              {/* DIGITAL MEMBERSHIP CARD SECTION */}
              <div className="rounded-3xl border border-cyan-500/30 bg-zinc-950/80 p-6 sm:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[0.68rem] uppercase tracking-[0.2em] font-mono text-cyan-300 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      OFFICIAL CREDENTIAL // NFC PASS
                    </span>
                    <h3 className="text-xl font-orbitron font-bold mt-2 text-white">
                      Digital Membership Card
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl font-sans">
                      Holographic ROBOCEK pass with tamper-proof security watermark. Interactive 3D tilt tracking.
                    </p>
                  </div>

                  {isApproved && (
                    <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[10px]">
                      <button
                        onClick={() => setUse3dCard(true)}
                        className={`px-3 py-1.5 rounded-lg border transition ${
                          use3dCard
                            ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                            : "border-zinc-800 text-zinc-500 hover:text-white"
                        }`}
                      >
                        3D Hologram
                      </button>
                      <button
                        onClick={() => setUse3dCard(false)}
                        className={`px-3 py-1.5 rounded-lg border transition ${
                          !use3dCard
                            ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                            : "border-zinc-800 text-zinc-500 hover:text-white"
                        }`}
                      >
                        Printable View
                      </button>
                    </div>
                  )}
                </div>

                {isApproved ? (
                  use3dCard ? (
                    <div className="py-2 flex justify-center">
                      <HoloMembershipCard
                        fullName={profile?.fullName || user.displayName || "ROBOCEK Engineer"}
                        membershipId={profile?.membershipId || "RBC-2026-0001"}
                        branch={profile?.branch || "ECE"}
                        yearSemester={profile?.yearSemester || profile?.year || "2k26"}
                        email={profile?.email || user.email || ""}
                      />
                    </div>
                  ) : (
                    <MembershipCard
                      fullName={profile?.fullName || user.displayName || "Member"}
                      membershipId={profile?.membershipId}
                      branch={profile?.branch}
                      yearSemester={profile?.yearSemester || profile?.year}
                      email={profile?.email || user.email}
                    />
                  )
                ) : (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-8 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <UiIcon name="lock" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-orbitron font-bold text-white">
                        Credential Pending Verification
                      </h4>
                      <p className="mt-1 text-xs text-zinc-400 max-w-md mx-auto font-sans leading-relaxed">
                        Your interactive 3D holographic membership card will automatically activate once your registration details are verified by a club executive.
                      </p>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-[0.7rem] uppercase tracking-wider font-mono text-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                      Status: {profile?.status || "Pending Approval"}
                    </span>
                  </div>
                )}
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-950/40 p-4 text-xs font-mono text-amber-300">
                  {errorMessage}
                </div>
              ) : null}

              {/* PUBLISH PROJECT SECTION */}
              <div className="rounded-3xl border border-cyan-500/30 bg-zinc-950/80 p-6 sm:p-8 shadow-[0_0_30px_rgba(0,240,255,0.08)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[0.65rem] uppercase font-mono tracking-[0.2em] text-cyan-400">
                      PROJECT REGISTRY // SHOWCASE
                    </span>
                    <h3 className="text-xl font-orbitron font-bold mt-1 text-white">
                      Publish to Project Hub
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-sans">
                      Share your robotics builds, firmware repos, or sensor boards with the GCEK community.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPublishModal(!showPublishModal)}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-orbitron font-bold px-5 py-2.5 text-xs tracking-wider uppercase transition shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0 cursor-pointer"
                  >
                    {showPublishModal ? "Cancel" : "+ Deploy Project"}
                  </button>
                </div>

                {publishSuccess ? (
                  <div className="mb-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/40 p-4 text-xs font-mono text-cyan-300">
                    <UiIcon name="check" className="mr-1.5 inline h-4 w-4 align-text-bottom" />
                    {publishSuccess}
                  </div>
                ) : null}

                {/* PUBLISH FORM */}
                {showPublishModal ? (
                  <form onSubmit={handlePublishProject} className="space-y-4 pt-4 border-t border-zinc-800 font-mono text-xs">
                    {publishError ? (
                      <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-red-300">
                        {publishError}
                      </div>
                    ) : null}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
                          Project Title <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Autonomous Line Follower Bot"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          className="h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 px-4 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
                          Author Name <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name or Team Name"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          className="h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 px-4 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
                          GitHub Repository URL <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://github.com/username/repo"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className="h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 px-4 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
                          Demo / YouTube Link <span className="text-zinc-600">(Optional)</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://youtu.be/... or demo URL"
                          value={demoUrl}
                          onChange={(e) => setDemoUrl(e.target.value)}
                          className="h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 px-4 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
                        Tech Stack &amp; Tags <span className="text-zinc-600">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Embedded C, STM32, PID Control, ROS2"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="h-11 rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 px-4 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[0.7rem] uppercase tracking-wider text-zinc-400 font-medium">
                        Project Overview &amp; Hardware Specs <span className="text-cyan-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Detail the hardware specs, microcontrollers, motor drivers, PID tuning, and results..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded-xl border border-zinc-800 bg-black/80 text-zinc-100 p-3.5 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isPublishing}
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-orbitron font-bold px-6 py-2.5 text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50 cursor-pointer"
                      >
                        {isPublishing ? "Syncing..." : "Submit to Hub"}
                      </button>
                    </div>
                  </form>
                ) : null}

                {/* MY PUBLISHED PROJECTS LIST */}
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-orbitron font-bold text-white">
                      Your Projects ({userProjects.length})
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      HUB REPOSITORY
                    </span>
                  </div>

                  {userProjects.length === 0 ? (
                    <p className="text-xs font-sans text-zinc-500">
                      You haven&apos;t published any projects yet. Click &ldquo;+ Deploy Project&rdquo; above to link your first repository.
                    </p>
                  ) : (
                    <div className="space-y-3 font-mono">
                      {userProjects.map((p) => (
                        <div
                          key={p.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-800 bg-black/60 hover:border-cyan-500/40 transition"
                        >
                          <div>
                            <h5 className="text-sm font-orbitron font-semibold text-white">
                              {p.title}
                            </h5>
                            <p className="text-xs font-sans text-zinc-400 line-clamp-2 mt-1">
                              {p.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {p.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/30 text-cyan-300"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs">
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 font-bold"
                            >
                              GitHub ↗
                            </a>
                            <span className="text-zinc-700">|</span>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="text-red-400 hover:text-red-300 cursor-pointer"
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
                  <TiltCard
                    key={feature.title}
                    className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-3 hover:border-cyan-500/40 transition shadow-[0_0_20px_rgba(0,240,255,0.05)]"
                  >
                    <p className="text-[0.68rem] uppercase font-mono tracking-[0.2em] text-cyan-400">
                      {feature.tag}
                    </p>
                    <h3 className="text-lg font-orbitron font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-400 font-sans">
                      {feature.description}
                    </p>
                  </TiltCard>
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              {/* QUICK ACTIONS */}
              <div className="rounded-3xl border border-cyan-500/30 bg-zinc-950/80 p-6 space-y-4 shadow-[0_0_25px_rgba(0,240,255,0.08)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <p className="text-[0.7rem] uppercase font-mono tracking-[0.24em] text-cyan-400">
                    Quick Navigation
                  </p>
                </div>
                <div className="space-y-2.5 font-mono text-xs">
                  <Link
                    href="/projects"
                    className="block rounded-xl border border-zinc-800 bg-black/60 px-4 py-3 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/40 transition"
                  >
                    [01] Explore Project Hub ↗
                  </Link>
                  <Link
                    href="/events"
                    className="block rounded-xl border border-zinc-800 bg-black/60 px-4 py-3 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/40 transition"
                  >
                    [02] Upcoming Workshops &amp; Events ↗
                  </Link>
                  <Link
                    href="/execom"
                    className="block rounded-xl border border-zinc-800 bg-black/60 px-4 py-3 text-zinc-300 hover:text-purple-300 hover:border-purple-500/40 transition"
                  >
                    [03] Executive Committee Directory ↗
                  </Link>
                  <Link
                    href="/downloads"
                    className="block rounded-xl border border-zinc-800 bg-black/60 px-4 py-3 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/40 transition"
                  >
                    [04] Download ROBOCEK Studio v0.2.1 ↗
                  </Link>
                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="w-full text-left block rounded-xl border border-zinc-800 bg-black/60 px-4 py-3 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/40 transition cursor-pointer"
                  >
                    [05] Update Registration Data
                  </button>
                  <a
                    href="mailto:robocek@gcek.ac.in"
                    className="block rounded-xl border border-zinc-800 bg-black/60 px-4 py-3 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/40 transition"
                  >
                    [06] Contact Executive Team
                  </a>
                </div>
              </div>

              {/* MEMBER SNAPSHOT */}
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
                <p className="text-[0.7rem] uppercase font-mono tracking-[0.24em] text-zinc-400">
                  Telemetry Summary
                </p>
                <dl className="space-y-4 font-mono text-xs">
                  <div>
                    <dt className="text-zinc-500">Membership Pass ID</dt>
                    <dd className="mt-1 font-bold text-cyan-400 break-all">
                      {profile?.membershipId ? profile.membershipId : "Pending Confirmation"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Verified Contact</dt>
                    <dd className="mt-1 font-medium text-white">
                      {profile?.phoneNumber || profile?.phone || "Not recorded"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Credential Status</dt>
                    <dd
                      className={`mt-1 font-bold flex items-center gap-1.5 ${
                        profile?.status?.trim().toLowerCase() === "approved" || profile?.status?.trim().toLowerCase() === "verified"
                          ? "text-cyan-400"
                          : "text-amber-400"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        profile?.status?.trim().toLowerCase() === "approved" || profile?.status?.trim().toLowerCase() === "verified"
                          ? "bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                          : "bg-amber-400"
                      }`} />
                      {profile?.status?.trim().toLowerCase() === "approved" || profile?.status?.trim().toLowerCase() === "verified"
                        ? "ACTIVE / VERIFIED MEMBER"
                        : profile?.status ?? "PENDING CONFIRMATION"}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        ) : null}
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-cyan-500/20 bg-[#030712]/90 backdrop-blur-xl mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© {new Date().getFullYear()} ROBOCEK · Robotics Club, Government College of Engineering Kannur.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-cyan-400 transition uppercase tracking-wider">
              Home
            </Link>
            <Link href="/execom" className="hover:text-purple-400 transition uppercase tracking-wider">
              ExeCom
            </Link>
            <Link href="/downloads" className="hover:text-cyan-400 transition uppercase tracking-wider">
              Downloads
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}