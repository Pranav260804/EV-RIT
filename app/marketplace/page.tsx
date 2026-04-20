"use client";

// Next.js Router Constraints: `export const dynamic = 'force-dynamic';` throws fatal build errors inside `"use client"` blocks.
// Fix: We naturally bypass caching globals since the `fetch` API endpoint bounds resolve entirely within dynamic Runtime parameters tracking the dynamic input search.

import React, { useEffect, useState } from 'react';
import { ShoppingCart, ArrowLeft, Star, Search, BadgeCheck, CheckCircle2, ChevronDown, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import MouseGlow from "../../components/MouseGlow";
import { formatCurrency, getUserRegionCode } from '../../lib/currency';
import { supabase } from '../../lib/supabase';

// Wishlist interaction mapping explicitly isolating the heart strings natively
const WishlistButton = () => {
  return (
    <div className="absolute top-4 right-4 z-30 cursor-pointer group/wishlist">
      <span className="text-2xl opacity-50 text-white drop-shadow-md group-hover/wishlist:opacity-100 group-hover/wishlist:drop-shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-300">🤍</span>
    </div>
  );
};

interface AmazonProduct {
  asin: string;
  title: string;
  image_url: string;
  price: Record<string, number>;
  affiliate_link: string;
  rating: number;
  description: string;
  tag?: string;
}

export default function MarketplacePage() {
  const { data: session } = useSession();
  
  // App States
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<string | null>(null);
  
  // Isolated Product Layout Mapping structurally overriding repetition natively scaling
  const ProductCard = ({ product }: { product: AmazonProduct }) => (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
      className="glass-card flex flex-col rounded-3xl overflow-hidden group hover:border-amber-400/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] bg-gradient-to-br from-white/5 to-black/60 relative w-full h-full"
    >
      {/* Official Amazon Prime indicator mock */}
      <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-md rounded-full px-2 py-1 flex items-center border border-white/10 shadow-lg">
        <CheckCircle2 className="w-3 h-3 text-amber-400 mr-1" />
        <span className="text-[10px] uppercase font-bold text-white tracking-wider">Prime</span>
      </div>

      <WishlistButton />

      {/* High Res PA Image Native Scaler */}
      <div className="w-full relative overflow-hidden flex-shrink-0 bg-white/5 border-b border-white/5 h-48">
        <img 
          src={product.image_url} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10 pointer-events-none mix-blend-multiply" />
        
        {product.tag && (
          <span className="absolute bottom-4 left-4 z-20 px-3 py-1 bg-amber-500/90 rounded-sm text-xs font-black text-black shadow-lg uppercase tracking-widest">
            {product.tag}
          </span>
        )}
      </div>
      
      {/* Data Body */}
      <div className="p-6 flex flex-col flex-grow relative z-20 bg-black/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">ASIN: {product.asin}</span>
          <div className="flex text-amber-400 gap-[2px]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-20'}`} />
            ))}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-auto">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-white tracking-tight drop-shadow-md">
              {formatCurrency(product.price, regionCode)}
            </span>
          </div>
          
          <button 
            onClick={() => handleBuyClick(product)}
            className="px-6 py-3 bg-white text-black hover:bg-amber-400 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-300 border border-transparent hover:border-amber-300 shadow-md transform group-hover:scale-105"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
  
  // Interactive UI Search Map
  const [searchQuery, setSearchQuery] = useState("Level 2 EV Charger");
  const [inputValue, setInputValue] = useState("");
  const [regionCode, setRegionCode] = useState("IN");

  useEffect(() => {
    // Determine native bounds dynamically
    const detectedRegion = getUserRegionCode();
    setRegionCode(detectedRegion);
    handleSearch(detectedRegion, "Smart EV Accessories");
  }, []);

  const handleSearch = async (overrideRegion?: string, overrideQuery?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    const targetRegion = overrideRegion || regionCode;
    const targetQuery = overrideQuery || searchQuery;

    try {
      const resp = await fetch(`/api/amazon/search?region=${targetRegion}&keyword=${encodeURIComponent(targetQuery)}`);
      const data = await resp.json();
      
      if (data.status === 'error') {
        setErrorMsg(data.message);
        setProducts([]);
      } else {
        setProducts(data.results || []);
        setApiSource(data.source);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to bridge to Amazon PA backend server route.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyClick = async (product: AmazonProduct) => {
    // 1. Asynchronous Telemetry Ping mapping straight to Supabase
    try {
      if (session?.user?.email) {
        await supabase.from('user_activity').insert([
          {
            email: session.user.email,
            event_type: "Amazon Affiliate Click: [ASIN] " + product.asin,
            login_time: new Date().toISOString()
          }
        ]);
      }
    } catch (e) {
      console.error("Telemetry structural dropout safely captured", e);
    }
    
    // 2. Verified AWS External Hop
    window.open(product.affiliate_link, '_blank');
  };

  return (
    <main className="min-h-screen relative overflow-hidden pt-28 pb-20 px-6">
      <MouseGlow />
      <div className="fluid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[800px] bg-amber-500/5 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Amazon Partner Verified Top Banner */}
        <div className="flex justify-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 border border-amber-500/30 bg-black/40 backdrop-blur-md rounded-full text-sm font-semibold text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
          >
            <BadgeCheck className="w-4 h-4 mr-2" />
            Verified Amazon Associate Architecture
            {apiSource === 'MOCK_MODE' && <span className="ml-3 px-2 py-0.5 rounded text-[10px] bg-white/10 text-slate-300 uppercase">Dev Mode Triggered</span>}
          </motion.div>
        </div>

        {/* Interactive Search Console */}
        <div className="glass-card max-w-3xl mx-auto p-4 md:p-6 rounded-3xl mb-16 flex flex-col md:flex-row gap-4 items-center border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="relative w-full flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search robust Amazon EV inventory..."
              className="w-full bg-black/40 border border-white/10 text-white rounded-full pl-12 pr-4 py-3 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && inputValue) {
                  setSearchQuery(inputValue);
                  handleSearch(undefined, inputValue);
                }
              }}
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative group">
              <select 
                title="Region Binding"
                value={regionCode}
                onChange={(e) => {
                  const newCode = e.target.value;
                  setRegionCode(newCode);
                  handleSearch(newCode);
                }}
                className="appearance-none bg-white/5 border border-white/10 text-white font-bold rounded-full pl-4 pr-10 py-3 focus:outline-none cursor-pointer hover:bg-white/10 transition-all"
              >
                <option value="IN">🇮🇳 IN</option>
                <option value="US">🇺🇸 US</option>
                <option value="AU">🇦🇺 AU</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            
            <button 
              onClick={() => {
                if(inputValue) {
                  setSearchQuery(inputValue);
                  handleSearch(undefined, inputValue);
                }
              }}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-full text-white font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] flex-grow md:flex-grow-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* Global Errors bounds  */}
        {errorMsg && (
          <div className="mb-10 w-full p-6 bg-red-500/10 border border-red-500/40 rounded-3xl flex flex-col items-center justify-center text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <span className="font-bold text-xl mb-2 flex items-center"><X className="w-6 h-6 mr-2"/> Amazon PA Query Rejected</span>
            <span className="text-center text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Grid Interface */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20 min-h-[400px]">
            <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-amber-400 animate-spin"></div>
          </div>
        ) : errorMsg ? null : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 glass-card rounded-3xl mx-auto max-w-2xl border-white/10 shadow-lg text-center px-6"
          >
             <Search className="w-12 h-12 text-slate-500 mb-6" />
             <p className="text-2xl font-bold text-white tracking-widest mb-2">0 matches found.</p>
             <p className="text-slate-400">Your specific PA mapping '{searchQuery}' returned absolutely empty boundaries.</p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              initial="hidden" animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.15 } }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              {products.map((product) => (
                <ProductCard key={product.asin} product={product} />
              ))}
            </motion.div>

            {/* Architecture Expansion Bounds natively tracking future ML clusters globally */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8 tracking-wide drop-shadow-md border-l-4 border-amber-400 pl-4">Recommended For You</h2>
              
              {/* Horizontal Scroll Layout mimicking advanced store bindings */}
              <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {products.slice(0, 4).map((product, idx) => (
                  <div key={`rec-${product.asin}-${idx}`} className="min-w-[340px] max-w-[340px] snap-start flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8 tracking-wide drop-shadow-md border-l-4 border-cyan-400 pl-4">Similar Products</h2>
              
              {/* Uncapped Grid Execution strictly utilizing mapping organically */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
                {products.map((product, idx) => (
                  <div key={`sim-${product.asin}-${idx}`}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
