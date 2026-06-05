/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Settings, RefreshCw, Send, Trash, Bell, AlertTriangle, Terminal } from 'lucide-react';
import { SellerOnboardingDoc, Order, AuditLog } from '../types';

interface AdminCenterProps {
  onboardings: SellerOnboardingDoc[];
  orders: Order[];
  auditLogs: AuditLog[];
  onReviewOnboarding: (id: string, status: 'Approved' | 'Rejected', comment?: string) => void;
  onUpdateOrderStatus: (id: string, status: string, comment?: string, qcPassed?: boolean) => void;
}

export default function AdminCenter({
  onboardings,
  orders,
  auditLogs,
  onReviewOnboarding,
  onUpdateOrderStatus,
}: AdminCenterProps) {
  const [rejectComment, setRejectComment] = useState('');
  const [selectedOnboardId, setSelectedOnboardId] = useState('');
  const [qcStatusComment, setQcStatusComment] = useState('');

  const totalOnboardPendingCount = onboardings.filter(o => o.status === 'Pending' || o.status === 'Under_Review').length;
  const currentEscrowLocks = orders.filter(o => o.status !== 'Buyer Confirmed');
  const lockedFundsTotal = currentEscrowLocks.reduce((acc, o) => acc + o.totalAmount + o.tax, 0);
  const platformCommissions = orders.reduce((acc, o) => acc + o.commission, 0);

  return (
    <div className="space-y-6 font-sans text-zinc-800" id="avenir-admin-core">
      
      {/* Overview Analytics panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 border border-zinc-200 rounded-xl shadow-3xs">
          <span className="text-[8.5px] text-zinc-400 uppercase tracking-widest font-mono font-bold block">Onboard queue</span>
          <p className="text-base font-mono font-bold text-[#8A7241] mt-1">{totalOnboardPendingCount} pending application</p>
          <p className="text-[8.5px] text-zinc-450 mt-1 font-mono uppercase">Vetted ID Passport verification</p>
        </div>

        <div className="bg-white p-4 border border-zinc-200 rounded-xl shadow-3xs">
          <span className="text-[8.5px] text-zinc-400 uppercase tracking-widest font-mono font-bold block">Escrow hold balances</span>
          <p className="text-base font-mono font-bold text-emerald-600 mt-1">{lockedFundsTotal.toLocaleString()} ETB</p>
          <p className="text-[8.5px] text-zinc-450 mt-1 font-mono uppercase">Secured Telebirr vaulted deposits</p>
        </div>

        <div className="bg-white p-4 border border-zinc-200 rounded-xl shadow-3xs">
          <span className="text-[8.5px] text-zinc-400 uppercase tracking-widest font-mono font-bold block">Holding commissions</span>
          <p className="text-base font-mono font-bold text-zinc-800 mt-1">{platformCommissions.toLocaleString()} ETB</p>
          <p className="text-[8.5px] text-zinc-455 mt-1 font-mono uppercase">10% Platform fee calculation</p>
        </div>

        <div className="bg-white p-4 border border-zinc-200 rounded-xl shadow-3xs">
          <span className="text-[8.5px] text-zinc-400 uppercase tracking-widest font-mono font-bold block">Vetting shields state</span>
          <p className="text-xs font-mono font-bold text-[#8A7241] mt-1.5 flex items-center gap-1.5 leading-none">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            BIOMETRICS SECURE
          </p>
          <p className="text-[8.5px] text-zinc-450 mt-1 font-mono uppercase">SHA256 Escrow handshakes safe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN: Seller Approval queue & Active Logistics router (ColSpan 3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Onboarding Review section */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-3xs">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
              <UserCheck className="w-4 h-4 text-[#8A7241]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">Merchant Registration Queue</h3>
            </div>

            <div className="space-y-4">
              {onboardings.length > 0 ? (
                onboardings.map(onb => (
                  <div key={onb.id} className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-zinc-950">{onb.businessName}</h4>
                        <p className="text-[10px] text-zinc-450 font-mono mt-0.5">OWNER Passport: {onb.ownerName} | ID: {onb.idNumber}</p>
                      </div>
                      
                      <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                        onb.status === 'Approved' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : onb.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-[#FAF6ED] text-[#865B17] border border-[#EFE5CE]'
                      }`}>
                        {onb.status}
                      </span>
                    </div>

                    <div className="text-zinc-600 text-[11px] leading-normal font-medium">
                      Store classification target: <span className="font-bold text-zinc-800 uppercase font-mono">{onb.category}</span> | Contact: {onb.phone}
                    </div>

                    {onb.status === 'Under_Review' && (
                      <div className="space-y-2 pt-2.5 border-t border-zinc-200">
                        <input
                          type="text"
                          placeholder="Provide approval comment or rejection logging details..."
                          className="w-full bg-white border border-zinc-200 px-3 py-2 rounded-lg focus:outline-none focus:border-luxury-gold text-xs placeholder-zinc-400"
                          onChange={e => {
                            setSelectedOnboardId(onb.id);
                            setRejectComment(e.target.value);
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => onReviewOnboarding(onb.id, 'Approved', rejectComment || 'Manual passport and business registry checks cleared.')}
                            className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-805 text-white text-[9.5px] font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            Approve Portfolio
                          </button>
                          <button
                            onClick={() => onReviewOnboarding(onb.id, 'Rejected', rejectComment || 'Supplied ID did not match GOM database checks.')}
                            className="px-4 py-1.5 bg-zinc-100 text-zinc-650 hover:bg-rose-50 hover:text-rose-600 text-[9.5px] font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            Reject Application
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-zinc-450 text-[11px] text-center py-6">No merchant registration queues logged.</p>
              )}
            </div>
          </div>

          {/* Active order router dispatcher sandbox */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-3xs">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950">Secure Dispatch State machine</h3>
            </div>

            <p className="text-[11.5px] text-zinc-500 mb-4 leading-relaxed font-medium">
              Interact as regulator with buyer orders to accelerate states manually during sandbox evaluations:
            </p>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-mono text-[10.5px] font-bold text-zinc-900">ORDER REF: {order.id}</span>
                      <p className="text-[10px] text-zinc-450 font-medium">Buyer: Nabil Shebab | Value: <span className="text-zinc-700 font-bold">{(order.totalAmount + order.tax).toLocaleString()} ETB</span></p>
                    </div>
                    
                    <span className="text-[8.5px] font-mono bg-zinc-100 text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded-md uppercase font-bold self-start sm:self-center">
                      {order.status}
                    </span>
                  </div>

                  {/* Move status select manually */}
                  <div className="pt-2 border-t border-zinc-200 flex items-center gap-2.5">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value, 'Manual dispatch transition log updated by administrator panel.')}
                      className="bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-[11px] focus:outline-none focus:border-luxury-gold"
                    >
                      <option value="Order Received">1. Escrow Deposited</option>
                      <option value="Seller Confirmed">2. Store Confirmed</option>
                      <option value="Awaiting Inspection">3. Awaiting physical unboxing check</option>
                      <option value="Inspection Approved">4. QC specifications Approved</option>
                      <option value="Ready For Pickup">5. Secure bag sealed</option>
                      <option value="Picked Up">6. Cargo Transited</option>
                      <option value="In Transit">7. En-route Radius</option>
                      <option value="Out For Delivery">8. Assign to mobile courier</option>
                      <option value="Delivered">9. Customer Handover</option>
                      <option value="Buyer Confirmed">10. Escrow payout released</option>
                    </select>
                    <span className="text-[10px] text-zinc-400 font-mono">Simulate Dispatch</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Ledger Logs (ColSpan 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950 text-white border border-zinc-900 rounded-2xl p-5 shadow-3xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-luxury-gold border-b border-zinc-900 pb-3">
                <Terminal className="w-4 h-4" />
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest">Crypto Escrow Auditing Ledger</h4>
              </div>

              <div className="space-y-3.5 max-h-[420px] overflow-y-auto scrollbar-none pr-1">
                {auditLogs.slice().reverse().map(log => (
                  <div key={log.id} className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg space-y-1.5 font-mono text-[9.5px] leading-relaxed">
                    <div className="flex justify-between text-zinc-500 text-[8px] font-bold">
                      <span>SEC_HASH: {log.id.slice(0, 8)}</span>
                      <span>{log.time || 'TODAY'}</span>
                    </div>
                    <p className="text-zinc-200 font-bold uppercase tracking-wider text-[8px] color-[#C5A25D]">{log.action}</p>
                    <p className="text-zinc-400 font-sans leading-normal">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-900 text-[8.5px] text-zinc-500 font-mono uppercase tracking-widest font-bold">
              SYSTEM: SHA256 LEDGER SHIELD ENABLED
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
