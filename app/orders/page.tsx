"use client";

import React from 'react';
import { PackageX, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MouseGlow from "../../components/MouseGlow";

export default function OrdersPage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
      <MouseGlow />
      <div className="fluid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-lg w-full p-10 flex flex-col items-center text-center rounded-3xl z-10"
      >
        <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <PackageX className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Order History</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">No recent EV accessory orders found. Head to the marketplace to equip your station!</p>
        
        <Link href="/marketplace" className="px-6 py-3 font-semibold text-white transition-all duration-300 btn-liquid rounded-full w-full">
          Browse Marketplace
        </Link>
        
        <Link href="/" className="mt-6 flex items-center text-sm font-medium text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Hub
        </Link>
      </motion.div>
    </main>
  );
}
