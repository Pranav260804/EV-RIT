"use client";

import React from 'react';
import { useSession, signIn } from "next-auth/react";
import UserProfileDropdown from "./UserProfileDropdown";
import Link from 'next/link';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 w-full box-border bg-gradient-to-b from-black/80 to-transparent">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <span className="text-white font-bold text-xl tracking-tighter">EV</span>
        </div>
        <span className="text-xl font-bold tracking-widest text-white hidden sm:block">RIT</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {status === "loading" ? (
           <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-cyan-400 animate-spin"></div>
        ) : status === "authenticated" && session?.user ? (
          <UserProfileDropdown />
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => signIn('google')}
              className="px-4 py-2 text-sm font-semibold text-white transition-all duration-300 glass-card rounded-full hover:border-[#38bdf8] hover:text-[#38bdf8] hidden sm:block"
            >
              Sign in with Google
            </button>
            <button 
              onClick={() => signIn('azure-ad')}
              className="px-4 py-2 text-sm font-semibold text-white transition-all duration-300 glass-card rounded-full hover:border-[#a855f7] hover:text-[#a855f7]"
            >
              Sign in with Microsoft
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
