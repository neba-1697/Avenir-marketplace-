/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AvenirDiscover from './components/AvenirDiscover';
import AIAssistant from './components/AIAssistant';
import DeliveryTracker from './components/DeliveryTracker';
import ProductCard from './components/ProductCard';
import StoreDetailModal from './components/StoreDetailModal';
import QuickPreviewModal from './components/QuickPreviewModal';

import {
  Language,
  Role,
  Product,
  Service,
  Property,
  Store,
  VideoListing,
  Order,
  SellerOnboardingDoc,
  SupportTicket,
  AuditLog,
  OrderItem,
  ItemType
} from './types';
import { translations } from './translations';
import { 
  Heart, 
  Search, 
  ShoppingBag, 
  Store as StoreIcon, 
  Play, 
  Sparkles, 
  Truck, 
  Layers, 
  ChevronRight, 
  PlusCircle, 
  Check, 
  Eye, 
  Compass, 
  User, 
  Landmark, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Trash2,
  Star,
  MapPin,
  HelpCircle,
  Loader2,
  ShieldAlert,
  Calendar,
  Layers3,
  CheckCircle,
  ArrowUpRight,
  MessageSquare,
  Volume2,
  Lock,
  Package,
  FileBadge,
  Sparkle
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [role, setRole] = useState<Role>('Buyer');
  
  // Entire Marketplace Database State
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [videos, setVideos] = useState<VideoListing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [onboardings, setOnboardings] = useState<SellerOnboardingDoc[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // UI search and category states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]); // item IDs array
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [activeStoreDetail, setActiveStoreDetail] = useState<Store | null>(null);

  // Order loading and micro-interaction states
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSubmitProgress, setOrderSubmitProgress] = useState(0);

  // Slider Drawer Overlay toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isOnboardingFormOpen, setIsOnboardingFormOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isOpsPortalOpen, setIsOpsPortalOpen] = useState(false);

  // Seller Onboarding interactive fields
  const [obBusinessName, setObBusinessName] = useState('');
  const [obCategory, setObCategory] = useState<ItemType>('product');
  const [obOwnerName, setObOwnerName] = useState('');
  const [obPhone, setObPhone] = useState('');
  const [obIdNumber, setObIdNumber] = useState('');
  const [obSuccess, setObSuccess] = useState(false);

  // Ordering checkout states
  const [shippingAddress, setShippingAddress] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<'Telebirr' | 'Chapa' | 'Bank Transfer'>('Telebirr');
  const [activeTrackOrder, setActiveTrackOrder] = useState<Order | null>(null);

  // New Listing States for Sellers (inside Simulator)
  const [newListingType, setNewListingType] = useState<ItemType>('product');
  const [newListingName, setNewListingName] = useState('');
  const [newListingPrice, setNewListingPrice] = useState('');
  const [newListingDesc, setNewListingDesc] = useState('');
  const [newListingCat, setNewListingCat] = useState('Electronics');

  // Load backend database on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      setStores(data.stores);
      setProducts(data.products);
      setServices(data.services);
      setProperties(data.properties);
      setVideos(data.videos);
      setOrders(data.orders);
      setOnboardings(data.onboardings);
      setSupportTickets(data.supportTickets);
      setAuditLogs(data.auditLogs);

      // Auto-assign first order as active tracking order for easy simulation
      if (data.orders && data.orders.length > 0) {
        setActiveTrackOrder(data.orders[0]);
      }
    } catch (e) {
      console.error('Data pull delay:', e);
    }
  };

  // Submit new shop onboarding
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!obBusinessName || !obOwnerName || !obPhone || !obIdNumber) return;

    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: obBusinessName,
          category: obCategory,
          ownerName: obOwnerName,
          phone: obPhone,
          idNumber: obIdNumber
        }),
      });
      const data = await res.json();
      if (data.success) {
        setObSuccess(true);
        setObBusinessName('');
        setObOwnerName('');
        setObPhone('');
        setObIdNumber('');
        fetchData();
        setTimeout(() => {
          setObSuccess(false);
          setIsOnboardingFormOpen(false);
          // Auto-open simulator in admin mode so they can see/approve it
          setIsOpsPortalOpen(true);
          setRole('Admin');
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Onboarding reviews (ADMIN ONLY)
  const handleReviewOnboarding = async (id: string, status: 'Approved' | 'Rejected', comment?: string) => {
    try {
      const res = await fetch('/api/onboard/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, rejectComment: comment }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Listing (Sellers only)
  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListingName || !newListingPrice || !newListingDesc) return;

    try {
      const activeSellerStore = stores.find(s => s.ownerId === 'owner-bole-elec') || (stores.length > 0 ? stores[0] : null);
      if (!activeSellerStore) return;

      const res = await fetch('/api/listings/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newListingType,
          storeId: activeSellerStore.id,
          name: newListingName,
          price: Number(newListingPrice),
          description: newListingDesc,
          category: newListingCat,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewListingName('');
        setNewListingPrice('');
        setNewListingDesc('');
        fetchData();
        alert('Listing Added Successfully and is now VETTED!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Place order under Escrow with micro-interaction button-fill visual feedback
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isSubmittingOrder) return;

    setIsSubmittingOrder(true);
    setOrderSubmitProgress(0);

    const duration = 1200; // ms
    const intervalTime = 30; // ms
    const step = 100 / (duration / intervalTime);
    
    let currentProgress = 0;
    const interval = setInterval(async () => {
      currentProgress += step;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setOrderSubmitProgress(100);
        clearInterval(interval);

        try {
          const res = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              buyerId: 'user-buyer-demo',
              items: cart,
              paymentProvider,
              shippingAddress: shippingAddress || 'Bole, Addis Ababa',
              recipientPhone: recipientPhone || '+251 911 00 11 22'
            }),
          });
          const data = await res.json();
          if (data.success) {
            setCart([]);
            setIsCartOpen(false);
            fetchData();
            setActiveTrackOrder(data.order);
            setIsTrackingOpen(true);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsSubmittingOrder(false);
          setOrderSubmitProgress(0);
        }
      } else {
        setOrderSubmitProgress(Math.floor(currentProgress));
      }
    }, intervalTime);
  };

  // Transition order status (ROLES SIMULATION: ADMIN/INSPECTOR/COURIER)
  const handleUpdateOrderStatus = async (id: string, status: string, comment?: string, qcPassed?: boolean) => {
    try {
      const res = await fetch('/api/order/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, comment, qcPassed }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        if (activeTrackOrder?.id === id) {
          setActiveTrackOrder(data.order);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = (item: any) => {
    setCart(prev => {
      const exists = prev.find(i => i.itemId === item.id);
      if (exists) {
        return prev.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: `cart-${Date.now()}`,
        itemId: item.id,
        name: item.name || item.title || 'Market Item',
        price: item.price,
        quantity: 1,
        image: item.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100',
        type: item.type || 'product'
      }];
    });
    setIsCartOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Searching lists filters
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase() || (selectedCategory === 'Home Goods' && p.category === 'Home Goods');
    return matchesSearch && matchesCat;
  });

  const categoriesList = [
    { name: 'All', icon: '✨', slug: 'All', count: products.length },
    { name: 'Electronics', icon: '💻', slug: 'Electronics', count: products.filter(p => p.category === 'Electronics').length },
    { name: 'Fashion', icon: '👕', slug: 'Fashion', count: products.filter(p => p.category === 'Fashion').length },
    { name: 'Home Goods', icon: '🛋️', slug: 'Home Goods', count: products.filter(p => p.category === 'Home Goods').length },
    { name: 'Groceries', icon: '🍎', slug: 'Groceries', count: products.filter(p => p.category === 'Groceries').length },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#092215] font-sans leading-relaxed selection:bg-[#E5C158]/30 selection:text-zinc-950" id="avenir-root-app">
      
      {/* 1. MASTER PLATFORM IDENTITY SCENE HEADER */}
      <Header
        language={language}
        setLanguage={setLanguage}
        cartCount={cart.reduce((acc, c) => acc + c.quantity, 0)}
        favoritesCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSellerPortal={() => {
          setIsOnboardingFormOpen(true);
        }}
        onOpenTracking={() => {
          setIsTrackingOpen(true);
        }}
      />

      {/* SECTION 1: HERO */}
      <Hero 
        language={language} 
        onSearch={(query) => {
          setSearchQuery(query);
          const block = document.getElementById('avenir-trending');
          if (block) block.scrollIntoView({ behavior: 'smooth' });
        }} 
        onSelectSuggestion={(query) => {
          setSearchQuery(query);
          const block = document.getElementById('avenir-trending');
          if (block) block.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* SECTION 2: TRUST BENCHMARKS */}
      <section className="relative -mt-10 sm:-mt-16 z-20 max-w-7xl mx-auto px-6" id="avenir-trust-panel">
        <div className="bg-white border border-zinc-150/90 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(9,34,21,0.04)] grid grid-cols-1 md:grid-cols-5 gap-8">
          {[
            {
              icon: <Layers3 className="w-6 h-6 text-[#115C34]" />,
              title: 'Verified Sellers Only',
              desc: 'Every vendor undergoes Kebele biometric and physical passport audits before catalog status activation.'
            },
            {
              icon: <Lock className="w-6 h-6 text-[#C99C33]" />,
              title: 'Secure Escrow Lock',
              desc: 'Funds are held in high-tier automated Telebirr and Chapa smart vault layers until physical handover approval.'
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-[#115C34]" />,
              title: 'Physical QC Unboxings',
              desc: 'Parcels land in Kazanchis inspection rooms. Qualified engineers verify genuineness and serial matches.'
            },
            {
              icon: <Volume2 className="w-6 h-6 text-[#C99C33]" />,
              title: 'Protected Payments',
              desc: 'Dual-wrap insurance. 100% money-back escrow reversal guarantees on any specifications mismatches.'
            },
            {
              icon: <Truck className="w-6 h-6 text-[#115C34]" />,
              title: 'Tracked Couriers',
              desc: 'Addis subcity deliveries dispatch directly from our security hub with active real-time route progress maps.'
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-3.5 border-r last:border-0 border-zinc-100 pr-4 last:pr-0">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center shadow-3xs border border-zinc-150">
                {item.icon}
              </div>
              <h3 className="font-serif font-black text-sm tracking-tight text-[#092215]">{item.title}</h3>
              <p className="text-[11.5px] text-zinc-500 leading-relaxed font-medium font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CATEGORY EXPERIENCE */}
      <section className="max-w-7xl mx-auto px-6 py-20" id="avenir-categories">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-[9px] font-mono font-black text-[#A4843B] uppercase tracking-widest block">
              VETTED MARKETPLACE SECTORS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#092215]">
              Explore Premium Categories
            </h2>
            <p className="text-sm text-zinc-500 max-w-xl font-medium">
              Carefully cataloged trade ecosystems configured to isolate authentic sellers and high-quality local products.
            </p>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categoriesList.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#092215] text-white border-[#092215] shadow-sm'
                    : 'bg-white border-zinc-200 text-zinc-650 hover:text-zinc-950 hover:border-zinc-350'
                }`}
              >
                <span>{cat.icon}</span> <span className="ml-1.5">{cat.name}</span>
                <span className={`ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded-full ${selectedCategory === cat.slug ? 'bg-[#E5C158] text-zinc-950 font-black' : 'bg-zinc-100 text-zinc-500'}`}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories bento layout grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Luxury High-Tech',
              slug: 'Electronics',
              img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
              desc: 'Original phones, laptops, cameras, fully certified.'
            },
            {
              title: 'Authentic Heritage Fashion',
              slug: 'Fashion',
              img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop',
              desc: 'Stunning cotton Habesha Kemis & full grain leather.'
            },
            {
              title: 'Home Goods & Solid Woods',
              slug: 'Home Goods',
              img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=400&auto=format&fit=crop',
              desc: 'Central Teak coffee tables & organic furnishings.'
            },
            {
              title: 'Clean Agriculture',
              slug: 'Groceries',
              img: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=400&auto=format&fit=crop',
              desc: 'Pure Sidamo & Yirgacheffe coffee beans directly from unions.'
            }
          ].map((cat) => (
            <div 
              key={cat.title}
              onClick={() => {
                setSelectedCategory(cat.slug);
                const block = document.getElementById('avenir-trending');
                if (block) block.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative h-72 border border-zinc-200 rounded-3xl overflow-hidden cursor-pointer shadow-3xs hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 z-0">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent"></div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 z-10">
                <span className="text-[8px] font-mono uppercase bg-[#E5C158] text-[#092215] font-black tracking-widest px-2 py-0.5 rounded">Vetted Hub</span>
                <h3 className="font-serif font-black text-lg tracking-tight leading-snug">{cat.title}</h3>
                <p className="text-[11px] text-zinc-350 line-clamp-2 leading-snug">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: TRENDING NOW */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-150 bg-white md:rounded-3xl border shadow-3xs" id="avenir-trending">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-zinc-100">
          <div className="space-y-2 max-w-xl">
            <span className="text-[9px] font-mono font-black text-[#A4843B] uppercase tracking-widest block">
              OFFICIAL SECURE RELEASES
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#092215]">
              Vetted Commerce Catalog
            </h2>
            <p className="text-sm text-zinc-500 font-medium">
              Explore live offerings undergoing Telebirr escrow holding balances. Physical checks validated by central engineer blocks.
            </p>
          </div>

          {/* Real-time search filter and status bar */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog live..."
                className="pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-[#115C34] focus:bg-white text-xs font-semibold text-zinc-800 rounded-xl focus:outline-none w-full sm:w-64 transition-all duration-205"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 font-sans text-[10px] font-black uppercase cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-zinc-500 text-xs font-semibold font-mono flex items-center gap-1.5 bg-zinc-50 border border-zinc-200/60 px-4.5 py-2.5 rounded-xl justify-center sm:justify-start">
              <span className="text-emerald-600 animate-pulse font-black shrink-0">● LIVE DISPATCH</span>
              <span className="text-zinc-700 font-bold whitespace-nowrap font-sans">Showing {filteredProducts.length} listings</span>
            </div>
          </div>
        </div>

        {/* Apple level commerce cards */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => {
              const store = stores.find(s => s.id === prod.storeId);
              return (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  store={store}
                  isFavorite={favorites.includes(prod.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  onBuyNow={(item) => {
                    handleAddToCart(item);
                    setIsCartOpen(true);
                  }}
                  onQuickPreview={(item) => setPreviewProduct(item)}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50/50 border border-dashed border-zinc-200 rounded-3xl p-6">
            <p className="text-zinc-450 text-sm font-medium font-sans">No listings found matching your search criteria.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-5 py-2.5 bg-[#092215] hover:bg-[#113a26] text-[#E5C158] font-mono text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}
      </section>

      {/* SECTION 5: DISCOVER */}
      <section className="max-w-7xl mx-auto px-6 py-20" id="avenir-discover">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-[9px] font-mono font-black text-[#A4843B] uppercase tracking-widest block">
              SOCIAL COMMERCE EXPERIENCES
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#092215]">
              shoppable discovery reels
            </h2>
            <p className="text-sm text-zinc-500 font-medium">
              Watch local artisan unboxings, custom handloom weaving feeds, and organic roasting live from regional farms.
            </p>
          </div>
        </div>

        {/* Video Player Render Component */}
        <div className="bg-white border rounded-3xl p-8 shadow-3xs">
          <AvenirDiscover
            language={language}
            videos={videos}
            allProducts={products}
            onAddToCart={handleAddToCart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </section>

      {/* SECTION 6: TOP PREMIUM STORES */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-150">
        <div className="space-y-2 mb-12 text-center">
          <span className="text-[9px] font-mono font-black text-[#A4843B] uppercase tracking-widest">
            AUTHENTICATED VENUE HOUSES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#092215]">
            Featured Verified Stores
          </h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto font-medium">
            Explore certified merchants legally registered and certified through the Addis Ababa commercial registry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stores.map((store) => (
            <div 
              key={store.id} 
              onClick={() => setActiveStoreDetail(store)}
              className="group bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(9,34,21,0.02)] hover:shadow-[0_20px_40px_rgba(9,34,21,0.06)] hover:border-[#115C34] transition-all duration-300 cursor-pointer flex flex-col h-full justify-between"
            >
              {/* Store banner */}
              <div className="h-28 bg-[#092215] relative overflow-hidden">
                <img src={store.banner} alt={store.name} className="w-full h-full object-cover brightness-70 transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* Store logo */}
                <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-xl bg-white p-1 border border-zinc-150 shadow-md z-10 overflow-hidden">
                  <img src={store.logo} alt={store.name} className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                </div>
              </div>

              {/* Store info body */}
              <div className="p-6 pt-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold tracking-wider">
                    <span className="text-[#115C34] flex items-center gap-1 font-extrabold">
                      ★ {store.rating} Rating
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 text-[8px] font-mono font-black px-2.5 py-0.5 rounded-full border border-emerald-100 uppercase">
                      Vetted
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-[#092215] text-[15.5px] tracking-tight group-hover:text-[#115C34] transition-colors leading-tight">{store.name}</h3>
                  <p className="text-zinc-400 text-[9.5px] font-mono font-bold uppercase">{store.location}</p>
                </div>

                <p className="text-[12px] text-zinc-550 leading-relaxed font-sans line-clamp-2">
                  {store.description}
                </p>

                <div className="pt-3 border-t border-zinc-105 flex items-center justify-between text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider leading-none">
                  <span>{store.totalSales} trades</span>
                  <span className="text-[#a4843b]">{store.followersCount} Subs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: SERVICES MARKETPLACE */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-150" id="avenir-services">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-[9px] font-mono font-black text-[#A4843B] uppercase tracking-widest block">
              PROFESSIONAL EXPERTISE NETWORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#092215]">
              expert service providers
            </h2>
            <p className="text-sm text-zinc-500 font-medium">
              Vetted plumbers, electrical engineers, graphics startups, background checked by Avenir physical inspectors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((serv) => (
            <div 
              key={serv.id} 
              className="bg-white border rounded-2xl p-6 shadow-3xs hover:border-[#115C34] hover:shadow-[0_15px_30px_rgba(9,34,21,0.02)] transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <img src={serv.image} alt={serv.name} className="w-14 h-14 rounded-full object-cover border border-zinc-150 shrink-0" referrerPolicy="no-referrer" />
                  <div>
                    <span className="text-[8.5px] font-mono font-black text-white bg-[#115C34] border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Checked Provider
                    </span>
                    <h5 className="font-serif font-black text-[15px] mt-1 text-zinc-950 tracking-tight leading-tight">{serv.name}</h5>
                    <p className="text-[#a4843b] text-[10.5px] font-medium">👥 {serv.providerName}</p>
                  </div>
                </div>

                <p className="text-zinc-500 text-[12.5px] leading-relaxed font-sans">{serv.description}</p>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] text-zinc-400 font-mono font-bold uppercase block">Vetted Tariff</span>
                  <span className="text-[#092215] font-mono font-bold text-sm">
                    {serv.price.toLocaleString()} ETB <span className="text-[10px] text-zinc-400 font-sans">({serv.chargeType})</span>
                  </span>
                </div>

                <button 
                  onClick={() => handleAddToCart({ ...serv, name: serv.name })}
                  className="px-5 py-2.5 bg-[#092215] hover:bg-[#113a26] text-white font-serif font-black rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-3xs transition-transform duration-200"
                >
                  Book Specialist
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: PROPERTY MARKETPLACE */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-150" id="avenir-realestate">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-[9px] font-mono font-black text-[#A4843B] uppercase tracking-widest block">
              LEGALLY CLEARED ESTATES
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#092215]">
              Luxury Real Estate Listings
            </h2>
            <p className="text-sm text-zinc-500 font-medium">
              Secure investment blocks, corporate offices, houses with fully verified land deeds verified through physical inspects.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {properties.map((prop) => (
            <div 
              key={prop.id} 
              className="bg-white border rounded-3xl overflow-hidden shadow-3xs hover:border-[#115C34]/50 transition-all duration-500 flex flex-col md:flex-row"
            >
              <div className="md:w-2/5 relative shrink-0">
                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover min-h-[220px]" referrerPolicy="no-referrer" />
                <span className="absolute top-4 left-4 bg-[#092215] text-[#E5C158] text-[9px] font-mono font-black px-3 py-1 rounded-md border border-[#113a26] uppercase">
                  Deed Certified
                </span>
              </div>

              <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-[#A4843B] font-mono font-black uppercase tracking-wider">
                    <span>📍 {prop.location}</span>
                    <span>{prop.propertyType.toUpperCase()}</span>
                  </div>

                  <h3 className="font-serif font-black text-zinc-950 text-xl tracking-tight leading-snug">{prop.title}</h3>
                  <p className="text-zinc-500 text-[12.5px] leading-relaxed font-sans line-clamp-2">{prop.description}</p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9.5px] text-zinc-400 font-mono font-bold uppercase block">Inspected Value</span>
                    <span className="text-zinc-950 font-mono font-bold text-[14px] sm:text-[16px]">
                      {prop.price.toLocaleString()} ETB <span className="text-[10px] text-zinc-400 font-sans">({prop.listingType})</span>
                    </span>
                  </div>

                  <button 
                    onClick={() => handleAddToCart({ ...prop, name: prop.title })}
                    className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white font-serif font-black rounded-xl text-xs uppercase tracking-widest cursor-pointer"
                  >
                    Hold Tour
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: AI SHOPPING ASSISTANT */}
      <section className="bg-gradient-to-[#092215] bg-[#092215] border-t border-b border-[#0d2f1d] overflow-hidden py-20 sm:py-24" id="avenir-ai-assistant">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#E5C158]/10 border border-[#E5C158]/35 px-4.5 py-1.5 rounded-full text-[#E5C158] text-[11px] uppercase font-mono font-black tracking-widest leading-none">
              <Sparkles className="w-4 h-4 text-[#E5C158]" /> 
              <span>INTELLIGENT BROKER CORES</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-serif font-black text-white leading-tight tracking-tight">
              Avenir Gemini Advisor
            </h2>

            <p className="text-zinc-300 text-sm leading-relaxed font-sans max-w-xl">
              Execute conversational product analysis, check pricing ranges, examine telebirr escrow contract structures or evaluate unboxing criteria directly through our grounding AI interface.
            </p>

            <ul className="space-y-3.5 text-zinc-400 font-mono text-xs uppercase font-semibold">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Grounded in real active catalogs data
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Support queries in Amharic & Oromo
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Automated physical specs inspections comments audit
              </li>
            </ul>
          </div>

          <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-3xl overflow-hidden shadow-2xl p-2.5 border border-zinc-150">
            <AIAssistant language={language} products={products} />
          </div>

        </div>
      </section>

      {/* SECTION 10: SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-2 mb-16">
          <span className="text-[9px] font-mono font-black text-[#A4843B] uppercase tracking-widest block">
            MARKET PENETRATION LEDGER
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-[#092215]">
            Avenir Metrics Ledger
          </h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto font-medium">
            Read audited statistics from verification hubs across major regions of Addis Ababa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '12.4M ETB', title: 'Protected Settled Trades', desc: 'Auto escrow blocks released securely on physical criteria parameters confirmation.' },
            { value: '850+ Stores', title: 'Vetted Merchant Registries', desc: 'Legally vetted local business stores with active Kebele checks and ID approvals.' },
            { value: '100% Inspected', title: 'Zero Counterfeit Rate', desc: 'No item transitions courier vans without first passing Kazanchis board unboxing stamps.' },
            { value: '22 Minutes', title: 'Avg Dispatch Wait', desc: 'Addis subcities transit vehicles dispatch on optimized gps route nodes.' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border rounded-2xl p-6.5 space-y-3 shadow-3xs hover:border-[#E5C158]/40 transition-colors">
              <span className="text-3xl font-mono font-black tracking-tight text-[#092215]">{stat.value}</span>
              <h4 className="font-serif font-black text-zinc-900 text-sm mt-1 leading-tight">{stat.title}</h4>
              <p className="text-[11.5px] text-zinc-505 leading-relaxed font-sans">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: MOBILE APP SHOWCASE */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-150">
        <div className="bg-[#FAF9F6] border rounded-3xl p-10 sm:p-14 shadow-3xs grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[9px] font-mono font-black text-[#A4843B] uppercase tracking-widest block font-bold">
              SYSTEM ON THE GO
            </span>
            <h2 className="text-4xl font-serif font-black tracking-tight text-[#092215] leading-tight">
              Avenir Mobile Applications
            </h2>
            <p className="text-sm text-zinc-505 leading-relaxed font-sans">
              Scan product serial numbers on arrival, release Telebirr escrow hashes, or message verified specialists directly using our luxury iOS and Android layouts.
            </p>

            <div className="flex gap-4">
              <a href="#" className="inline-block p-1 bg-zinc-950 text-white rounded-xl border border-zinc-900 hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-2 px-4 py-1.5 font-sans font-bold text-[11px]">
                  <span> Apple Store</span>
                </div>
              </a>
              <a href="#" className="inline-block p-1 bg-zinc-950 text-white rounded-xl border border-zinc-900 hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-2 px-4 py-1.5 font-sans font-bold text-[11px]">
                  <span>🤖 Google Play</span>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* Elegant pure CSS mockups for high status */}
            <div className="w-56 h-80 rounded-[30px] border-4 border-zinc-900 bg-white shadow-2xl relative overflow-hidden shrink-0 flex flex-col justify-between p-4 font-mono text-[9px]">
              <div className="flex justify-between select-none">
                <span>12:00</span>
                <span className="text-emerald-600">● Escrow</span>
              </div>
              
              <div className="space-y-2 p-2.5 bg-zinc-50 rounded-xl border border-zinc-150">
                <p className="font-bold uppercase text-zinc-400">Order Verification</p>
                <p className="font-bold text-[#092215]">Active S-24 Ultra unboxing approved</p>
                <div className="h-2 bg-emerald-500 rounded-full w-[80%]"></div>
              </div>

              <div className="bg-[#092215] text-[#E5C158] py-2 px-3 rounded-lg text-center font-bold">
                Deploying Cargo
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 12: ENTERPRISE GLOBAL FOOTER */}
      <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900 font-sans" id="avenir-corporate-footer">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-zinc-900 pb-12">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 shadow">
                <Landmark className="w-5 h-5 text-[#E5C158]" />
              </div>
              <span className="text-xl font-serif font-black text-[#FAF9F6] tracking-widest">AVENIR</span>
            </div>

            <p className="text-[12.5px] leading-relaxed max-w-sm text-zinc-505 font-medium">
              Avenir is the premier digital infrastructure company engineering high-yield certified trade operations and risk mitigation platforms across East Africa.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3.5">
            <h4 className="font-mono text-[10px] font-bold text-zinc-200 uppercase tracking-widest">Addis Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li>Kazanchis Main HQ</li>
              <li>Bole Logistics Point</li>
              <li>Merkato Vetting Lab</li>
              <li>CMC Registry Base</li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3.5">
            <h4 className="font-mono text-[10px] font-bold text-zinc-200 uppercase tracking-widest">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li>Kebele Approvals</li>
              <li>Telebirr Vault</li>
              <li>Chapa Integrators</li>
              <li>Auditing Log Ledger</li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-5">
            <h4 className="font-mono text-[10px] font-bold text-[#FAF9F6] uppercase tracking-widest">Interactive Audit Simulation</h4>
            <p className="text-xs text-zinc-503">
              We separate operations from raw buyers. Investors or developers looking to simulate physical unboxings, inspect stores state, review couriers parameters, or log metrics audits can launch our operations center.
            </p>

            <button 
              onClick={() => setIsOpsPortalOpen(true)}
              className="flex items-center gap-2 p-2.5 px-5 bg-gradient-to-r from-[#e6c158] to-[#9c843f] hover:from-[#f3cc5e] text-zinc-950 rounded-xl text-[10.5px] font-mono font-black uppercase cursor-pointer transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Launch Operations lab</span>
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-zinc-550 font-mono">
          <p>© 2026 Avenir. Hand-crafted by Nebil Shebab, Full-Stack Developer. Certified escrow. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0 font-bold uppercase text-[#E5C158]">
            <span className="cursor-pointer">Addis Ababa office</span>
            <span>•</span>
            <span className="cursor-pointer">Regulatory Certifications</span>
          </div>
        </div>
      </footer>

      {/* OVERLAY MODULE 1: SHOPPING CART SLIDE OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl flex flex-col h-full z-10 select-text">
            
            <div className="p-6 border-b border-zinc-150 flex items-center justify-between bg-zinc-50 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#092215]" />
                <h3 className="text-base font-serif font-black tracking-tight text-[#092215] uppercase">
                  My Cart Escrow Holding
                </h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-zinc-950 font-black cursor-pointer uppercase text-xs">✕ Close</button>
            </div>

            {/* Cart products items scroll area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map(it => (
                <div key={it.id} className="flex gap-4 bg-zinc-50 p-4 border rounded-xl shadow-3xs hover:border-[#E5C158]/35 transition-all">
                  <img src={it.image} alt={it.name} className="w-12 h-12 rounded-lg object-cover bg-white shrink-0" referrerPolicy="no-referrer" />
                  
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-[12.5px] font-serif font-black text-zinc-950 tracking-tight leading-tight">{it.name}</h4>
                      <p className="text-[11px] font-mono font-bold text-zinc-900 mt-1">{it.price.toLocaleString()} ETB</p>
                    </div>

                    <div className="flex items-center justify-between text-[11.5px] text-zinc-400 mt-2">
                      <span>QTY: {it.quantity}</span>
                      <button 
                        onClick={() => setCart(prev => prev.filter(p => p.id !== it.id))}
                        className="text-rose-600 font-bold cursor-pointer"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="text-center py-24 text-zinc-400 space-y-4 font-black">
                  <ShoppingBag className="w-12 h-12 mx-auto text-zinc-200" />
                  <p className="text-xs uppercase tracking-wider">Your shopping bag is empty.</p>
                </div>
              )}
            </div>

            {/* Checkout parameters & calculations */}
            {cart.length > 0 && (
              <form onSubmit={handlePlaceOrder} className="p-6 border-t border-zinc-150 bg-zinc-50 shrink-0 space-y-5">
                
                <div className="space-y-4 text-xs font-semibold">
                  <h4 className="font-serif font-black uppercase text-[#092215] tracking-tight">Escrow Checkout Parameters</h4>
                  
                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400">Delivery Subcity Target</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Bole road House 402, Addis Ababa"
                      value={shippingAddress}
                      onChange={e => setShippingAddress(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-xs placeholder-zinc-400 focus:outline-none focus:border-[#092215]"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-[#9c843f]">Recipient Contact Phone</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+251 900 00 00 00"
                      value={recipientPhone}
                      onChange={e => setRecipientPhone(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg p-3 text-xs placeholder-zinc-400 focus:outline-none focus:border-[#092215]"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-[#9c843f]">Escrow Escrow Platform Wallet</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Telebirr', 'Chapa', 'Bank Transfer'] as const).map(prov => (
                        <button
                          key={prov}
                          type="button"
                          onClick={() => setPaymentProvider(prov)}
                          className={`py-2 pt-2.5 rounded-lg border text-[10.5px] font-bold text-center transition-all cursor-pointer block ${
                            paymentProvider === prov
                              ? 'bg-[#092215] text-[#FAF9F6] border-[#092215]'
                              : 'bg-white border-zinc-200 text-zinc-500 hover:text-zinc-950'
                          }`}
                        >
                          {prov}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Ledger */}
                <div className="space-y-2 border-t border-zinc-200 pt-4 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Active items sum:</span>
                    <span className="font-mono font-bold text-zinc-900">{cart.reduce((acc, c) => acc + c.price * c.quantity, 0).toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>15% VAT:</span>
                    <span className="font-mono font-bold text-zinc-900">{(cart.reduce((acc, c) => acc + c.price * c.quantity, 0) * 0.15).toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between font-black text-[#092215] text-sm pt-2 border-t border-dashed border-zinc-200">
                    <span>Escrow Locked Total:</span>
                    <span className="font-mono">{(cart.reduce((acc, c) => acc + c.price * c.quantity, 0) * 1.15).toLocaleString()} ETB</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="w-full py-4 bg-[#092215] hover:bg-[#113a26] disabled:bg-[#0c2f1b] disabled:cursor-not-allowed text-white font-serif font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  {/* Subtle dynamic background progress fill bar */}
                  {isSubmittingOrder && (
                    <div 
                      className="absolute inset-y-0 left-0 bg-[#E5C158]/20 transition-all duration-100 ease-out z-0"
                      style={{ width: `${orderSubmitProgress}%` }}
                    />
                  )}

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmittingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#E5C158] animate-spin shrink-0" />
                        <span>Securing Vault ({orderSubmitProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#E5C158] shrink-0" />
                        <span>Lock Escrow via {paymentProvider}</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* OVERLAY MODULE 2: FAVORITES DRAWER */}
      {isFavoritesOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsFavoritesOpen(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col h-full z-10">
            <div className="p-6 border-b border-zinc-150 flex items-center justify-between bg-zinc-50">
              <h3 className="text-base font-serif font-black tracking-tight text-[#092215] uppercase flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-current" /> Saved Listings
              </h3>
              <button onClick={() => setIsFavoritesOpen(false)} className="text-zinc-400 hover:text-zinc-950 uppercase text-xs font-black cursor-pointer">✕ Close</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {favorites.map(fid => {
                const pItem = products.find(p => p.id === fid);
                if (!pItem) return null;
                return (
                  <div key={fid} className="flex gap-4 items-center bg-zinc-50 p-4 border rounded-xl hover:border-zinc-300 transition-colors">
                    <img src={pItem.image} alt={pItem.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h5 className="font-bold text-xs text-zinc-950 leading-tight">{pItem.name}</h5>
                      <span className="text-xs font-mono font-bold text-zinc-900 block mt-1">{pItem.price.toLocaleString()} ETB</span>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(pItem)}
                      className="p-2 bg-[#092215] text-[#E5C158] rounded-lg cursor-pointer"
                      aria-label="Add saved item to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {favorites.length === 0 && (
                <div className="text-center py-24 text-zinc-400 space-y-3">
                  <Heart className="w-10 h-10 mx-auto opacity-30 text-zinc-400" />
                  <p className="text-xs uppercase font-black uppercase font-mono tracking-wider">No saved references found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY MODULE 3: ORDER STATUS TIMELINE TRACKER MAP OVERLAY */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsTrackingOpen(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-3xl w-full bg-white shadow-2xl flex flex-col h-full z-10 select-text">
            <div className="p-6 border-b border-zinc-150 flex items-center justify-between bg-zinc-50 pr-8 shrink-0">
              <h3 className="text-base font-serif font-black tracking-tight text-[#092215] uppercase tracking-wide">
                Live Escrow tracking console
              </h3>
              <button onClick={() => setIsTrackingOpen(false)} className="text-zinc-400 hover:text-[#092215] uppercase text-xs font-black cursor-pointer">✕ Close</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTrackOrder ? (
                <DeliveryTracker 
                  order={activeTrackOrder} 
                  role={role}
                  onConfirmDelivery={(orderId) => {
                    handleUpdateOrderStatus(orderId, 'Buyer Confirmed', 'Product received safely. Digital escrow lock released 100% to merchant.');
                  }}
                />
              ) : (
                <div className="text-center py-32 text-zinc-400 space-y-4">
                  <ShieldCheck className="w-12 h-12 mx-auto animate-pulse text-zinc-200" />
                  <p className="text-xs font-bold uppercase tracking-wider">No active order tracked. Complete checking to trigger tracking.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY MODULE 4: BECOME A VERIFIED SELLER APPLICATIONS */}
      {isOnboardingFormOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsOnboardingFormOpen(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl flex flex-col h-full z-10 select-text">
            <div className="p-6 border-b border-zinc-150 flex items-center justify-between bg-zinc-50 shrink-0">
              <h3 className="text-[#092215] font-serif font-black text-base uppercase tracking-wider">
                Partner Store Registration
              </h3>
              <button onClick={() => setIsOnboardingFormOpen(false)} className="text-zinc-400 hover:text-zinc-950 uppercase text-xs font-black cursor-pointer">✕ Close</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {obSuccess ? (
                <div className="text-center py-24 space-y-5">
                  <span className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-2xl mx-auto shadow-sm">✓</span>
                  <div>
                    <h4 className="font-serif font-black text-zinc-950 text-base">Vetting Application Logged</h4>
                    <p className="text-xs text-zinc-505 leading-relaxed mt-2">
                      Your store registration is initialized. Admin has been notified to review your documents. Swapping layout to Administrative Controls lab in a second...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOnboardingSubmit} className="space-y-6">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-900 text-xs">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <p className="leading-relaxed">
                      All merchants must physically register passport details to satisfy legal anti-friction escrow checks in Ethiopia.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs font-semibold">
                    <div className="space-y-2">
                      <label className="block text-zinc-400 uppercase tracking-wide">Business Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Bole Premium Tech Distributors"
                        value={obBusinessName}
                        onChange={e => setObBusinessName(e.target.value)}
                        className="w-full bg-zinc-50 border rounded-lg p-3 font-medium text-zinc-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-zinc-400 uppercase tracking-wide font-mono">Industry Target Component</label>
                      <select 
                        value={obCategory}
                        onChange={e => setObCategory(e.target.value as any)}
                        className="w-full bg-zinc-50 border rounded-lg p-3 font-medium text-zinc-900 focus:outline-none"
                      >
                        <option value="product">Premium Products Vetting</option>
                        <option value="service">Expert Services Booking</option>
                        <option value="property">Luxury Real Estate Listings</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-zinc-450 uppercase tracking-wide">Owner Full Name (Matching Passport)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Bereket Tsegaye"
                        value={obOwnerName}
                        onChange={e => setObOwnerName(e.target.value)}
                        className="w-full bg-zinc-50 border rounded-lg p-3 font-medium text-[#121212] focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-zinc-450 uppercase tracking-wide">Contact Phone</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+251 900 00 00 00"
                        value={obPhone}
                        onChange={e => setObPhone(e.target.value)}
                        className="w-full bg-zinc-50 border rounded-lg p-3 font-medium focus:outline-none focus:border-emerald-500 text-[#121212]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-zinc-450 uppercase tracking-wide">Legal ID / Passport Ref</label>
                      <input 
                        type="text" 
                        required
                        placeholder="ID-884210-ET"
                        value={obIdNumber}
                        onChange={e => setObIdNumber(e.target.value)}
                        className="w-full bg-zinc-50 border rounded-lg p-3 font-medium focus:outline-none focus:border-emerald-500 text-zinc-950"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-zinc-450 uppercase tracking-wide">Vetting PDF attachment status</label>
                      <span className="block text-zinc-400 font-medium italic mb-2">Simulated standard credentials manual uploads auto checked</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#092215] hover:bg-[#113a26] text-white font-serif font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Submit Official Credentials Application
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY MODULE 5: ADMINISTRATIVE OPERATIONS & SANDBOX SIMULATION MODAL */}
      {isOpsPortalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans select-text text-zinc-950">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" onClick={() => setIsOpsPortalOpen(false)}></div>
          
          <div className="absolute inset-y-0 left-0 max-w-4xl w-full bg-zinc-950 text-zinc-300 shadow-2xl flex flex-col h-full z-10 border-r border-zinc-850">
            {/* Header */}
            <div className="p-6 border-b border-zinc-850 flex items-center justify-between text-zinc-100 bg-[#091510] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-[#E5C158]" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#E5C158]">Avenir Operations Sandbox Core</h3>
                  <p className="text-[10px] text-zinc-450">Vetting hubs status, merchant portals review, couriers dispatch coordinate transitions</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded px-2 py-0.5">DEV LAB INTERFACE ACTIVE</span>
                <button onClick={() => setIsOpsPortalOpen(false)} className="text-zinc-500 hover:text-white uppercase text-xs font-mono font-bold cursor-pointer">✕ Close</button>
              </div>
            </div>

            {/* Simulated Roles Select switcher bar inside the Dev modal */}
            <div className="p-4 bg-zinc-900 border-b border-zinc-850 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-zinc-400 font-mono text-[10px] font-bold uppercase">Configure Operating Mode Persona:</span>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { r: 'Seller' as Role, label: 'Merchant' },
                  { r: 'Quality_Inspector' as Role, label: 'QC Inspector' },
                  { r: 'Delivery_Agent' as Role, label: 'Courier Rider' },
                  { r: 'Admin' as Role, label: 'Regulator Admin' }
                ].map(item => (
                  <button
                    key={item.r}
                    onClick={() => setRole(item.r)}
                    className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase cursor-pointer transition-all ${
                      role === item.r
                        ? 'bg-[#E5C158] text-zinc-950 shadow-sm'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-750'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Ops Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* STATUS INDICATORS */}
              <div className="grid grid-cols-3 gap-4 font-mono text-[10.5px]">
                <div className="p-3 bg-zinc-900 border rounded border-zinc-805">
                  <span className="text-zinc-500 block">Pending Store applications:</span>
                  <span className="text-[#E5C158] font-black text-sm">{onboardings.filter(o => o.status === 'Pending' || o.status === 'Under_Review').length} requests</span>
                </div>
                <div className="p-3 bg-zinc-900 border rounded border-zinc-805">
                  <span className="text-zinc-500 block">Awaiting Physical unboxings:</span>
                  <span className="text-[#E5C158] font-black text-sm">{orders.filter(o => o.status === 'Awaiting Inspection').length} parcels</span>
                </div>
                <div className="p-3 bg-zinc-900 border rounded border-zinc-805">
                  <span className="text-zinc-550 block">Active dispatch routes:</span>
                  <span className="text-[#E5C158] font-black text-sm">{orders.filter(o => ['In Transit', 'Ready For Pickup', 'Picked Up', 'Out For Delivery'].includes(o.status)).length} riders</span>
                </div>
              </div>

              {/* ROLE MODULE 1: SELLER CONTROLS */}
              {role === 'Seller' && (
                <div className="space-y-4">
                  <div className="border-b border-zinc-850 pb-2">
                    <h3 className="font-mono text-xs font-black uppercase tracking-widest text-[#E5C158] flex items-center gap-1">
                      <StoreIcon className="w-4 h-4 text-[#a4843b]" /> @Bole Premium Electronics - Upload Merchant Listing
                    </h3>
                  </div>

                  <form onSubmit={handleAddListing} className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-2">
                      <label className="text-zinc-505 block">Item Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. iPad Pro 12.9 Inch (M4 Screen)"
                        value={newListingName}
                        onChange={e => setNewListingName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-zinc-100 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-zinc-505 block">Value (ETB Price)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="45000"
                          value={newListingPrice}
                          onChange={e => setNewListingPrice(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-zinc-100 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-zinc-505 block">Category Tag</label>
                        <select 
                          value={newListingCat}
                          onChange={e => setNewListingCat(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-zinc-100 focus:outline-none"
                        >
                          <option value="Electronics">Electronics</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Home Goods">Home Goods</option>
                          <option value="Groceries">Groceries</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-2 space-y-2">
                      <label className="text-zinc-505 block">Persuasive description checks</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Specify key parameters and certifications parameters matched under standard trade checks..."
                        value={newListingDesc}
                        onChange={e => setNewListingDesc(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-zinc-100 focus:outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="col-span-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-black rounded uppercase tracking-widest cursor-pointer"
                    >
                      Publish Checked Listing Now
                    </button>
                  </form>
                </div>
              )}

              {/* ROLE MODULE 2: QUALITY INSPECTOR CHECKPOINTS */}
              {role === 'Quality_Inspector' && (
                <div className="space-y-4">
                  <div className="border-b border-zinc-850 pb-2">
                    <h3 className="font-mono text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> VETTING STAMPS QUEUER
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 leading-normal">
                    Examine physical components unboxing checklist below on escrow-locked customer orders. Approve to unlock transit.
                  </p>

                  <div className="space-y-4">
                    {orders.filter(o => o.status === 'Awaiting Inspection').map(order => (
                      <div key={order.id} className="p-4 bg-zinc-900 border border-[#0d2f1d] rounded-xl space-y-3.5">
                        <div className="flex justify-between items-center text-[10px] font-mono font-black">
                          <span>ESCROW ID: {order.id}</span>
                          <span className="text-emerald-400 uppercase">Awaiting QC Stamp</span>
                        </div>

                        <ul className="text-xs text-zinc-350 space-y-1 font-medium">
                          {order.items.map(it => (
                            <li key={it.id}>• {it.name} (QTY: {it.quantity})</li>
                          ))}
                        </ul>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Inspection Approved', 'Physical specifications checked under Kazanchis HQ board review. PTA serial verification matches. Passed.', true)}
                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-405 text-zinc-950 font-mono font-black text-xs rounded uppercase tracking-wider cursor-pointer"
                          >
                            ✓ Approve & Stamp Specs
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Order Received', 'Physical product parameters failed unboxing consistency. Dispatched back to store.', false)}
                            className="py-2 px-4 bg-zinc-800 text-zinc-400 hover:text-rose-500 hover:bg-zinc-750 text-xs font-mono font-bold rounded cursor-pointer"
                          >
                            Reject Specs
                          </button>
                        </div>
                      </div>
                    ))}

                    {orders.filter(o => o.status === 'Awaiting Inspection').length === 0 && (
                      <div className="border border-dashed border-zinc-800 py-12 text-center rounded text-zinc-500 text-xs font-mono">
                        No orders currently awaiting physical unboxings checkpoints.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ROLE MODULE 3: COURIER TRANSITS */}
              {role === 'Delivery_Agent' && (
                <div className="space-y-4">
                  <div className="border-b border-zinc-850 pb-2">
                    <h3 className="font-mono text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-500" /> COURIER ROUTING SWITCHES
                    </h3>
                  </div>

                  <p className="text-xs text-[#a4843b] font-mono leading-normal">
                    Trigger physical dispatch coordinate transits across Addis subcity zones:
                  </p>

                  <div className="space-y-4">
                    {orders.map(order => {
                      const courierTransitions: Record<string, { nextStatus: string; label: string }> = {
                        'Inspection Approved': { nextStatus: 'Ready For Pickup', label: '1. Load into Secured bag' },
                        'Ready For Pickup': { nextStatus: 'Picked Up', label: '2. Van Dispatch' },
                        'Picked Up': { nextStatus: 'In Transit', label: '3. En-route (Ring Road Axis)' },
                        'In Transit': { nextStatus: 'Out For Delivery', label: '4. Assign to Subcity Rider' },
                        'Out For Delivery': { nextStatus: 'Delivered', label: '5. Handover door' },
                      };

                      const currentAction = courierTransitions[order.status];

                      return (
                        <div key={order.id} className="p-4 bg-zinc-900 border border-zinc-805 rounded-xl space-y-3">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span>Order Ref: {order.id}</span>
                            <span className="text-amber-500 uppercase">CURRENT: {order.status}</span>
                          </div>

                          <div className="text-xs text-zinc-400">
                            Deliver target: <span className="text-zinc-200">{order.shippingAddress}</span>
                          </div>

                          {currentAction ? (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, currentAction.nextStatus)}
                              className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-black text-xs uppercase tracking-wider rounded cursor-pointer"
                            >
                              🚚 Progress Status: {currentAction.label}
                            </button>
                          ) : (
                            <span className="text-[10.5px] text-zinc-500 font-mono italic block">Completed or awaiting unboxing stamp</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ROLE MODULE 4: REGULATORY ADMINS */}
              {role === 'Admin' && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-850 pb-2">
                    <h3 className="font-mono text-xs font-black uppercase tracking-widest text-[#E5C158] flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-[#E5C158]" /> VETTING AUDIT CABINET
                    </h3>
                  </div>

                  {/* Vetting checklist requests */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono uppercase font-black tracking-widest text-zinc-400">Merchant Store applications</h4>
                    
                    <div className="space-y-4">
                      {onboardings.filter(o => o.status === 'Pending' || o.status === 'Under_Review').map(onb => (
                        <div key={onb.id} className="p-4 bg-zinc-900 border rounded-xl border-zinc-805 space-y-3">
                          <div className="flex justify-between text-[10.5px] font-mono">
                            <span>REQUEST CODE: {onb.id}</span>
                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded">PENDING VETTING</span>
                          </div>

                          <div className="space-y-1.5 text-xs text-zinc-350 font-medium">
                            <p>Business: <span className="text-zinc-105 font-bold">{onb.businessName}</span></p>
                            <p>Target Category: <span className="text-zinc-200 font-mono italic">{onb.category}</span></p>
                            <p>Owner passport specs: <span className="text-[#E5C158] font-bold">{onb.ownerName}</span> ({onb.idNumber})</p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReviewOnboarding(onb.id, 'Approved', 'Store credentials vetted. Vetting check manually validated. Approved.')}
                              className="flex-1 py-1.5 bg-emerald-500 hover:bg-[#115C34] text-zinc-950 hover:text-white font-mono font-black text-xs rounded cursor-pointer"
                            >
                              ✓ Approve Store Vetting
                            </button>
                            <button
                              onClick={() => handleReviewOnboarding(onb.id, 'Rejected', 'Kebele ID specifications did not pass registry validation check.')}
                              className="py-1.5 px-4 bg-zinc-800 border border-zinc-700 hover:bg-rose-500 hover:text-white text-xs font-mono rounded cursor-pointer"
                            >
                              Reject Request
                            </button>
                          </div>
                        </div>
                      ))}

                      {onboardings.filter(o => o.status === 'Pending' || o.status === 'Under_Review').length === 0 && (
                        <p className="text-center py-6 text-zinc-550 text-xs italic font-mono border border-dashed border-zinc-850">
                          No pending seller applications queued in this sector.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Vetting Hash Ledger audit logs */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono uppercase font-black tracking-widest text-[#E5C158]">System Audit logs (Secure Ledger)</h4>
                    <div className="bg-[#050B08] p-4.5 rounded-xl border border-zinc-850 font-mono text-[9.5px] text-zinc-500 overflow-y-auto max-h-56 space-y-2.5">
                      {auditLogs.map(log => (
                        <div key={log.id} className="border-b border-zinc-900 pb-2 last:border-o">
                          <p className="text-zinc-400 font-bold">[{log.time}] {log.action}</p>
                          <p className="text-zinc-505 leading-relaxed mt-0.5">{log.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 5. STORE SHOWCASE MODAL OVERLAY */}
      {activeStoreDetail && (
        <StoreDetailModal
          store={activeStoreDetail}
          onClose={() => setActiveStoreDetail(null)}
          products={products}
          services={services}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onBuyNow={(item) => {
            handleAddToCart(item);
            setIsCartOpen(true);
          }}
          onQuickPreview={(item) => setPreviewProduct(item)}
        />
      )}

      {/* 6. EXPANDED PHYSICAL UNBOXING QUICK PREVIEW MODAL */}
      {previewProduct && (
        <QuickPreviewModal
          product={previewProduct}
          store={stores.find(s => s.id === previewProduct.storeId)}
          onClose={() => setPreviewProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={(item) => {
            handleAddToCart(item);
            setIsCartOpen(true);
            setPreviewProduct(null);
          }}
          isFavorite={favorites.includes(previewProduct.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

    </div>
  );
}
