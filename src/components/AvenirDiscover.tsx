import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, Tag, ShoppingBag, Store, Volume2, VolumeX, Share2, Plus, Check } from 'lucide-react';
import { VideoListing, Product, Language } from '../types';

interface AvenirDiscoverProps {
  language: Language;
  videos: VideoListing[];
  allProducts: Product[];
  onAddToCart: (item: any) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function AvenirDiscover({
  language,
  videos,
  allProducts,
  onAddToCart,
  favorites,
  onToggleFavorite,
}: AvenirDiscoverProps) {
  const [activeVidIdx, setActiveVidIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedList, setLikedList] = useState<string[]>([]);
  const [followedStores, setFollowedStores] = useState<string[]>([]);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currVideo = videos[activeVidIdx];

  // Map products of the active video
  const associatedTags = currVideo ? currVideo.productTags : [];

  // Re-play video on switch
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(e => {
          console.log('Autoplay request delayed:', e);
        });
      }
    }
  }, [activeVidIdx]);

  // Handle play status transitions
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedList(prev => (prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]));
  };

  const handleToggleFollow = (storeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowedStores(prev =>
      prev.includes(storeId) ? prev.filter(sid => sid !== storeId) : [...prev, storeId]
    );
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mockShareLink = `${window.location.host}/discover-reel/${currVideo?.id || 'id'}`;
    navigator.clipboard.writeText(mockShareLink);
    setShowShareTooltip(true);
    setTimeout(() => {
      setShowShareTooltip(false);
    }, 2500);
  };

  // Next/prev for infinite scroll snap feeling
  const handleNextVideo = () => {
    if (activeVidIdx < videos.length - 1) {
      setActiveVidIdx(prev => prev + 1);
    } else {
      setActiveVidIdx(0); // loop
    }
  };

  const handlePrevVideo = () => {
    if (activeVidIdx > 0) {
      setActiveVidIdx(prev => prev - 1);
    } else {
      setActiveVidIdx(videos.length - 1); // loop
    }
  };

  return (
    <div className="space-y-8 font-sans text-zinc-800" id="discover-reels-ambient-section">
      
      {/* 2-Column Shoppable Experience */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* PLAYER WRAPPER: Responsive Height, vertical snap style (ColSpan 7) */}
        <div className="md:col-span-7 bg-zinc-950 rounded-[40px] overflow-hidden aspect-[9/16] relative shadow-[0_24px_50px_rgba(0,0,0,0.4)] border border-zinc-850 group flex flex-col justify-end">
          
          {/* HTML5 Streaming Video Player node */}
          {currVideo ? (
            <div className="absolute inset-0 w-full h-full select-none">
              <video
                ref={videoRef}
                src={currVideo.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover brightness-95"
                onClick={() => setIsPlaying(!isPlaying)}
              />

              {/* Dynamic ambient dark vignette overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50 pointer-events-none" 
                onClick={() => setIsPlaying(!isPlaying)}
              />

              {/* Play / Unmute feedback prompt at center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!isPlaying && (
                  <div className="p-5 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/15 shadow-2xl scale-110 transition-transform">
                    <Play className="w-8 h-8 text-[#E5C158] fill-[#E5C158]" />
                  </div>
                )}
                {isMuted && isPlaying && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[#E5C158] text-[10.5px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse pointer-events-auto cursor-pointer" onClick={() => setIsMuted(false)}>
                    <VolumeX className="w-4 h-4 text-[#E5C158]" />
                    <span>Tap to Unmute Audio</span>
                  </div>
                )}
              </div>

              {/* ACTION OVERLAY BAR (Top right actions) */}
              <div className="absolute top-6 right-6 flex flex-col gap-3.5 z-20 items-end">
                
                {/* Audio volume controller */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 bg-black/60 hover:bg-black/85 border border-white/15 text-white rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-105 active:scale-90 cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4.5 h-4.5 text-zinc-350" /> : <Volume2 className="w-4.5 h-4.5 text-[#E5C158]" />}
                </button>

                {/* Navigation helpers (Infinite scroll emulation clicks) */}
                <button
                  onClick={handlePrevVideo}
                  className="p-3 bg-black/60 hover:bg-black/85 border border-white/15 text-white rounded-full backdrop-blur-md text-[10px] font-mono leading-none tracking-widest cursor-pointer hover:scale-105 active:scale-90"
                  title="Previous reel"
                >
                  ▲
                </button>
                <button
                  onClick={handleNextVideo}
                  className="p-3 bg-black/60 hover:bg-black/85 border border-white/15 text-white rounded-full backdrop-blur-md text-[10px] font-mono leading-none tracking-widest cursor-pointer hover:scale-105 active:scale-90 animate-bounce"
                  title="Next reel"
                >
                  ▼
                </button>
              </div>

              {/* PRIMARY INTERACTION COLUMN BAR (Floating Vertical layout on right) */}
              <div className="absolute right-6 bottom-32 flex flex-col items-center gap-5.5 z-20">
                
                {/* LIKE TRIGGER */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={(e) => handleToggleLike(currVideo.id, e)}
                    className={`p-3.5 rounded-full border transition-all cursor-pointer shadow-lg backdrop-blur-md hover:scale-110 active:scale-90 ${
                      likedList.includes(currVideo.id)
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'bg-black/60 border-white/15 text-white hover:text-rose-400'
                    }`}
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-white tracking-wide shadow-sm">
                    {(currVideo.likes + (likedList.includes(currVideo.id) ? 1 : 0)).toLocaleString()}
                  </span>
                </div>

                {/* WISHLIST/SAVE TRIGGER */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(currVideo.productTags[0]?.itemId || '');
                    }}
                    className={`p-3.5 rounded-full border transition-all cursor-pointer shadow-lg backdrop-blur-md hover:scale-110 active:scale-90 ${
                      favorites.includes(currVideo.productTags[0]?.itemId || '')
                        ? 'bg-[#E5C158] border-[#E5C158] text-zinc-950'
                        : 'bg-black/60 border-white/15 text-white hover:text-[#E5C158]'
                    }`}
                  >
                    <Tag className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-white tracking-wide shadow-sm">
                    {favorites.includes(currVideo.productTags[0]?.itemId || '') ? 'Saved' : 'Save'}
                  </span>
                </div>

                {/* SHARE TRIGGER WITH DESIGN NOTIFICATION */}
                <div className="flex flex-col items-center gap-1 relative">
                  <button
                    onClick={handleShare}
                    className="p-3.5 bg-black/60 hover:bg-black/85 border border-white/15 text-white rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-110 active:scale-90 cursor-pointer"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-white tracking-wide shadow-sm">Share</span>
                  
                  {showShareTooltip && (
                    <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-emerald-950 border border-emerald-500/35 text-emerald-300 font-mono text-[9px] font-black px-3.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-30 uppercase tracking-widest animate-pulse leading-none shadow-emerald-950/20">
                      ✓ Secure Link Copied!
                    </div>
                  )}
                </div>

              </div>

              {/* USER INFO PANEL & FOLLOW HOVER BAR */}
              <div className="absolute left-6 bottom-8 right-16 space-y-3 text-white z-20 pointer-events-auto">
                
                {/* Merchant detail line */}
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full border border-white/15 bg-zinc-900 overflow-hidden shrink-0 shadow-sm">
                    <img src={currVideo.storeLogo} alt={currVideo.storeName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-black text-xs leading-none tracking-wide text-[#FAF9F6]">
                        @{currVideo.storeName}
                      </span>
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    </div>
                    <p className="text-[8px] font-mono text-zinc-400 font-bold uppercase tracking-widest">VERIFIED MERCHANT</p>
                  </div>

                  {/* Follow store action toggle */}
                  <button
                    onClick={(e) => handleToggleFollow(currVideo.storeId, e)}
                    className={`ml-2 px-3 py-1.5 rounded-full text-[9px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md transition-all border cursor-pointer ${
                      followedStores.includes(currVideo.storeId)
                        ? 'bg-zinc-800 border-zinc-700 text-emerald-400'
                        : 'bg-[#E5C158] border-[#E5C158] text-zinc-950 px-3.5'
                    }`}
                  >
                    {followedStores.includes(currVideo.storeId) ? (
                      <>
                        <Check className="w-2.5 h-2.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-2.5 h-2.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Video description content text */}
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="text-sm font-serif font-black text-[#FAF9F6] tracking-wide leading-tight line-clamp-1 uppercase">
                    {currVideo.title}
                  </h3>
                  <p className="text-[11px] text-zinc-300 leading-normal font-medium font-sans line-clamp-2">
                    {currVideo.description}
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <p className="text-zinc-500 text-xs font-medium p-10 text-center">Reel index load error.</p>
          )}

        </div>

        {/* SHOPPABLE ITEMS TAGGED INFO COLUMN (ColSpan 5) */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* Linked Products Feed list wrapper */}
          <div className="space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-zinc-150">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#8A7241] uppercase block">ACTIVE SHOPPING HOOKS</span>
                <h4 className="text-sm font-serif font-black text-[#092215] tracking-wide uppercase">
                  Tagged escrow items ({associatedTags.length})
                </h4>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-mono text-[9px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1 uppercase tracking-wider select-none shrink-0">
                ⭐ 100% Genuine Check
              </span>
            </div>
            
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-none">
              {associatedTags.map(tag => {
                const completeProduct = allProducts.find(p => p.id === tag.itemId);
                return (
                  <div 
                    key={tag.itemId}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 flex gap-4 hover:border-[#115C34]/35 transition-all shadow-[0_2px_8px_rgba(9,34,21,0.01)] hover:shadow-md"
                  >
                    {completeProduct ? (
                      <img src={completeProduct.image} alt={tag.name} className="w-14 h-14 rounded-xl object-cover bg-zinc-50 shrink-0 border border-zinc-150 shadow-sm" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-14 h-14 bg-zinc-50 border border-zinc-200 rounded-xl shrink-0 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-zinc-400" />
                      </div>
                    )}
                    
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-center text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                          <span className="text-[#a4843b]">{tag.itemType}</span>
                          <span className="text-[#115C34] flex items-center gap-0.5 font-bold">★ Verified</span>
                        </div>
                        <h5 className="text-[12.5px] font-bold text-zinc-950 mt-1 line-clamp-1 leading-none">{tag.name}</h5>
                        <div className="flex items-baseline gap-1 mt-1 font-mono">
                          <span className="text-xs font-black text-zinc-900">{tag.price.toLocaleString()}</span>
                          <span className="text-[9px] text-zinc-400 font-sans font-bold uppercase">ETB</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          const itemContext = completeProduct || { id: tag.itemId, name: tag.name, price: tag.price, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100' };
                          onAddToCart(itemContext);
                        }}
                        className="w-full mt-3 py-2 bg-zinc-950 hover:bg-[#115C34] text-white rounded-lg text-[10px] font-mono font-black uppercase transition-all tracking-wider cursor-pointer shadow-sm active:scale-97"
                      >
                        Secure with Escrow Gate
                      </button>
                    </div>
                  </div>
                );
              })}

              {associatedTags.length === 0 && (
                <div className="text-center py-10 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl text-zinc-400 text-xs font-medium">
                  No linked items found on this node.
                </div>
              )}
            </div>
          </div>

          {/* CHOOSE REEL SEGMENTS GRID (Thumbnails) */}
          <div className="space-y-3 pt-5 border-t border-zinc-150">
            <span className="text-[9px] font-mono font-black uppercase text-zinc-450 tracking-widest block leading-none">SECTOR DISCOVER REEL SEGMENTS</span>
            
            <div className="grid grid-cols-3 gap-3">
              {videos.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => {
                    setActiveVidIdx(idx);
                    setIsPlaying(true);
                  }}
                  className={`group relative aspect-square rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                    idx === activeVidIdx 
                      ? 'border-[#115C34] scale-102 ring-4 ring-emerald-500/15 shadow-sm' 
                      : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <img src={vid.videoUrl} alt={vid.title} className="w-full h-full object-cover brightness-80 transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-2 pb-2.5">
                    <span className="text-[7.5px] font-mono font-black text-white truncate max-w-full uppercase block text-center leading-none">@{vid.storeName}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
