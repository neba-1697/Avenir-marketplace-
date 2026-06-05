/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Heart, Landmark, Globe, Search, ClipboardList, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenSellerPortal: () => void;
  onOpenTracking: () => void;
}

export default function Header({
  language,
  setLanguage,
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenFavorites,
  onOpenSellerPortal,
  onOpenTracking,
}: HeaderProps) {
  const t = translations[language];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-zinc-150/80 sticky top-0 z-40 font-sans shadow-xs transition-all duration-300" id="avenir-master-header">
      {/* Premium Notification Ticker Banner */}
      <div className="bg-[#0b2b1a] text-[#E5C158] py-2 px-6 flex items-center justify-between text-[11px] tracking-wide font-medium border-b border-[#0f3420]">
        <div className="flex items-center gap-3 w-full justify-center md:justify-start">
          <span className="bg-[#E5C158]/10 text-[#E5C158] text-[9px] font-mono leading-none font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#E5C158]/35">
            {t['header.compliance'] || 'PLATFORM COMPLIANCE'}
          </span>
          <span className="text-zinc-300 font-sans text-xs flex items-center gap-1.5 font-medium">
             {t['header.inspectedEscrow'] || '100% Inspected Escrow Protected trade enabled across Ethiopia & East Africa.'}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-zinc-300 font-mono text-[10.5px]">
          <span className="flex items-center gap-1">{t['header.utc'] || '🗺️ UTC: Addis Ababa'}</span>
          <span>•</span>
          <span className="font-bold text-[#E5C158]">{t['header.currency'] || 'ETB (ብር)'}</span>
        </div>
      </div>

      {/* Main Brand Corporate Header row */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* BRAND IDENTITY */}
        <div className="flex items-center gap-3.5 select-none shrink-0">
          <div className="w-10 h-10 bg-[#092215] flex items-center justify-center rounded-xl shadow-[0_4px_12px_rgba(9,34,21,0.15)] border border-[#0d2f1d]">
            <Landmark className="w-5 h-5 text-[#E6DCC3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-black tracking-widest text-[#092215]">
                {t['brand.name'] || 'AVENIR'}
              </span>
              <span className="bg-[#EAF3EE] text-[#115C34] text-[8px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest border border-[#C6DFC3]">
                {t['header.verifiedCorporate'] || 'VERIFIED CORPORATE'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium font-sans tracking-wide mt-0.5 uppercase">{t['header.metropolitan'] || 'Checked, Sealed & Delivered in East Africa'}</p>
          </div>
        </div>

        {/* NAVIGATION MENUS */}
        <nav className="hidden lg:flex items-center gap-7 text-[12.5px] font-sans font-semibold text-zinc-600">
          <a href="#avenir-categories" className="hover:text-[#092215] transition-colors">{t['header.categories'] || 'Categories'}</a>
          <a href="#avenir-trending" className="hover:text-[#092215] transition-colors">{t['header.trending'] || 'Trending'}</a>
          <a href="#avenir-discover" className="hover:text-[#092215] transition-colors">{t['header.discoverReels'] || 'Discover Reels'}</a>
          <a href="#avenir-services" className="hover:text-[#092215] transition-colors">{t['header.expertServices'] || 'Expert Services'}</a>
          <a href="#avenir-realestate" className="hover:text-[#092215] transition-colors">{t['header.realEstate'] || 'Real Estate'}</a>
          <a href="#avenir-ai-assistant" className="hover:text-[#092215] transition-colors flex items-center gap-1 text-[#115C34]">
            <span className="w-1.5 h-1.5 bg-[#115C34] rounded-full animate-pulse"></span>
            {t['header.geminiAI'] || 'Gemini Shopping AI'}
          </a>
        </nav>

        {/* INTERACTIVITY AND ACTION CONTROLS */}
        <div className="flex items-center gap-3 flex-wrap justify-end w-full md:w-auto">
          
          {/* LANGUAGE PICKER */}
          <div className="bg-zinc-100 border border-zinc-200/60 p-0.5 rounded-lg flex gap-0.5 text-[10px] select-none font-bold">
            {(['en', 'am', 'om'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-md font-bold uppercase transition-all duration-200 ${
                  language === lang 
                    ? 'bg-[#092215] text-white shadow-xs' 
                    : 'text-zinc-500 hover:text-zinc-900 cursor-pointer'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'am' ? 'አማ' : 'OM'}
              </button>
            ))}
          </div>

          {/* Seller registry */}
          <button
            onClick={onOpenSellerPortal}
            className="flex items-center gap-1.5 text-zinc-700 hover:text-zinc-950 transition-colors py-1.5 px-3 bg-zinc-50 border border-zinc-205 rounded-lg text-xs font-bold cursor-pointer hover:border-zinc-350"
          >
            <ClipboardList className="w-3.5 h-3.5 text-[#a4843b]" />
            <span className="font-sans">{t['header.merchantPortal'] || 'Merchant Portal'}</span>
          </button>

          {/* Tracking */}
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 text-zinc-700 hover:text-[#092215] transition-colors py-1.5 px-3 bg-[#EAF3EE] border border-emerald-250 rounded-lg text-xs font-bold cursor-pointer"
          >
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t['header.trackEscrow'] || 'Track Escrow Order'}
          </button>

          {/* Favorites */}
          <button
            onClick={onOpenFavorites}
            className="flex items-center justify-center p-2 text-zinc-650 hover:text-[#115C34] transition-colors relative cursor-pointer"
            aria-label="Favorites"
          >
            <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Cart Drawer triggering button */}
          <button
            onClick={onOpenCart}
            className="flex items-center justify-center gap-2 p-2.5 px-4 bg-[#092215] hover:bg-[#113a26] text-white rounded-lg transition-all font-bold text-xs shadow-sm cursor-pointer duration-200 uppercase tracking-wider"
          >
            <ShoppingBag className="w-4 h-4 text-[#E5C158]" />
            <span>{t['header.bag'] || 'Bag'}</span>
            {cartCount > 0 ? (
              <span className="bg-[#E5C158] text-zinc-950 rounded-full text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center">
                {cartCount}
              </span>
            ) : (
              <span className="opacity-60 text-[11px] font-mono">0</span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
