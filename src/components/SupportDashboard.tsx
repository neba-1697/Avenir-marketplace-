/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Send, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SupportTicket, Language } from '../types';

interface SupportDashboardProps {
  language: Language;
  tickets: SupportTicket[];
  onCreateTicket: (title: string, category: string, description: string) => void;
  onReplyTicket: (id: string, message: string, senderName: string, isFromStaff: boolean) => void;
  role: string;
}

export default function SupportDashboard({
  language,
  tickets,
  onCreateTicket,
  onReplyTicket,
  role,
}: SupportDashboardProps) {
  const [activeTicketId, setActiveTicketId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Order Inspection delay');
  const [replyText, setReplyText] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    onCreateTicket(newTitle, newCategory, newDesc);
    setNewTitle('');
    setNewDesc('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicketId) return;
    
    const sender = role === 'Buyer' ? 'Customer Buyer' : 'Avenir Custody Staff';
    onReplyTicket(activeTicketId, replyText, sender, role !== 'Buyer');
    setReplyText('');
  };

  const activeTicket = tickets.find(t => t.id === activeTicketId) || (tickets.length > 0 ? tickets[0] : null);

  return (
    <div className="bg-white p-6 font-sans text-zinc-800" id="avenir-support-base">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side: Submit issue Form (ColSpan 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-serif">Open Helpdesk Ticket</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-normal font-medium">
              Direct secure line with Avenir local compliance and escrow release managers.
            </p>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
            <div>
              <label className="text-[8.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Issue category Code</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-150 px-3 py-2.5 rounded-lg focus:outline-none text-[11px] font-medium"
              >
                <option value="Order Inspection delay">Physical Inspection Review speed</option>
                <option value="Telebirr Escrow Lock problem">Telebirr / Chapa payment escrow release</option>
                <option value="Seller unresponsiveness">Seller listing corrections</option>
                <option value="Other complaint">Other compliance dispute logs</option>
              </select>
            </div>

            <div>
              <label className="text-[8.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Brief title summary</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Telebirr escrow release delay Bole"
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-luxury-gold px-3 py-2.5 rounded-xl placeholder-zinc-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[8.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Detailed description</label>
              <textarea
                required
                rows={4}
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Supply transaction code, phone inputs, or address tracking discrepancies..."
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-luxury-gold px-3.5 py-3 rounded-xl placeholder-zinc-450 focus:outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 text-white font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-mono text-[9px]"
            >
              Dispatch Ticket Node
            </button>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800 font-bold text-[10.5px] animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse" /> Ticket initiated! Staff responded.
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Active Dialogue Messenger (ColSpan 3) */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-zinc-150 pt-5 lg:pt-0 lg:pl-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 border-b border-zinc-100 pb-3 font-serif">
               Active Help logs & Replies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-h-[380px]">
            {/* Active Tickets List column */}
            <div className="border-b sm:border-b-0 sm:border-r border-zinc-150 pr-0 sm:pr-4 pb-4 sm:pb-0 space-y-2 overflow-y-auto max-h-[360px] scrollbar-none">
              {tickets.length > 0 ? (
                tickets.map(tkt => (
                  <button
                    key={tkt.id}
                    onClick={() => setActiveTicketId(tkt.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                      tkt.id === (activeTicket?.id || '')
                        ? 'bg-[#FAF6ED] border-[#C5A25D] text-zinc-950 font-bold'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:border-zinc-350 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="truncate text-xs">
                      <div className="text-[8.5px] font-mono font-bold text-zinc-400">ID: {tkt.id}</div>
                      <div className="font-bold truncate pr-2 mt-1">{tkt.title}</div>
                      <div className="text-[7.5px] text-zinc-400 truncate mt-0.5 uppercase tracking-wider font-mono">{tkt.category}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 text-zinc-400" />
                  </button>
                ))
              ) : (
                <p className="text-zinc-400 text-xs">No active tickets registered.</p>
              )}
            </div>

            {/* Messenger Conversation dialogue (ColSpan 2) */}
            <div className="sm:col-span-2 flex flex-col justify-between h-full bg-zinc-50 border border-zinc-150 rounded-2xl p-4">
              {activeTicket ? (
                <div className="flex flex-col h-full justify-between gap-4">
                  
                  <div className="flex-1 overflow-y-auto space-y-3 pb-3 max-h-[260px] scrollbar-none">
                    <div className="p-3.5 bg-white border border-zinc-200 rounded-xl space-y-2 shadow-3xs">
                      <span className="text-[7.5px] font-mono text-zinc-400 uppercase tracking-widest block font-bold border-b border-zinc-100 pb-1">
                        Initial statement (ID: {activeTicket.id})
                      </span>
                      <p className="text-xs text-zinc-950 font-bold leading-none">{activeTicket.title}</p>
                      <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 font-medium">{activeTicket.description}</p>
                    </div>

                    {activeTicket.messages.map((m, idx) => (
                      <div 
                        key={idx} 
                        className={`flex flex-col ${m.isFromStaff ? 'items-start' : 'items-end'}`}
                      >
                        <span className="text-[8.5px] font-mono text-zinc-400 mb-0.5 px-1">{m.senderName}</span>
                        <div className={`p-3 max-w-[85%] rounded-2xl text-[11px] leading-relaxed shadow-3xs border transition-all ${
                          m.isFromStaff
                            ? 'bg-white border-zinc-200 text-zinc-800 rounded-tl-none font-medium'
                            : 'bg-zinc-950 border-zinc-900 text-white rounded-tr-none'
                        }`}>
                          {m.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input reply form */}
                  <form onSubmit={handleSendReply} className="flex gap-2 border-t border-zinc-150 pt-3">
                    <input
                      type="text"
                      required
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Compose message..."
                      className="flex-1 bg-white border border-zinc-200 px-3.5 py-2 text-xs text-zinc-800 rounded-lg placeholder-zinc-400 focus:outline-none focus:border-luxury-gold"
                    />
                    <button
                      type="submit"
                      className="p-2.5 bg-zinc-950 hover:bg-zinc-900 text-white rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center border border-zinc-900"
                    >
                      <Send className="w-3.5 h-3.5 text-luxury-gold font-bold" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-bold">
                  Select a live helpdesk ticket
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
