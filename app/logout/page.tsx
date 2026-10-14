"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/client";
import CyberBackground from "../components/CyberBackground";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const runLogout = async () => {
      if (auth) {
        await signOut(auth);
      }
      setTimeout(() => {
        router.replace("/");
      }, 600);
    };

    void runLogout();
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-zinc-100 font-mono relative overflow-hidden">
      <CyberBackground />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center p-8 rounded-3xl border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,240,255,0.15)] max-w-sm">
        <div className="w-12 h-12 rounded-2xl border border-cyan-500/40 bg-cyan-950/40 flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <h2 className="text-sm font-orbitron font-bold tracking-widest text-white uppercase">
            Terminating Session
          </h2>
          <p className="text-[11px] text-zinc-400 mt-1">
            Clearing auth tokens &amp; disconnecting telemetry stream...
          </p>
        </div>
      </div>
    </main>
  );
}