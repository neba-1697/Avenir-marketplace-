/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusCircle, BarChart3, Package, ShieldAlert, Sparkles, Languages, Check, RefreshCw, Layers } from 'lucide-react';
import { Store, Language } from '../types';

interface SellerDashboardProps {
  language: Language;
  store: Store | null;
  onAddListing: (listingData: any) => Promise<boolean>;
}

export default function SellerDashboard({ language, store, onAddListing }: SellerDashboardProps) {
  const [type, setType] = useState<'product' | 'service' | 'property'>('product');
  
  // Form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [image, setImage] = useState('');
  
  // Extra fields based on selection
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [areaSqM, setAreaSqM] = useState('');
  const [listingType, setListingType] = useState<'rent' | 'buy'>('buy');
  const [propertyType, setPropertyType] = useState('apartment');
  const [chargeType, setChargeType] = useState<'hourly' | 'fixed'>('fixed');
  const [location, setLocation] = useState('Bole, Addis Ababa');

  // AI Assistant trigger states
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiTriggered, setAiTriggered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAIEnhancement = async () => {
    if (!name || !price) {
      alert('Fill out Title and Price first to calibrate copy variables.');
      return;
    }
    setLoadingAI(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Enhance copy for listing: ${name} with category ${category}`,
          scenario: 'listing-enhancer',
          language,
          listingDetails: { name, price, description, category }
        }),
      });
      const data = await response.json();
      if (data.response) {
        setDescription(data.response);
        setAiTriggered(true);
      }
    } catch (e) {
      console.error(e);
      // Premium fallbacks
      setDescription(`✨ [AI Certified Copywriter Node] ✨\nIntroducing the original ${name} listed at ${price} ETB. This selection has undergone certified quality checks to match Avenir's strict requirement codes. Fully secured in Telebirr Escrow vaults.`);
      setAiTriggered(true);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) return;

    setSubmitting(true);
    const extraInfo = {
      bedrooms, bathrooms, areaSqM, listingType, propertyType, chargeType, location
    };

    const payload = {
      type,
      storeId: store?.id || 'store-bole-elec',
      name,
      price: Number(price),
      description,
      category,
      image,
      info: extraInfo
    };

    const isOk = await onAddListing(payload);
    setSubmitting(false);
    if (isOk) {
      setSuccess(true);
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (!store) {
    return (
      <div className="p-8 bg-white border border-zinc-200 rounded-2xl text-center space-y-4 font-sans shadow-3xs">
        <ShieldAlert className="w-10 h-10 text-luxury-gold mx-auto animate-pulse" />
        <p className="text-sm font-bold text-zinc-900">Unapproved Store Profile Mode</p>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          Please select "Regulatory Admin" in simulator menu or navigate to "Onboard" to submit your partner passport credentials. Listing access is restricted until approval stamps trigger.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-zinc-800" id={`seller-dashboard-${store.id}`}>
      
      {/* Store metrics info panel */}
      <div className="bg-zinc-950 text-white rounded-3xl p-6 relative overflow-hidden border border-zinc-90 w-full mb-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img src={store.logo} alt="Store Logo" className="w-12 h-12 rounded-full border border-zinc-800 object-cover bg-zinc-800" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-black text-white tracking-widest uppercase">{store.name}</h2>
                <span className="bg-[#C5A25D]/10 border border-[#C5A25D]/30 text-luxury-gold text-[7.5px] font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                  VETTED SELLER ✓
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl truncate font-medium">{store.description}</p>
              <p className="text-[9.5px] text-zinc-500 font-mono mt-1">📍 Location Radius: {store.location}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-zinc-900/80 p-3.5 border border-zinc-850 rounded-xl min-w-[120px] text-center">
              <span className="text-[8.5px] uppercase font-mono text-zinc-500 tracking-wider font-bold">Trading Volume</span>
              <p className="text-xs font-mono font-bold text-emerald-400 mt-1">{(store.totalSales * 1850).toLocaleString()} <span className="text-[9px] text-zinc-500">ETB</span></p>
            </div>
            <div className="bg-zinc-900/80 p-3.5 border border-zinc-850 rounded-xl min-w-[80px] text-center">
              <span className="text-[8.5px] uppercase font-mono text-zinc-500 tracking-wider font-bold">Feedback</span>
              <p className="text-xs font-mono font-bold text-luxury-gold mt-1">★ {store.rating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Creator panel (ColSpan 3) */}
        <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-3xl p-6 shadow-3xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#8A7241]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">Publish Vetted Listing</h3>
            </div>
            
            {/* Toggles */}
            <div className="bg-zinc-100 p-1 rounded-xl flex gap-1 border border-zinc-150">
              {(['product', 'service', 'property'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    setCategory(t === 'product' ? 'Electronics' : t === 'service' ? 'Plumbing Services' : 'Properties');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    type === t 
                      ? 'bg-zinc-950 text-white shadow-xs' 
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-zinc-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Listing Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. PlayStation 5 Slim, Boiler repairs"
                  className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2.5 rounded-xl focus:outline-none placeholder-zinc-400 focus:border-luxury-gold"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Quote Price (ETB)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="e.g. 52000"
                  className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2.5 rounded-xl focus:outline-none placeholder-zinc-400 focus:border-luxury-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase block mb-1.5">Core Classification</label>
                {type === 'product' && (
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2.5 rounded-xl focus:outline-none font-medium"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion Wear</option>
                    <option value="Home Goods">Home & Living</option>
                    <option value="Groceries">Organic Groceries</option>
                  </select>
                )}

                {type === 'service' && (
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2.5 rounded-xl focus:outline-none font-medium"
                  >
                    <option value="Plumbing Services">Plumbing & Boilers</option>
                    <option value="Electrician Services">Generators & Wire Grid</option>
                    <option value="Carpenter Services">Wooden Crafting</option>
                  </select>
                )}

                {type === 'property' && (
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-zinc-200 px-3 py-2.5 rounded-xl focus:outline-none font-bold"
                  >
                    <option value="Properties">Bole Kazanchis Residential</option>
                  </select>
                )}
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase block mb-1.5">Listing Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2.5 rounded-xl focus:outline-none placeholder-zinc-400"
                />
              </div>
            </div>

            {/* Custom attributes inputs */}
            {type === 'service' && (
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl">
                <div>
                  <label className="text-[8.5px] font-mono text-zinc-400 uppercase block mb-1">Valuation Type</label>
                  <select
                    value={chargeType}
                    onChange={e => setChargeType(e.target.value as any)}
                    className="w-full bg-white border border-zinc-200 px-2 py-1.5 rounded-lg focus:outline-none text-[11px]"
                  >
                    <option value="fixed">Fixed Quotation Matrix</option>
                    <option value="hourly">Hourly Contract Billing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[8.5px] font-mono text-zinc-400 uppercase block mb-1">Service Radius Hub</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-white border border-zinc-200 px-2.5 py-1.5 rounded-lg focus:outline-none text-[11px]"
                  />
                </div>
              </div>
            )}

            {type === 'property' && (
              <div className="space-y-3 p-3.5 bg-[#FAF8F5] border border-zinc-200/65 rounded-xl">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[8.5px] font-mono text-zinc-400 block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={e => setBedrooms(e.target.value)}
                      placeholder="3"
                      className="w-full bg-white border border-zinc-205 px-2 py-1.5 rounded-lg focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-mono text-zinc-400 block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={e => setBathrooms(e.target.value)}
                      placeholder="2"
                      className="w-full bg-white border border-zinc-205 px-2 py-1.5 rounded-lg focus:outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-mono text-zinc-400 block mb-1">Area SqM</label>
                    <input
                      type="number"
                      value={areaSqM}
                      onChange={e => setAreaSqM(e.target.value)}
                      placeholder="120"
                      className="w-full bg-white border border-zinc-205 px-2 py-1.5 rounded-lg focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[8.5px] font-mono text-zinc-405 block mb-1">Transaction type</label>
                    <select
                      value={listingType}
                      onChange={e => setListingType(e.target.value as any)}
                      className="w-full bg-white border border-zinc-200 px-2 py-1.5 rounded-lg focus:outline-none text-[11px]"
                    >
                      <option value="buy">Absolute Title Sale</option>
                      <option value="rent">Standard Lease contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8.5px] font-mono text-zinc-405 block mb-1">Property Layout</label>
                    <select
                      value={propertyType}
                      onChange={e => setPropertyType(e.target.value)}
                      className="w-full bg-white border border-[#ededed] px-2 py-1.5 rounded-lg focus:outline-none text-[11px]"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">Detached Gated House</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* AI Enhancement Section */}
            <div className="p-4 bg-[#FAF6ED] border border-[#E6DCC3]/60 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-luxury-gold animate-bounce" />
                  <span className="text-[9px] font-mono font-bold text-[#8A7241] uppercase tracking-wider">
                     Avenir Gemini AI Copywriter
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={handleAIEnhancement}
                  disabled={loadingAI}
                  className="text-[9px] bg-zinc-950 hover:bg-zinc-850 disabled:bg-zinc-100 text-[#C5A25D] font-bold px-3 py-1.5 rounded-lg font-mono flex items-center justify-center gap-1 cursor-pointer"
                >
                  {loadingAI ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                  {aiTriggered ? 'Regenerate specifications' : 'Auto-Optimize details'}
                </button>
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-zinc-400 block mb-1.5">Specifications Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Outline dimensions, condition indexes, and physical parameters..."
                  className="w-full bg-white border border-zinc-250 px-3.5 py-3 rounded-xl focus:outline-none focus:border-luxury-gold leading-relaxed"
                />
              </div>
            </div>

            {/* Action buttons */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
            >
              {submitting ? 'Transubstantiating payload...' : success ? 'Certified Listing Created Successfully! ✓' : 'Submit Listing for Admin Quality Control'}
            </button>

          </form>
        </div>

        {/* Right Info side card (ColSpan 2) */}
        <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-luxury-gold" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-955">Market Analytics hub</h3>
            </div>
            
            <div className="space-y-3.5 text-xs">
              <div className="p-4 bg-white rounded-xl border border-zinc-150">
                <span className="text-[8.5px] text-zinc-400 uppercase tracking-widest font-mono font-bold block">Reels Discovery impressions</span>
                <p className="text-base font-bold font-mono text-zinc-950 mt-1">11,480 views</p>
                <div className="h-0.5 bg-zinc-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-luxury-gold" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-zinc-150">
                <span className="text-[8.5px] text-zinc-400 uppercase tracking-widest font-mono font-bold block">Video converted orders</span>
                <p className="text-base font-bold font-mono text-zinc-950 mt-1">4.2% ratio</p>
                <div className="h-0.5 bg-zinc-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-zinc-150 font-mono text-[10px] font-bold text-emerald-600 flex justify-between">
                <span>ESCROW SEALS OK:</span>
                <span>100% CLEAR RATE</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF6ED] border border-[#E6DCC3] rounded-xl p-4.5">
            <span className="text-[8.5px] font-mono text-[#8a7241] uppercase tracking-wider font-bold block">
              🛡️ Quality Constraint Note
            </span>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-sans mt-1">
              All transactions require physical unboxing checks at Avenir Kazanchis hub. Direct courier dispatches bypassing the escrow system are blocked.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
