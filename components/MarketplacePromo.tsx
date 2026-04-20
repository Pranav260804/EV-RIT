"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Sparkles } from "lucide-react";

export default function MarketplacePromo() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full max-w-7xl mx-auto px-4 mt-20 mb-10 relative"
    >
      {/* ── Outer Container with Cinematic Video Background ── */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#0f1016] shadow-2xl border border-gray-800/60 min-h-[500px] flex items-center">
        
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40 blur-[2px]"
          >
            <source src="/promo-video.mp4" type="video/mp4" />
          </video>
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1016] via-[#0f1016]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1016] via-transparent to-transparent"></div>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-16">
          
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col justify-center items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Exclusive Partners
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Upgrade Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                EV Ecosystem
              </span>
            </h2>

            <p className="text-gray-400 text-base md:text-lg max-w-md leading-relaxed selection:bg-cyan-500/30">
              Access enterprise-grade hardware, localized grid controllers, and ultra-fast charging architectures at verified institutional pricing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={() => window.location.href = "http://localhost:3000/marketplace"}
                className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-all duration-200"
              >
                Enter Marketplace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-transparent text-white font-semibold text-sm border border-white/20 hover:bg-white/5 transition-all duration-200">
                <ShoppingCart className="w-4 h-4" />
                View Catalog
              </button>
            </div>
          </div>

          {/* Right Column: Visual Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 justify-center items-center">
            
            {/* Card 1 */}
            <div className="group relative w-full h-[280px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900 cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80" 
                alt="Product Demo 1" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                <span className="px-2 py-1 mb-2 bg-rose-500 text-white text-[10px] font-bold tracking-wider uppercase rounded-md shadow-lg">
                  15% OFF
                </span>
                <h3 className="text-white font-semibold text-lg leading-tight">HyperCharge Node V2</h3>
                <p className="text-gray-400 text-xs mt-1">Industrial Series</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative w-full h-[280px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900 cursor-pointer sm:translate-y-8">
              <img 
                src="https://images.unsplash.com/photo-1584824527715-ddc4fc197b10?auto=format&fit=crop&w=800&q=80" 
                alt="Product Demo 2" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start">
                <span className="px-2 py-1 mb-2 bg-emerald-500 text-white text-[10px] font-bold tracking-wider uppercase rounded-md shadow-lg">
                  NEW ARRIVAL
                </span>
                <h3 className="text-white font-semibold text-lg leading-tight">Lithium Substrate Core</h3>
                <p className="text-gray-400 text-xs mt-1">Component Supply</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.section>
  );
}
