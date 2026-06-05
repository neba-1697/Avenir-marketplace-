import React from 'react';
import { Heart, ShieldCheck, Star, ShoppingBag, Eye, Zap, Truck, Sparkles } from 'lucide-react';
import { Product, Store } from '../types';

interface ProductCardProps {
  key?: any;
  product: any;
  store?: any;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (item: any) => void;
  onBuyNow: (item: any) => void;
  onQuickPreview: (item: any) => void;
}

export default function ProductCard({
  product,
  store,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onBuyNow,
  onQuickPreview,
}: ProductCardProps) {
  const hasOrigPrice = product.originalPrice && product.originalPrice > product.price;
  const discPercent = hasOrigPrice
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : null;

  // Rating Stars calculation
  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className="relative w-3.5 h-3.5">
            <Star className="absolute top-0 left-0 w-3.5 h-3.5 text-zinc-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-zinc-300" />);
      }
    }
    return stars;
  };

  const deliveryDay = 'In 24 hrs';

  return (
    <div className="group relative bg-white border border-zinc-150/90 rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(9,34,21,0.02)] hover:shadow-[0_24px_48px_rgba(9,34,21,0.07)] hover:border-[#115C34]/40 hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full uppercase-none">
      
      {/* 1. Large Image container with interactive filters and zoom */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50 border-b border-zinc-150 shrink-0 select-none">
        
        {/* Main image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-95 pointer-events-none"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Dynamic ambient hover state mask */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* TOP LEFT BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 items-start">
          <span className="bg-emerald-950/95 backdrop-blur-md text-[#E5C158] text-[8.5px] font-mono font-black py-1 px-3 z-10 rounded-full border border-emerald-500/30 shadow-sm flex items-center gap-1.5 tracking-wider font-extrabold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-950" />
            <span>VETTED SQUAD APPROVED</span>
          </span>
          {discPercent && (
            <span className="bg-[#E5C158] text-zinc-950 text-[9.5px] font-mono font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse font-extrabold tracking-tight">
              <Sparkles className="w-3 h-3 text-zinc-950" />
              <span>-{discPercent}% OVERHEAD SAVED</span>
            </span>
          )}
        </div>

        {/* TOP RIGHT FAVORITE BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-zinc-100 hover:bg-rose-50 transition-all cursor-pointer z-10 active:scale-90"
          title="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-zinc-400 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Bottom Lock Info */}
        <div className="absolute bottom-3 left-4 right-4 bg-zinc-950/85 backdrop-blur-xs text-[#FAF9F6] text-[8.5px] font-mono font-extrabold px-3 py-1.5 rounded-xl border border-zinc-800 tracking-wide uppercase flex items-center justify-between pointer-events-none shadow-sm">
          <span className="flex items-center gap-1 text-[#E5C158]">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            TELEBIRR SECURED
          </span>
          <span className="text-zinc-400 text-[8px]">ESCROW VERIFIED</span>
        </div>

        {/* QUICK PREVIEW HOVER ACTION */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-center justify-center gap-2 z-10">
          <button
            onClick={() => onQuickPreview(product)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white text-zinc-900 font-bold hover:bg-[#FAF9F6] text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#115C34]" />
            <span>Quick Preview</span>
          </button>
        </div>

      </div>

      {/* 2. Card Content details */}
      <div className="p-5.5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Info Blocks */}
        <div className="space-y-2">
          
          {/* Category & Store Meta */}
          <div className="flex items-center justify-between text-[10px] uppercase font-mono font-bold tracking-wider">
            <span className="text-[#a4843b]">{product.category}</span>
            <div className="flex items-center gap-1 group/store cursor-pointer text-zinc-500 hover:text-[#115C34] transition-colors">
              <span>{store ? store.name : 'Vetted Merchant'}</span>
              {(store?.verified ?? true) && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickPreview(product)}
            className="text-[15px] font-serif font-black text-zinc-950 tracking-tight leading-snug hover:text-[#115C34] transition-colors line-clamp-2 cursor-pointer pt-0.5"
          >
            {product.name}
          </h3>

          {/* Review Score and Statistics block */}
          <div className="flex items-center gap-2 pt-1 font-sans">
            <div className="flex items-center gap-0.5">
              {renderStars(product.rating)}
            </div>
            <span className="text-[11px] text-zinc-850 font-black tracking-tight">{product.rating}</span>
            <span className="text-[10px] text-zinc-400 font-bold">({product.reviewsCount} verified reviews)</span>
          </div>

        </div>

        {/* Pricing, physical unboxing parameters and action buttons */}
        <div className="space-y-4 pt-3 border-t border-zinc-100">
          
          {/* Price Metrics row */}
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-400 font-mono font-bold uppercase tracking-wider block leading-none">Inspected Price</span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-lg font-black text-[#092215]">{product.price.toLocaleString()}</span>
                <span className="text-[10px] text-zinc-550 font-sans font-extrabold pr-2">ETB</span>
                {hasOrigPrice && (
                  <span className="text-[12px] text-zinc-400 line-through font-extrabold">
                    {product.originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Sales volumes & dispatch status */}
            <div className="text-right text-[10.5px] font-mono space-y-0.5 leading-none shrink-0">
              <span className="block font-bold text-emerald-800 flex items-center gap-1 justify-end">
                <Truck className="w-3.5 h-3.5 animate-bounce text-emerald-600" />
                <span>ETA: {deliveryDay}</span>
              </span>
              <span className="text-zinc-450 block font-semibold">{product.totalSales} Secure transactions</span>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* Add to basket */}
            <button
              onClick={() => onAddToCart(product)}
              className="py-3 px-3.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-350 text-zinc-950 text-[10.5px] uppercase font-mono tracking-widest font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs hover:shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#092215]" />
              <span>Add Cart</span>
            </button>

            {/* Instant checkout buy now */}
            <button
              onClick={() => onBuyNow(product)}
              className="py-3 px-3.5 bg-[#092215] hover:bg-[#113a26] text-[#E5C158] text-[10.5px] uppercase font-mono tracking-widest font-black rounded-xl transition-all shadow-3xs active:scale-97 cursor-pointer flex items-center justify-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 fill-[#E5C158]" />
              <span>Buy Now</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
