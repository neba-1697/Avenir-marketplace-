/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Sparkles, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeroProps {
  language: Language;
  onSearch: (query: string) => void;
  onSelectSuggestion: (category: string) => void;
}

export default function Hero({ language, onSearch, onSelectSuggestion }: HeroProps) {
  const [internalQuery, setInternalQuery] = useState('');
  const t = translations[language];

  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(internalQuery);
  };

  const suggestionChips = [
    { label: 'MacBook Pro', search: 'MacBook' },
    { label: 'Traditional Habesha Dress', search: 'Kemis' },
    { label: 'Bole Executive Apartments', search: 'Apartment' },
    { label: 'Chelsa Leather Boots', search: 'Boots' },
    { label: 'Sidamo Organic Co-ops Beans', search: 'Coffee' },
  ];

  return (
    <div className="relative bg-[#071910] text-white overflow-hidden py-24 sm:py-32 font-sans" id="avenir-homepage-hero">
      
      {/* authentic modern African metropolitan background overlay pattern */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <img 
          src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1600&auto=format&fit=crop" 
          alt="African Sky Metropolitan Addis Ababa" 
          className="w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Luxury Golden Glow Radial Gradients */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF9F6] to-transparent z-1"></div>
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#E5C158]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-[#115C34]/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 items-center">
        
        {/* LEFT COLUMN: Main copy titles */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-8 text-left">
          
          {/* Micro Branding Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E5C158]/10 border border-[#E5C158]/35 px-4.5 py-2 rounded-full text-[#E5C158] text-[10.5px] uppercase font-mono font-bold tracking-widest leading-none">
            <ShieldCheck className="w-4 h-4 text-[#E5C158]" /> 
            <span>{t['hero.unboxingBadge'] || 'MANUAL QUALITY UNBOXINGS & SECURE ESCROW AGENT CORES'}</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-white leading-[1.05] tracking-tight max-w-4xl">
              {t['hero.vettedGateway'] || 'The Vetted'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C158] via-emerald-300 to-amber-200">Gateway</span> {t['hero.taglineText'] || 'to African Commerce.'}
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-medium">
              {t['hero.securingEvery'] || 'We eliminate buyer-merchant friction completely. Every product cataloged executes under automated Telebirr and Chapa Escrow guarantees, verified by physical unboxing inspectors before courier loading.'}
            </p>
          </div>

          {/* Luxury Search Experience */}
          <div className="space-y-4 max-w-2xl">
            <form onSubmit={handleFormSearch} className="flex flex-col sm:flex-row bg-[#0c2619] border border-emerald-500/30 rounded-2xl p-2 focus-within:border-[#E5C158]/85 transition-all duration-300 shadow-xl gap-2/5 justify-between">
              <div className="flex-1 flex items-center gap-3 px-3.5 py-3">
                <Search className="w-5 h-5 text-[#E5C158]/80 shrink-0" />
                <input
                  type="text"
                  value={internalQuery}
                  onChange={e => setInternalQuery(e.target.value)}
                  placeholder={t['hero.inputPlaceholder'] || 'Ask specified criteria inside goods, local services, properties...'}
                  className="w-full bg-transparent text-[#FAF9F6] text-xs sm:text-sm placeholder-zinc-500 focus:outline-none py-1 font-medium font-sans border-0"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-[#e6c158] to-[#bca04a] hover:from-[#f6ce5e] hover:to-[#cdad4f] text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 shrink-0 font-serif"
              >
                <span>{t['hero.deployEngine'] || 'Deploy Engine'}</span>
                <ArrowRight className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
              </button>
            </form>

            {/* Simulated interactive chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#E5C158]/80 uppercase mr-1">
                <TrendingUp className="w-3.5 h-3.5" /> {t['hero.hotQueries'] || 'Hot Queries:'}
              </span>
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInternalQuery(chip.search);
                    onSelectSuggestion(chip.search);
                  }}
                  className="px-3.5 py-1.5 bg-[#092015]/80 hover:bg-[#113a26] border border-emerald-500/15 rounded-full text-[11px] font-medium transition-all text-zinc-350 hover:text-[#FAF9F6] cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
