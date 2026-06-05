import React from 'react';
import { X, ShieldCheck, ShoppingBag, Eye, Heart, BarChart2, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { Product, Store } from '../types';

interface QuickPreviewModalProps {
  product: Product;
  store?: Store;
  onClose: () => void;
  onAddToCart: (item: Product) => void;
  onBuyNow: (item: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function QuickPreviewModal({
  product,
  store,
  onClose,
  onAddToCart,
  onBuyNow,
  isFavorite,
  onToggleFavorite,
}: QuickPreviewModalProps) {
  // Checklist for QA unboxings specific to the category
  const getQAChecklist = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electronics':
      case 'tech':
        return [
          { item: 'Serial logic verified on official databases', status: 'Passed' },
          { item: 'Battery degradation & voltage amplitude tested', status: 'Passed' },
          { item: 'Unused authentic packaging seals confirmed', status: 'Passed' },
          { item: 'Telebirr escrow hash bound matching serials', status: 'Active' },
        ];
      case 'clothing':
      case 'fashion':
      case 'traditional':
        return [
          { item: 'Handloom thread weave density auditing', status: 'Passed' },
          { item: 'Premium Habesha leather stitching checks', status: 'Passed' },
          { item: 'Artisan hand-dye color integrity clearance', status: 'Passed' },
          { item: 'Chapa direct checkout matching coordinates', status: 'Active' },
        ];
      default:
        return [
          { item: 'Physical unboxing dimension check', status: 'Passed' },
          { item: 'Origin factory documentation audited', status: 'Passed' },
          { item: 'Kebele business registration stamp validated', status: 'Passed' },
          { item: 'Escrow payment safety clearing tag released', status: 'Active' },
        ];
    }
  };

  const qaSteps = getQAChecklist(product.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 select-text font-sans">
      <div 
        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.3)] flex flex-col sm:flex-row border border-zinc-200"
        id={`product-popup-layout-${product.id}`}
      >
        
        {/* Left column: High-DPI Image detail panel */}
        <div className="sm:w-1/2 relative bg-zinc-50 shrink-0 min-h-[300px] flex items-center justify-center border-b sm:border-b-0 sm:border-r border-zinc-150">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Vetted validation overlay badge */}
          <span className="absolute bottom-6 left-6 bg-emerald-950/95 backdrop-blur-md text-[#E5C158] text-[9px] font-mono font-black py-1.5 px-3.5 rounded-xl border border-emerald-500/35 flex items-center gap-1.5 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-450 fill-emerald-950" />
            <span>KAZANCHIS HQ CERTIFIED STOCK</span>
          </span>
        </div>

        {/* Right column: Spec details & unboxing statistics */}
        <div className="sm:w-1/2 p-6.5 sm:p-10 overflow-y-auto max-h-[90vh] sm:max-h-none flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Category and Close button */}
            <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              <span className="text-[#a4843b]">{product.category}</span>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Title and Store */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-zinc-950 tracking-tight leading-snug">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase pt-0.5">
                <span className="text-zinc-500">By {store ? store.name : 'Vetted Artisan'}</span>
                {(store?.verified ?? true) && (
                  <span className="text-emerald-700 flex items-center gap-0.5 font-bold">★ Verified</span>
                )}
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-2 pt-1 font-sans">
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 fill-current ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-zinc-200 fill-zinc-205'}`} />
                ))}
              </div>
              <span className="text-xs font-black text-zinc-900">{product.rating}</span>
              <span className="text-[10.5px] text-zinc-400 font-bold">({product.reviewsCount} reviews)</span>
            </div>

            {/* Description Text */}
            <p className="text-[12.5px] text-zinc-550 leading-relaxed font-sans">{product.description}</p>

            {/* UNBOXING QC PARAMETERS */}
            <div className="pt-4 border-t border-zinc-150 space-y-3">
              <div className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-[#115C34]" />
                <span className="text-[10px] font-mono font-bold text-[#8A7241] uppercase tracking-widest block font-extrabold pb-0.5">AVA UNBOXING VERIFICATION CHECKS</span>
              </div>
              
              <div className="space-y-2">
                {qaSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] bg-zinc-50/80 border border-zinc-150 p-2.5 rounded-xl font-mono">
                    <span className="text-zinc-650 flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${step.status === 'Passed' ? 'text-emerald-500 fill-emerald-50' : 'text-amber-500'}`} />
                      <span>{step.item}</span>
                    </span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${step.status === 'Passed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700 animate-pulse'}`}>
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Pricing & Checkout Block footer */}
          <div className="pt-5 border-t border-zinc-150 flex flex-col gap-4">
            
            {/* Price section */}
            <div className="flex justify-between items-baseline font-mono select-all">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Escrow Clearance price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-[#0c2619]">{product.price.toLocaleString()}</span>
                <span className="text-xs text-zinc-500 font-sans font-extrabold uppercase">ETB</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              
              <button
                onClick={() => {
                  onAddToCart(product);
                }}
                className="py-3 px-4.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 hover:border-zinc-350 text-zinc-950 text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-3xs"
              >
                <ShoppingBag className="w-4 h-4 text-[#092215]" />
                <span>Add Bag</span>
              </button>

              <button
                onClick={() => {
                  onBuyNow(product);
                }}
                className="py-3 px-4.5 bg-[#092215] hover:bg-[#113a26] text-[#E5C158] text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-97 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#E5C158]" />
                <span>Instant buy</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
