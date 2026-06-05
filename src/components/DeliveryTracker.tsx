/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Truck, ShieldCheck, MapPin, Loader2, Calendar, Phone, Activity, HelpCircle, User } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface DeliveryTrackerProps {
  order: Order | null;
  onConfirmDelivery?: (orderId: string) => void;
  role: string;
}

export default function DeliveryTracker({ order, onConfirmDelivery, role }: DeliveryTrackerProps) {
  if (!order) {
    return (
      <div className="p-10 bg-white border border-zinc-200 rounded-3xl text-center text-zinc-500 font-sans shadow-3xs">
        <HelpCircle className="w-8 h-8 text-luxury-gold mx-auto mb-3 animate-bounce" />
        <p className="text-xs max-w-sm mx-auto leading-relaxed font-medium">Select or place an order to trigger the real-time delivery GPS and physical inspection log tracking nodes.</p>
      </div>
    );
  }

  // Steps in Escrow Delivery Flow
  const steps: { status: OrderStatus; label: string }[] = [
    { status: 'Order Received', label: 'Escrow Lock' },
    { status: 'Seller Confirmed', label: 'Store Picked' },
    { status: 'Awaiting Inspection', label: 'QC Base' },
    { status: 'Inspection Approved', label: 'QC Passed' },
    { status: 'Ready For Pickup', label: 'Packed' },
    { status: 'Picked Up', label: 'Dispatched' },
    { status: 'In Transit', label: 'En-route' },
    { status: 'Out For Delivery', label: 'With Rider' },
    { status: 'Delivered', label: 'Delivered' },
    { status: 'Buyer Confirmed', label: 'Fund Payout' },
  ];

  const currentStepIdx = steps.findIndex(s => s.status === order.status);

  // SVG positions for mockup map nodes (Addis Ababa map)
  const mapNodes = [
    { label: 'Seller Warehouse', x: 40, y: 190, name: 'Bole Store' },
    { label: 'QC Inspection Base', x: 120, y: 130, name: 'Avenir HQ' },
    { label: 'Transit Kazanchis', x: 210, y: 170, name: 'Logistics' },
    { label: 'Bole Subcity Circle', x: 290, y: 90, name: 'Rider Axis' },
    { label: 'Customer Residence', x: 340, y: 140, name: 'Delivery' },
  ];

  const getLogisticsPointer = (progress: number) => {
    if (progress <= 20) return { x: 40, y: 190 }; // Warehouse
    if (progress <= 50) return { x: 120, y: 130 }; // QC Hub
    if (progress <= 80) return { x: 210, y: 170 }; // Kazanchis
    if (progress <= 90) return { x: 290, y: 90 };  // Circle
    return { x: 340, y: 140 }; // Customer
  };

  const logisticsCoord = getLogisticsPointer(order.trackingProgress);

  return (
    <div className="bg-white p-6 font-sans text-zinc-800 space-y-6" id={`tracker-section-${order.id}`}>
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-150 pb-5 gap-3">
        <div>
          <span className="text-[9px] bg-[#FAF6ED] text-[#865B17] border border-[#E6DCC3] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Escrow Delivery Node
          </span>
          <h2 className="text-base font-bold text-zinc-950 mt-3 flex items-center gap-1.5 leading-none">
            Tracking ID: <span className="font-mono text-zinc-800">{order.id}</span>
          </h2>
          <p className="text-[11px] text-zinc-500 mt-1 font-medium">
            Sender: <span className="text-zinc-800 font-semibold">{order.storeName}</span>
          </p>
        </div>
        
        <div className="text-left sm:text-right w-full sm:w-auto">
          <p className="text-[9.5px] text-zinc-400 uppercase tracking-widest font-mono font-bold">Escrow Account balance</p>
          <p className="text-base font-mono font-bold text-emerald-600 mt-1">
            {(order.totalAmount + order.tax).toLocaleString()} <span className="text-[11px] font-semibold text-zinc-400">ETB</span>
          </p>
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-mono font-bold px-2.5 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">
             🔒 telebirr lock active
          </span>
        </div>
      </div>

      {/* Progress timeline */}
      <div className="overflow-x-auto pb-4 scrollbar-none">
        <div className="flex items-center min-w-[720px] justify-between relative px-2">
          {/* Timeline background lines */}
          <div className="absolute left-8 right-8 h-0.5 bg-zinc-100 top-1/2 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute left-8 h-0.5 bg-luxury-gold top-1/2 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${Math.min(96, Math.max(0, (currentStepIdx / (steps.length - 1)) * 95))}%` }}
          ></div>

          {steps.map((st, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div key={st.status} className="flex flex-col items-center z-10 relative">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[9px] font-bold border transition-all ${
                  isCompleted 
                    ? 'bg-luxury-gold border-luxury-gold text-zinc-950 shadow-sm'
                    : isCurrent
                    ? 'bg-zinc-950 border-zinc-950 text-white scale-110'
                    : 'bg-white border-zinc-200 text-zinc-350'
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-[8.5px] font-mono mt-2 text-center whitespace-nowrap font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-zinc-950 font-bold' : isCompleted ? 'text-zinc-550' : 'text-zinc-400'
                }`}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map and details log panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* MAP COMPONENT */}
        <div className="lg:col-span-3 bg-zinc-50 border border-zinc-150 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 font-serif uppercase tracking-wider">
              <Activity className="w-4 h-4 text-luxury-gold" /> GIS Dispatch Map (Addis Ababa)
            </h3>
            <p className="text-[9.5px] text-zinc-400 font-mono mt-1 uppercase tracking-widest">
               COURIER RADIUS NODE AXIS
            </p>
          </div>

          <div className="h-44 border border-zinc-200 rounded-xl relative overflow-hidden bg-white mt-4 shadow-inner">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250">
              <defs>
                <pattern id="grid-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="#ededed" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-dots)" />

              {/* Addis roadmap simulation */}
              <path d="M 10 100 Q 150 140 380 80" fill="none" stroke="#f6f6f6" strokeWidth="5" />
              <path d="M 50 20 L 220 200 L 350 240" fill="none" stroke="#f6f6f6" strokeWidth="4" />

              <polyline 
                points="40,190 120,130 210,170 290,90 340,140" 
                fill="none" 
                stroke="#C5A25D" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
              />

              {mapNodes.map((node, index) => {
                const isActive = order.trackingProgress >= (index + 1) * 20 - 10;
                return (
                  <g key={node.label}>
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r="4" 
                      className={`transition-colors ${isActive ? 'fill-luxury-gold' : 'fill-zinc-200'}`} 
                    />
                    <text 
                      x={node.x - 20} 
                      y={node.y - 12} 
                      fill="#C5A25D" 
                      fontSize="7px" 
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}

              {/* Cursor Rider tracking indicator */}
              <circle cx={logisticsCoord.x} cy={logisticsCoord.y} r="8" fill="#121212" className="animate-pulse" />
              <circle cx={logisticsCoord.x} cy={logisticsCoord.y} r="3" fill="#C5A25D" />
            </svg>

            <div className="absolute bottom-2 right-2 bg-zinc-950/95 border border-zinc-900 rounded-md p-2 text-[8.5px] font-mono text-zinc-300">
              <p>GIS: lat: 9.01{logisticsCoord.x} | lng: 38.7{logisticsCoord.y}</p>
              <p className="text-luxury-gold font-bold uppercase mt-0.5">HUB: {order.trackingLocation?.name || 'LOGISTICS VAN'}</p>
            </div>
          </div>
        </div>

        {/* PHYSICAL QC SHEET AND ESCROW RELEASER */}
        <div className="lg:col-span-2 bg-zinc-50 border border-zinc-150 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 border-b border-zinc-200 pb-2 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> QC Inspection Stamp
            </h3>

            {order.inspectionReport ? (
              <div className="space-y-3 p-4 bg-emerald-50/50 border border-emerald-150 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                     ✓ PASSED & SEALED
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono">{order.inspectionReport.date}</span>
                </div>
                <p className="text-[11px] text-zinc-700 italic leading-relaxed">
                  "{order.inspectionReport.comment}"
                </p>
                <div className="text-[9px] text-zinc-500 font-mono border-t border-emerald-100 pt-2 flex items-center gap-1">
                  <User className="w-3 h-3 text-emerald-600" />
                  <span>By Inspector: {order.inspectionReport.inspectorName}</span>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-white border border-zinc-200 rounded-xl text-center space-y-1">
                <Loader2 className="w-5 h-5 text-luxury-gold animate-spin mx-auto mb-1" />
                <p className="text-xs font-bold text-zinc-800">Inspection Awaiting</p>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Sellers must physically transition products into Kazanchis hub. Vetting engineer confirms specifications before route dispatch.
                </p>
              </div>
            )}

            <div className="space-y-2 text-xs border-t border-zinc-205 pt-3">
              <div className="flex justify-between font-medium">
                <span className="text-zinc-400">Recipient Phone:</span>
                <span className="text-zinc-805 font-bold">{order.recipientPhone}</span>
              </div>
              <div className="flex justify-between items-start font-medium">
                <span className="text-zinc-400">Destination:</span>
                <span className="text-zinc-800 font-bold max-w-[140px] truncate">{order.shippingAddress}</span>
              </div>
            </div>
          </div>

          {/* Confirm Receipt release fund */}
          {role === 'Buyer' && order.status === 'Delivered' && (
            <button
              onClick={() => onConfirmDelivery && onConfirmDelivery(order.id)}
              className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-450 text-white font-serif font-black rounded-lg text-xs uppercase tracking-widest cursor-pointer shadow-md transition-all active:scale-95"
            >
              Confirm Handover & Release Payout
            </button>
          )}

          {order.status === 'Buyer Confirmed' && (
            <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-100 text-center rounded-lg">
              <span className="text-[9.5px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                🔒 Escrow Complete - Payout Settled
              </span>
            </div>
          )}
        </div>

      </div>

      {/* GPS Logistics Timeline Logs */}
      <div className="bg-zinc-50 rounded-2xl p-4.5 border border-zinc-150">
        <h4 className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-3">
          Tracking Log Ledger (Verified Hash nodes)
        </h4>
        <div className="space-y-3">
          {order.trackingHistory.slice().reverse().map((hist, i) => (
            <div key={i} className="flex gap-4 items-start border-l border-zinc-200 pb-2 pl-4 relative">
              <span className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-white border border-[#C5A25D]"></span>
              <div className="w-24 text-zinc-400 font-mono text-[9px] font-bold">{hist.time.split(' ')[1] || 'Today'}</div>
              <div>
                <span className="text-zinc-900 font-bold text-[11px] font-mono">{hist.status}</span>
                <p className="text-zinc-500 text-[10px] mt-0.5 leading-relaxed font-sans">{hist.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
