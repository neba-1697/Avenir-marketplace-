import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, Product, Service, Property, VideoListing, Language } from '../types';
import ProductCard from './ProductCard';
import AvenirDiscover from './AvenirDiscover';
import { ChevronLeft, Star, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

interface StorefrontProps {
  stores: Store[];
  products: Product[];
  services: Service[];
  properties: Property[];
  videos: VideoListing[];
  language: Language;
  onAddToCart: (item: any) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onQuickPreview: (item: Product) => void;
}

export default function Storefront({
  stores,
  products,
  services,
  properties,
  videos,
  language,
  onAddToCart,
  favorites,
  onToggleFavorite,
  onQuickPreview
}: StorefrontProps) {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  
  // Custom theme colors state
  const [themeColor, setThemeColor] = useState('#115C34');

  // Convert slug back to store info (naive approach: match by lowercase name with hyphens)
  const store = stores.find(s => encodeURIComponent(s.name.toLowerCase().replace(/\s+/g, '-')) === storeSlug) || stores[0];

  if (!store) {
    return <div className="text-center py-20">Store not found.</div>;
  }

  const storeProducts = products.filter(p => p.storeId === store.id);
  const storeServices = services.filter(s => s.storeId === store.id);
  const storeProperties = properties.filter(p => p.storeId === store.id);
  const storeVideos = videos.filter(v => v.storeId === store.id);

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Store Header / Hero */}
      <div className="relative h-64 md:h-80 bg-zinc-900 border-b overflow-hidden group">
        <img src={store.banner} alt={store.name} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        <div className="absolute top-6 left-6 z-20">
          <Link to="/" className="flex items-center gap-1.5 text-white/80 hover:text-white font-mono text-[10px] font-black uppercase tracking-widest bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-full transition-all backdrop-blur-md">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6 md:left-12 flex items-end gap-6 z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-1.5 shadow-2xl border-2 border-white overflow-hidden shrink-0">
            <img src={store.logo} alt={store.name} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
          </div>
          
          <div className="space-y-1.5 text-white pb-1 flex-1">
            <div className="flex flex-wrap gap-2 items-center mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 backdrop-blur-sm">
                <ShieldCheck className="w-3 h-3" /> VETTED
              </span>
              <span className="bg-white/10 text-[#E5C158] font-mono text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E5C158]/30 flex items-center gap-1 backdrop-blur-sm">
                <Star className="w-3 h-3 fill-current" /> {store.rating} ({store.reviewsCount})
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight drop-shadow-md">{store.name}</h1>
            <p className="flex items-center gap-1.5 text-zinc-300 text-[11px] font-mono font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" /> {store.location}
            </p>
          </div>
        </div>

        {/* Customization controls for demo purposes */}
        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl flex gap-2">
          <span className="text-white text-[9px] font-mono font-bold self-center mr-1">BRAND COLOR:</span>
          {['#115C34', '#092215', '#A4843B', '#111827', '#4F46E5'].map(c => (
            <button key={c} onClick={() => setThemeColor(c)} className="w-5 h-5 rounded-full cursor-pointer border hover:scale-110 transition-transform" style={{ backgroundColor: c, borderColor: c === themeColor ? 'white' : 'transparent' }} title={c}></button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Column: Store Details */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-6 border shadow-sm" style={{ borderColor: `${themeColor}20` }}>
            <h3 className="font-serif font-black text-lg text-zinc-900 mb-3 tracking-tight">About Store</h3>
            <p className="text-[12.5px] text-zinc-600 font-sans leading-relaxed mb-6">{store.description}</p>
            
            <div className="space-y-4 font-mono">
              <div>
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Sales Completed</span>
                <p className="text-sm font-black text-zinc-900">{store.totalSales.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Followers</span>
                <p className="text-sm font-black text-zinc-900">{store.followersCount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Shipping</span>
                <p className="text-xs font-semibold text-zinc-700 leading-tight mt-0.5 font-sans">{store.deliveryInfo}</p>
              </div>
            </div>

            <button 
              className="w-full mt-6 py-2.5 rounded-xl text-white font-mono text-[10px] uppercase font-black tracking-widest hover:opacity-90 transition-opacity"
              style={{ backgroundColor: themeColor }}
            >
              Follow Store
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
             <div className="flex items-center gap-2 mb-2 break-words">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="font-serif font-black text-emerald-900 text-sm">Escrow Protection</h4>
             </div>
             <p className="text-[11px] text-emerald-800 font-sans leading-relaxed">{store.returnPolicy}</p>
          </div>
        </div>

        {/* Right Column: Catalog & Content */}
        <div className="md:col-span-9 space-y-12">
          
          {/* Store Videos (Discover Reels) */}
          {storeVideos.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-black tracking-tight" style={{ color: themeColor }}>Store Reels</h2>
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1 bg-zinc-100 rounded-full text-zinc-500">Live Showcases</span>
              </div>
              <div className="bg-white border border-zinc-150 rounded-3xl p-6 overflow-hidden">
                <AvenirDiscover
                  language={language}
                  videos={storeVideos}
                  allProducts={products}
                  onAddToCart={onAddToCart}
                  favorites={favorites}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            </div>
          )}

          {/* Featured Products */}
          {storeProducts.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-black tracking-tight" style={{ color: themeColor }}>Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    store={store}
                    isFavorite={favorites.includes(prod.id)}
                    onToggleFavorite={onToggleFavorite}
                    onAddToCart={onAddToCart}
                    onBuyNow={(item) => onAddToCart(item)}
                    onQuickPreview={onQuickPreview}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
