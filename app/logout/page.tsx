"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const runLogout = async () => {
      if (auth) {
        await signOut(auth);
      }
      router.replace("/");
    };

    void runLogout();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-zinc-50">
      <p className="text-sm uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">
        Signing out...
      </p>
    </main>
  );
}