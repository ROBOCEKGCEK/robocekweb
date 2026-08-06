"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/client";

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

  useEffect(() => {
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
          setProfile(userDocSnap.data() as UserProfile);
        } else {
          // Fallback query by uid
          const userQuery = query(
            collection(db, "users"),
            where("uid", "==", currentUser.uid),
          );
          const snapshot = await getDocs(userQuery);

          if (!snapshot.empty) {
            setProfile(snapshot.docs[0].data() as UserProfile);
          } else {
            setProfile(null);
            setErrorMessage("No user profile record was found for this account.");
          }
        }
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

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-16">
        <header className="mb-10 flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
              ROBOCEK Member Area
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Your personal control room for club updates, projects, and member-only resources.
            </p>
          </div>
          <Link
            href="/logout"
            className="inline-flex w-fit items-center justify-center rounded-full border border-zinc-300 px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-700 transition hover:border-zinc-800 hover:text-black dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:text-zinc-50"
          >
            Sign Out
          </Link>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
            Loading your dashboard...
          </div>
        ) : null}

        {!loading && user ? (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-8">
                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Signed In As
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <h2 className="text-2xl font-semibold sm:text-3xl">
                    {profile?.fullName ?? user.displayName ?? "Member"}
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {profile?.email ?? user.email}
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black/40">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
                      User ID
                    </p>
                    <p className="mt-2 break-all text-sm font-medium text-black dark:text-zinc-100">
                      {user.uid}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black/40">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
                      Membership ID
                    </p>
                    <p className="mt-2 break-all text-sm font-medium text-black dark:text-zinc-100">
                      {profile?.membershipId ? profile.membershipId : "Pending Admin Confirmation"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black/40">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
                      Branch
                    </p>
                    <p className="mt-2 text-sm font-medium text-black dark:text-zinc-100">
                      {profile?.branch ?? "Not saved yet"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black/40">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
                      Semester
                    </p>
                    <p className="mt-2 text-sm font-medium text-black dark:text-zinc-100">
                      {profile?.yearSemester || profile?.year || "Not saved yet"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black/40">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
                      Interests
                    </p>
                    <p className="mt-2 text-sm font-medium text-black dark:text-zinc-100">
                      {profile?.interests?.length ? profile.interests.length : 0} selected
                    </p>
                  </div>
                </div>
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                  {errorMessage}
                </div>
              ) : null}

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
                    <dt className="text-zinc-500 dark:text-zinc-400">Firebase UID</dt>
                    <dd className="mt-1 break-all font-medium text-black dark:text-zinc-100">
                      {user.uid}
                    </dd>
                  </div>
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