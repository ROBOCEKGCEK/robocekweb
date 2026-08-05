"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-zinc-50">
      <p className="text-sm uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">
        Signing out...
      </p>
    </main>
  );
}