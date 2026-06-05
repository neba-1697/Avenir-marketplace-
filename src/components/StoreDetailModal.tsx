import React, { useState } from 'react';
import { X, ShieldCheck, Heart, Search, Star, MessageSquare, Share2, ShoppingBag, MapPin, Sparkles, Plus, Check } from 'lucide-react';
import { Store, Product, Service } from '../types';
import ProductCard from './ProductCard';

interface StoreDetailModalProps {
  store: Store;
  onClose: () => void;
  products: Product[];
  services: Service[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddToCart: (item: any) => void;
  onBuyNow: (item: any) => void;
  onQuickPreview: (item: Product) => void;
}

export default function StoreDetailModal({
  store,
  onClose,
  products,
  services,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onBuyNow,
  onQuickPreview,
}: StoreDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'listings' | 'services' | 'reviews'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFollowed, setIsFollowed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter store-specific items
  const storeProducts = products.filter(
    p => p.storeId === store.id && p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const storeServices = services.filter(
    s => s.id.includes(store.id) || s.providerName.toLowerCase().includes(store.name.toLowerCase())
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.host}/store/${store.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Mock store reviews generated dynamically
  const reviews = [
    {
      id: 1,
      author: 'Eleni G. (Verified Buyer)',
      rating: 5,
      date: 'Addis Ababa - 2 days ago',
      comment: 'Absolutely superb. The Escrow inspection cleared within 2 hours. High premium packaging and authentic item quality!',
    },
    {
      id: 2,
      author: 'Dawit T. (Corporate Client)',
      rating: 4.8,
      date: 'Bole - 1 week ago',
      comment: 'Very professional, the shipping was on time. Love the digital unboxing video they shared before dispatching.',
    },
    {
      id: 3,
      author: 'Sileshi K. (Verified Buyer)',
      rating: 5,
      date: 'Kazanchis - 3 weeks ago',
      comment: 'Genuine artisan check! Avenir inspection stamp was on the box. Highly recommended merchant core!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 select-text font-sans">
      <div 
        className="relative bg-white w-full max-w-6xl h-[90vh] rounded-[32px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.3)] flex flex-col border border-zinc-200"
        id={`store-details-board-${store.id}`}
      >
        
        {/* Banner with Close Trigger */}
        <div className="relative h-48 sm:h-64 shrink-0 bg-[#092215]">
          <img 
            src={store.banner} 
            alt={store.name} 
            className="w-full h-full object-cover brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          {/* Close trigger and Share */}
          <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
            <button
              onClick={handleCopyLink}
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[#FAF9F6] transition-all cursor-pointer relative"
              title="Copy store link"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute right-0 top-12 bg-emerald-950 text-emerald-300 font-mono text-[8px] font-black px-2 py-1.5 rounded-md whitespace-nowrap border border-emerald-500/20">
                  COPIED LINK!
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-white/90 hover:bg-white text-zinc-950 rounded-full backdrop-blur-md transition-all shadow cursor-pointer"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Logo & Core Title info */}
          <div className="absolute bottom-6 left-6 sm:left-10 flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1.5 border border-zinc-200 shadow-xl overflow-hidden shrink-0">
              <img 
                src={store.logo} 
                alt={store.name} 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-1.5 mb-1 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-[8.5px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Merchant</span>
                </span>
                <span className="bg-[#E5C158]/20 border border-[#E5C158]/35 text-[#E5C158] text-[8.5px] font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                  ⭐ {store.rating} Score
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-none text-[#FAF9F6]">
                {store.name}
              </h2>
              <p className="text-[10px] text-zinc-350 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {store.location} • {store.totalSales} escrow orders settled
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Action layout Bar */}
        <div className="bg-zinc-50 border-b border-zinc-150 py-4 px-6 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          
          {/* TAB OPTIONS NAVIGATION */}
          <div className="flex gap-1 bg-zinc-200/60 border border-zinc-200 p-0.5 rounded-xl text-xs font-bold leading-none select-none">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'listings' ? 'bg-[#092215] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Active Products ({storeProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-[#092215] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Services ({storeServices.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'reviews' ? 'bg-[#092215] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Client Feedbacks ({reviews.length})
            </button>
          </div>

          {/* Social followers states and controls */}
          <div className="flex items-center gap-3.5 justify-end">
            <div className="text-right text-xs font-mono font-bold leading-tight">
              <span className="block text-zinc-500">SUBSCRIBERS</span>
              <span className="text-zinc-950 font-black">
                {(store.followersCount + (isFollowed ? 1 : 0)).toLocaleString()} Active
              </span>
            </div>

            {/* Follow Store Trigger */}
            <button
              onClick={() => setIsFollowed(!isFollowed)}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer active:scale-97 ${
                isFollowed
                  ? 'bg-zinc-850 hover:bg-zinc-900 text-white'
                  : 'bg-[#092215] hover:bg-[#113a26] text-[#E5C158]'
              }`}
            >
              {isFollowed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Content scroll field */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-none space-y-8 bg-zinc-50/20">

          {/* In-Store Search Field (for Listings tab) */}
          {activeTab === 'listings' && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search inside merchant active catalog..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 focus:border-[#115C34] text-xs text-zinc-805 rounded-xl focus:outline-none"
              />
            </div>
          )}

          {/* TAB 1: LISTINGS PRODUCT CARDS SHELF */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeProducts.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    store={store}
                    isFavorite={favorites.includes(p.id)}
                    onToggleFavorite={onToggleFavorite}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                    onQuickPreview={onQuickPreview}
                  />
                ))}
              </div>

              {storeProducts.length === 0 && (
                <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-3xl text-zinc-400 text-xs font-medium">
                  No active products found matching description.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SPECIALIZED SERVICES SHELF */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeServices.map(serv => (
                  <div 
                    key={serv.id} 
                    className="bg-white border rounded-3xl p-6 shadow-3xs hover:border-[#115C34] transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-4">
                      <div className="flex gap-3.5 items-center">
                        <img src={serv.image} alt={serv.name} className="w-12 h-12 rounded-full object-cover border border-zinc-150" />
                        <div>
                          <span className="bg-emerald-50 text-emerald-700 text-[8px] font-mono font-black border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Verified Provider
                          </span>
                          <h4 className="font-serif font-black text-sm mt-1 text-zinc-950 tracking-tight leading-tight">{serv.name}</h4>
                          <p className="text-[#a4843b] text-[10px] font-bold">👤 {serv.providerName}</p>
                        </div>
                      </div>

                      <p className="text-zinc-500 text-xs leading-relaxed font-sans">{serv.description}</p>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-zinc-400 font-mono font-bold uppercase block leading-none">Vetted Tariff</span>
                        <span className="text-[#092215] font-mono font-bold text-xs mt-1 block">
                          {serv.price.toLocaleString()} ETB <span className="text-[9px] text-zinc-400 font-sans font-bold uppercase">({serv.chargeType})</span>
                        </span>
                      </div>

                      <button 
                        onClick={() => onAddToCart({ ...serv, name: serv.name })}
                        className="px-4.5 py-2.5 bg-[#092215] hover:bg-[#113a26] text-white font-serif font-black rounded-lg text-[10.5px] uppercase tracking-wider cursor-pointer shadow-3xs transition-transform duration-200"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {storeServices.length === 0 && (
                <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-3xl text-zinc-400 text-xs font-medium">
                  No registered services found for this merchant.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VERIFIED STORE REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-3xl">
              <h4 className="text-sm font-serif font-black text-[#092215] uppercase tracking-wide">Verified Merchant reviews</h4>
              
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="bg-white border rounded-2xl p-5.5 space-y-3 shadow-3xs">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-zinc-950 block">{rev.author}</span>
                        <span className="text-[10px] text-zinc-400 font-mono tracking-wide">{rev.date}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-550 leading-relaxed font-sans">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
