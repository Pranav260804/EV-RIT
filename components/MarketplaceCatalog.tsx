"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Banknote, Tag, PackageX } from "lucide-react";

// The expected interface for your JSON data
export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
  discountPercentage?: number; // Optional discount for the badge
}

export default function MarketplaceCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch("/ev-marketplace.json");
        if (!response.ok) {
          throw new Error(`Failed to load catalog: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load marketplace data. Make sure ev-marketplace.json is in your public directory.");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="w-full flex items-center justify-center p-12 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
        <PackageX className="w-6 h-6 mr-3" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {loading ? (
        // Skeleton Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[#151620] rounded-3xl h-[420px] w-full border border-gray-800/60 p-4 flex flex-col">
              <div className="w-full h-48 bg-gray-800 rounded-2xl mb-4"></div>
              <div className="w-1/3 h-4 bg-gray-700 rounded mb-4"></div>
              <div className="w-3/4 h-6 bg-gray-700 rounded mb-2"></div>
              <div className="w-full h-12 bg-gray-800 rounded mt-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        // Data Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-[#0f1016] border border-gray-800/60 hover:border-cyan-500/30 rounded-3xl overflow-hidden flex flex-col shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative w-full h-52 bg-gray-900 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    product.inStock ? "group-hover:scale-110" : "grayscale opacity-50"
                  }`}
                />
                
                {/* Discount Badge */}
                {product.discountPercentage && product.discountPercentage > 0 && product.inStock && (
                  <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1 z-10">
                    <Tag className="w-3 h-3" />
                    {product.discountPercentage}% OFF
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="border-2 border-rose-500 text-rose-500 bg-black/40 font-black tracking-widest uppercase px-6 py-2 rounded-xl rotate-[-12deg] shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                      Out of Stock
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-cyan-400 text-xs font-bold tracking-wider uppercase mb-2">
                  {product.category}
                </p>
                <h3 className="text-white text-lg font-semibold leading-tight mb-2 group-hover:text-cyan-300 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-grow">
                  {product.description}
                </p>

                {/* Price and CTA */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Enterprise Price</span>
                    <span className="text-white font-bold text-xl flex items-center gap-1.5">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  
                  <button
                    disabled={!product.inStock}
                    className={`p-3 rounded-full flex items-center justify-center transition-all ${
                      product.inStock
                        ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:-translate-y-1"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
