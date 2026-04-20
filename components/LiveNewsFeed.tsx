"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Types
interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

// Fallback Data if API limit hit
const FALLBACK_ARTICLES: Article[] = [
  {
    title: "Global Lithium Producers Aggregate Strategies to Meet Supply Chain Demands",
    description: "Major tier-1 and tier-2 lithium producers establish advanced offtake agreements as EV battery megaprojects accelerate production deadlines.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1620619767323-b65ea96c1da8?q=80&w=800&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    source: { name: "EV Intelligence Protocol" }
  },
  {
    title: "Solid-State Battery Breakthrough: Next-Gen Substrates Entering Pilot Lines",
    description: "A coalition of automotive OEMs and battery startups are shifting their focus to solid-state substrates, aiming to double energy density by Q4 2027.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { name: "Battery AI Insights" }
  },
  {
    title: "Raw Material Costs Stabilize Amidst New Infrastructure Commitments",
    description: "Nickel and Cobalt spot prices hit a relative plateau as newly mapped terrestrial extraction nodes come fully online, smoothing market volatility.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1617786840120-e74c869ea769?q=80&w=800&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { name: "Market Terminal" }
  }
];

export default function LiveNewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        if (!apiKey) {
          throw new Error("Missing API Key");
        }
        
        const url = `https://newsapi.org/v2/everything?q="electric vehicle" OR "EV battery" OR "lithium"&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`NewsAPI Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        } else {
          throw new Error("No articles found");
        }
      } catch (error) {
        console.warn("Falling back to hardcoded EV news data:", error);
        setArticles(FALLBACK_ARTICLES);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl px-4 mt-16 mb-8 mx-auto"
    >
      <div className="w-full flex flex-col rounded-[20px] overflow-hidden border border-gray-700/60 shadow-2xl" style={{ backgroundColor: "#1a1b26" }}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/60 bg-[#151620]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h2 className="text-white font-semibold tracking-wide text-lg">Live Market Wire</h2>
          </div>
          <span className="text-xs text-gray-500 font-mono tracking-widest">REAL-TIME</span>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto max-h-[400px] flex flex-col p-2 styling-scrollbar scroll-smooth">
          {loading ? (
            // Skeleton Loader
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b border-gray-700/30 last:border-0 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
                  <div className="h-3 w-16 bg-gray-800 rounded"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-800 rounded"></div>
              </div>
            ))
          ) : (
            // Actual Articles
            articles.map((article, index) => (
              <a 
                key={index} 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row gap-4 p-4 border-b border-gray-700/30 last:border-0 hover:bg-white/[0.02] transition-colors duration-200"
              >
                {/* News Image Block */}
                {article.urlToImage && (
                  <div className="flex-shrink-0 w-full md:w-[120px] lg:w-[150px] aspect-video md:aspect-[4/3] overflow-hidden rounded-lg bg-gray-800">
                    <img 
                      src={article.urlToImage} 
                      alt="News Thumbnail"
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                )}
                
                {/* Content Block */}
                <div className="flex flex-col flex-grow w-full justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-400 tracking-wider uppercase">
                      {article.source.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gray-500 font-mono bg-gray-900/50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-gray-100 font-semibold text-sm md:text-base leading-snug mb-1.5 group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-xs md:text-sm text-gray-400 line-clamp-2 md:line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}
