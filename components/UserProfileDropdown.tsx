"use client";

import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Package, Heart, ShoppingBag, LogOut, ChevronDown } from "lucide-react";

export default function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const name = session?.user?.name ?? "User";
  const email = session?.user?.email ?? "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="fixed top-6 right-8 z-[99999]">
      {/* ── Circular Avatar Button ─────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm
          shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-2 transition-all duration-200 cursor-pointer select-none
          focus:outline-none focus:ring-2 focus:ring-cyan-400/50
          ${isOpen
            ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            : "border-white/10 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          }
        `}
      >
        {initial}
      </button>

      {/* ── Invisible Overlay for Outside Clicks ──────────────── */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99998]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Dropdown Panel ────────────────────────────────────── */}
      {isOpen && (
        <div
          role="menu"
          className="absolute w-56 rounded-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-[99999] overflow-hidden"
          style={{
            background: "#000000",
            top: "calc(100% + 8px)",
            right: 0,
          }}
        >
          {/* User info header */}
          <div className="px-4 py-3.5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-tight truncate">{name}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Navigation items — Native HTML Links for 100% reliability */}
          <div className="py-1">
            <a
              href="/orders"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-cyan-400 transition-colors duration-150 text-left"
            >
              <Package className="w-4 h-4 flex-shrink-0" />
              Your Orders
            </a>

            <a
              href="/wishlist"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-pink-400 transition-colors duration-150 text-left"
            >
              <Heart className="w-4 h-4 flex-shrink-0" />
              Wishlist
            </a>

            <a
              href="/marketplace"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-purple-400 transition-colors duration-150 text-left"
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              EV Marketplace
            </a>
          </div>

          {/* Sign out — Native Server Redirect */}
          <div className="border-t border-white/10 py-1">
            <a
              href="/api/auth/signout?callbackUrl=/"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-white/10 hover:text-rose-300 transition-colors duration-150 text-left"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
