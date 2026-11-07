import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TicketCheck,
  Search,
  Filter,
  Plus,
  Brain,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { MOCK_TICKETS } from '../data/mockTickets';
import { MOCK_CUSTOMERS } from '../data/mockCustomers';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

export default function TicketsPage() {
  const { addToast } = useToast();
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [activeTab, setActiveTab] = useState('all'); // all, open, in_progress, resolved
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  // New ticket form state
  const [newTitle, setNewTitle] = useState('');
  const [newCustomerId, setNewCustomerId] = useState('cust_001');
  const [newPriority, setNewPriority] = useState('high');
  const [newCategory, setNewCategory] = useState('Database');

  const filteredTickets = tickets.filter(t => {
    const matchesTab = activeTab === 'all' || t.status === activeTab;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesSearch = !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesPriority && matchesSearch;
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const customer = MOCK_CUSTOMERS.find(c => c.id === newCustomerId) || MOCK_CUSTOMERS[0];
    const created = {
      id: `TICK-${Math.floor(1080 + Math.random() * 50)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerCompany: customer.company,
      title: newTitle,
      priority: newPriority,
      status: 'open',
      category: newCategory,
      assignedAgent: 'AI Agent (MemoraBot)',
      createdAt: 'Just now',
      resolvedAt: null,
      responseTime: 'Pending',
      memoryUsed: true,
      memorySnippet: `Ingesting issue parameters into ${customer.name}'s Hindsight memory collection`,
      messagesCount: 1
    };

    setTickets([created, ...tickets]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    addToast({
      title: 'Ticket Created',
      message: `${created.id} initiated with automated Hindsight persistent memory link`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
            Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Issues continuously resolved and enhanced through persistent customer memory.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-neon-blue transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-2xl border border-white/10 bg-dark-card/40 backdrop-blur-xl">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Tickets' },
            { id: 'open', label: 'Open' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white border-brand-500 shadow-neon-blue'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority Filter & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 text-xs rounded-xl border bg-dark-card/80 border-white/10 text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.map(ticket => (
          <motion.div
            key={ticket.id}
            whileHover={{ y: -2 }}
            onClick={() => setActiveTicket(ticket)}
            className="p-5 rounded-2xl border border-white/10 bg-dark-card/60 hover:border-brand-500/30 transition-all cursor-pointer shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className={`p-3 rounded-2xl flex-shrink-0 ${
                ticket.status === 'resolved'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : ticket.status === 'in_progress'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {ticket.status === 'resolved' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-purple-400">{ticket.id}</span>
                  <span className="text-[10px] text-slate-400">• {ticket.category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    ticket.priority === 'urgent'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : ticket.priority === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 truncate">{ticket.title}</h3>
                
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{ticket.customerName} ({ticket.customerCompany})</span>
                  <span>•</span>
                  <span>Created {ticket.createdAt}</span>
                </p>

                {ticket.memoryUsed && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[10px] text-purple-300">
                    <Brain className="w-3 h-3 text-purple-400" />
                    <span>Hindsight: {ticket.memorySnippet}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 text-xs flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Resolution Time</span>
                <span className="font-mono font-bold text-emerald-400">{ticket.responseTime}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ticket Details Modal */}
      {activeTicket && (
        <Modal
          isOpen={!!activeTicket}
          onClose={() => setActiveTicket(null)}
          title={`Ticket ${activeTicket.id}: ${activeTicket.title}`}
        >
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <span className="text-slate-400 text-[10px] block">Customer</span>
                <span className="font-bold text-white text-sm">{activeTicket.customerName}</span>
                <span className="text-slate-400 block">{activeTicket.customerCompany}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block">Assigned Support Agent</span>
                <span className="font-mono text-purple-400 font-semibold">{activeTicket.assignedAgent}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-950/20 space-y-1">
              <span className="text-[10px] font-bold uppercase text-purple-400 flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" /> Persistent Memory Context Link
              </span>
              <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
                {activeTicket.memorySnippet}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <Link
                to="/chat"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center gap-1.5"
              >
                <span>Continue in AI Chat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setActiveTicket(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Support Ticket"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Select Customer</label>
            <select
              value={newCustomerId}
              onChange={(e) => setNewCustomerId(e.target.value)}
              className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {MOCK_CUSTOMERS.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Issue Title</label>
            <input
              type="text"
              placeholder="e.g. Next.js cache revalidation failing on edge worker"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Database">Database & Pooling</option>
                <option value="API">API & Webhooks</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Security">Security & GDPR</option>
                <option value="Billing">Billing & Tiers</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-neon-blue"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
