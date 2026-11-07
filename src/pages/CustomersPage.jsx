import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Brain,
  MessageSquare,
  TicketCheck,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Plus,
  Tag,
  Clock,
  Sparkles
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '../data/mockCustomers';
import { MOCK_MEMORIES } from '../data/mockMemories';
import Modal from '../components/common/Modal';
import { Link } from 'react-router-dom';

export default function CustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || c.plan.toLowerCase().includes(selectedPlan.toLowerCase());
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
            Customer Memory Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage customer accounts, inspect persistent vector profiles, and review stored preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl border border-white/10 bg-dark-card/40 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Enterprise', 'Scale', 'Pro'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPlan(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedPlan === p
                  ? 'bg-brand-600 text-white border-brand-500 shadow-neon-blue'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {p === 'all' ? 'All Plans' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => {
            const customerMemories = MOCK_MEMORIES.filter(m => m.customerId === customer.id);
            return (
              <motion.div
                key={customer.id}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl border border-white/10 bg-dark-card/60 hover:border-brand-500/40 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/30"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-100">{customer.name}</h3>
                        <p className="text-xs text-slate-400">{customer.company}</p>
                        <span className="text-[10px] text-slate-500">{customer.role}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-500/10 text-brand-300 border border-brand-500/20">
                      {customer.plan}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="grid grid-cols-2 gap-2 mt-5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 text-[10px] block">Stored Memories</span>
                      <span className="font-mono font-bold text-purple-400 text-sm mt-0.5 flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5" /> {customer.memoryCount}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 text-[10px] block">Customer CSAT</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                        {customer.sentiment}%
                      </span>
                    </div>
                  </div>

                  {/* Preferences snippet */}
                  <div className="mt-4 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-slate-300">
                    <span className="font-bold uppercase text-[9px] text-purple-400 block mb-0.5">
                      Hindsight Preferences:
                    </span>
                    <p className="truncate">Stack: {customer.preferences.framework}</p>
                    <p className="truncate text-slate-400">Database: {customer.preferences.database}</p>
                  </div>
                </div>

                {/* Card footer button */}
                <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Active {customer.lastActive}</span>
                  <button
                    onClick={() => setActiveCustomer(customer)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300"
                  >
                    <span>View Memory Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl border border-white/10 bg-dark-card/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Hindsight Memories</th>
                  <th className="p-4">Tickets</th>
                  <th className="p-4">CSAT</th>
                  <th className="p-4">Last Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={customer.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-100 block">{customer.name}</span>
                        <span className="text-[10px] text-slate-400">{customer.company}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-500/10 text-brand-300 border border-brand-500/20">
                        {customer.plan}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-purple-400 font-semibold">
                      {customer.memoryCount} nodes
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {customer.ticketsCount}
                    </td>
                    <td className="p-4 font-mono text-emerald-400 font-semibold">
                      {customer.sentiment}%
                    </td>
                    <td className="p-4 text-slate-400">
                      {customer.lastActive}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setActiveCustomer(customer)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-brand-400 hover:text-white bg-white/5 hover:bg-brand-600 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {activeCustomer && (
        <Modal
          isOpen={!!activeCustomer}
          onClose={() => setActiveCustomer(null)}
          title={`Customer Profile: ${activeCustomer.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs text-slate-300">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <img
                src={activeCustomer.avatar}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/50"
              />
              <div>
                <h3 className="text-base font-bold text-white">{activeCustomer.name}</h3>
                <p className="text-slate-400">{activeCustomer.role} • {activeCustomer.company}</p>
                <p className="text-[11px] text-brand-400 font-mono mt-1">{activeCustomer.email}</p>
              </div>
            </div>

            {/* Persistent Preferences */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-purple-400 flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" /> Persistent Hindsight Technical Profile
              </span>
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2 font-mono text-[11px]">
                <div><strong className="text-purple-300">Framework:</strong> {activeCustomer.preferences.framework}</div>
                <div><strong className="text-purple-300">Cloud Region:</strong> {activeCustomer.preferences.cloud}</div>
                <div><strong className="text-purple-300">Database:</strong> {activeCustomer.preferences.database}</div>
                <div><strong className="text-purple-300">Communication:</strong> {activeCustomer.preferences.communication}</div>
              </div>
            </div>

            {/* Historical Issues */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-400">
                Resolved Issues History
              </span>
              <div className="space-y-1.5">
                {activeCustomer.knownIssues.map((issue, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px]">
                    {issue}
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                to="/chat"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch Chat with {activeCustomer.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => setActiveCustomer(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
