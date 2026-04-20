"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Map, Battery, AlertTriangle, ArrowRight, LogIn } from "lucide-react";
import MouseGlow from "../components/MouseGlow";
import { useSession, signIn } from "next-auth/react";
import LiveNewsFeed from "../components/LiveNewsFeed";
import MarketplacePromo from "../components/MarketplacePromo";

export default function Home() {
  const { data: session, status } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const [showAuthWarning, setShowAuthWarning] = useState(false);

  // Build the underlying root terminal URL for the main Hero CTA
  const terminalUrl = session?.user?.email
    ? `http://localhost:8501/?user=${encodeURIComponent(session.user.email)}`
    : "http://localhost:8501/?user=admin_session";

  // Deep linking secure navigation function
  const handleSecureNavigation = (baseTargetUrl: string) => {
    if (status === "unauthenticated" || !session) {
      setShowAuthWarning(true);
      setTimeout(() => setShowAuthWarning(false), 3000);
    } else {
      // Append the active session token/email to the target deep link
      const userParam = session?.user?.email ? encodeURIComponent(session.user.email) : "admin_session";
      const finalUrl = baseTargetUrl.includes("?") 
        ? `${baseTargetUrl}&user=${userParam}` 
        : `${baseTargetUrl}?user=${userParam}`;
      
      window.location.href = finalUrl;
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-between pb-20">

      {/* Background */}
      <MouseGlow />
      <div className="fluid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)] -z-20" />

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <motion.section
        className="flex flex-col items-center text-center pt-36 px-4 max-w-4xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >


        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          The Operating System for the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            EV Ecosystem.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
          Real-time mineral intelligence, nationwide infrastructure mapping, and predictive battery
          analytics forged into one seamless terminal.
        </p>

        {/* ── CTA Block ─── */}
        {status === "loading" ? (
          <div className="h-16 flex items-center justify-center font-semibold text-slate-500 animate-pulse tracking-wide">
            Establishing encrypted link...
          </div>

        ) : status === "authenticated" && session?.user ? (
          /* Authenticated → Launch Terminal */
          <div className="flex flex-col items-center gap-3">
            <motion.a
              href={terminalUrl}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-300 btn-liquid rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch Terminal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <p className="text-xs text-slate-500">
              Signed in as <span className="text-slate-300">{session.user.email}</span>
            </p>
          </div>

        ) : (
          /* Not authenticated → Inline sign-in options */
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Sign in to access the Terminal
            </p>

            {/* Google */}
            <motion.button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white text-gray-800 font-semibold text-sm shadow-lg hover:bg-gray-100 transition-all"
            >
              {/* Google SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>

            {/* Microsoft */}
            <motion.button
              onClick={() => signIn("azure-ad", { callbackUrl: "/" })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-[#0078d4] text-white font-semibold text-sm shadow-lg hover:bg-[#006cc1] transition-all"
            >
              {/* Microsoft SVG */}
              <svg className="w-5 h-5" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
              </svg>
              Continue with Microsoft
            </motion.button>

            <p className="text-xs text-slate-600 mt-2">
              Your data is secured via OAuth 2.0 · No password stored
            </p>
          </div>
        )}
      </motion.section>

      {/* ── Bento Feature Cards ───────────────────────────────────────── */}
      <motion.section
        className="w-full max-w-6xl px-4 mt-32 grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {[
          {
            icon: <LineChart className="w-6 h-6" />,
            color: "blue",
            title: "Market Intelligence",
            desc: "Live feeds for Lithium and Nickel assets mimicking active institutional trading desks.",
            targetUrl: "http://localhost:8501/",
          },
          {
            icon: <Map className="w-6 h-6" />,
            color: "emerald",
            title: "Infrastructure Map",
            desc: "1,000+ terrestrial rendering nodes spanning every major tech hub and national highway.",
            targetUrl: "http://localhost:8501/Infrastructure_Map",
          },
          {
            icon: <Battery className="w-6 h-6" />,
            color: "purple",
            title: "Battery AI",
            desc: "Predictive Scikit-Learn logic architected to trace lithium-ion degradation topologies.",
            targetUrl: "http://localhost:8501/Battery_AI",
          },
          {
            icon: <AlertTriangle className="w-6 h-6" />,
            color: "amber",
            title: "Emergency Support",
            desc: "Rapid-dispatch high voltage mechanic routing optimized for immediate incident mitigation.",
            targetUrl: "http://localhost:8501/Emergency_Support",
          },
        ].map(({ icon, color, title, desc, targetUrl }) => (
          <motion.div
            key={title}
            variants={itemVariants}
            onClick={() => handleSecureNavigation(targetUrl)}
            className="block"
          >
            <div className="glass-card glow-hover p-8 rounded-3xl group cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 ease-in-out">
              <div className={`w-12 h-12 rounded-2xl bg-${color}-500/20 flex items-center justify-center mb-6 text-${color}-400 group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
              <p className="text-slate-400 leading-relaxed">{desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Live News Feed ────────────────────────────────────────────── */}
      <LiveNewsFeed />

      {/* ── Marketplace Promo ─────────────────────────────────────────── */}
      <MarketplacePromo />

      {/* ── Tech Stack Marquee ────────────────────────────────────────── */}
      <section className="w-full overflow-hidden mt-32 border-y border-white/5 py-6 bg-black/40 backdrop-blur-sm">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-16 px-8 items-center text-slate-500 font-medium tracking-widest uppercase text-sm">
              <span>Powered by</span><span>•</span>
              <span className="text-white">Python</span><span>•</span>
              <span className="text-white">Streamlit</span><span>•</span>
              <span className="text-white">Pandas</span><span>•</span>
              <span className="text-white">Plotly</span><span>•</span>
              <span className="text-white">Scikit-Learn</span><span>•</span>
              <span className="text-white">Next.js</span><span>•</span>
              <span className="text-white">TailwindCSS</span><span>•</span>
              <span className="text-white">Framer Motion</span><span>•</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Auth Warning Toast ── */}
      <AnimatePresence>
        {showAuthWarning && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[999999] bg-[#0a0a0a]/90 backdrop-blur-xl border border-rose-500/30 text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(226,29,72,0.25)] flex items-center gap-3"
          >
            <span className="text-xl">🔒</span>
            <span className="font-medium tracking-wide">Please sign in to access the Terminal.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="w-full text-center mt-20 text-slate-600 text-sm">
        <p>© 2026 EV-RIT Intelligence Systems. Built for the Future.</p>
      </footer>
    </main>
  );
}
