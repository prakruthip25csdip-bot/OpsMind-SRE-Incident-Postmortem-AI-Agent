import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Brain,
  TicketCheck,
  Smile,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../components/common/StatCard';
import StatusIndicator from '../components/common/StatusIndicator';
import { INTERACTION_ACTIVITY_DATA, TICKET_CATEGORY_DATA, MEMORY_RETRIEVAL_TREND } from '../data/mockAnalytics';
import { MOCK_CONVERSATIONS } from '../data/mockConversations';
import { MOCK_TICKETS } from '../data/mockTickets';
import { MOCK_MEMORIES } from '../data/mockMemories';

export default function DashboardPage() {
  const [activeTimeframe, setActiveTimeframe] = useState('7d');

  return (
    <div className="space-y-8 pb-10">
      
      {/* Welcome Banner with Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative p-6 sm:p-8 rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 overflow-hidden bg-gradient-to-r from-brand-950/70 via-[#131b2e] to-purple-950/70 shadow-2xl backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>MemoraDesk Active • Hindsight Vector Engine Synchronized</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer Support That Remembers Everything
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your AI agents have recalled <strong className="text-emerald-400">14,280 memories</strong> with an average latency of <strong className="text-cyan-400">14.8ms</strong>, reducing repetitive questions by 68%.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-neon-blue transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open AI Chat</span>
            </Link>
            <Link
              to="/memory-explorer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Memory Explorer</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        <StatCard
          title="Total Customers"
          value={5480}
          trend="+12.4%"
          isPositive={true}
          icon={Users}
          gradient="from-blue-500 to-indigo-600"
          glowColor="rgba(59, 130, 246, 0.25)"
          description="Active accounts"
        />
        <StatCard
          title="Conversations"
          value={24892}
          trend="+18.4%"
          isPositive={true}
          icon={MessageSquare}
          gradient="from-indigo-500 to-purple-600"
          glowColor="rgba(99, 102, 241, 0.25)"
          description="Resolved by AI"
        />
        <StatCard
          title="Stored Memories"
          value={14280}
          trend="+34.2%"
          isPositive={true}
          icon={Brain}
          gradient="from-purple-500 to-pink-600"
          glowColor="rgba(168, 85, 247, 0.25)"
          description="In Hindsight"
        />
        <StatCard
          title="Resolved Tickets"
          value={3840}
          trend="+9.1%"
          isPositive={true}
          icon={TicketCheck}
          gradient="from-emerald-500 to-teal-600"
          glowColor="rgba(16, 185, 129, 0.25)"
          description="Avg: 18m"
        />
        <StatCard
          title="Satisfaction CSAT"
          value="4.92"
          suffix=" / 5"
          trend="+0.42"
          isPositive={true}
          icon={Smile}
          gradient="from-cyan-500 to-blue-500"
          glowColor="rgba(6, 182, 212, 0.25)"
          description="99.2% positive"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart (8 cols): Interaction Volume & Memory Retrievals */}
        <div className="lg:col-span-8 p-6 rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-dark-card/60 dark:bg-dark-card/60 light:bg-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 dark:border-white/10 light:border-slate-200 gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Customer Interaction & Memory Retrieval Activity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily volume comparing incoming queries vs successful Hindsight memory hits
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              <button
                onClick={() => setActiveTimeframe('7d')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeTimeframe === '7d' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setActiveTimeframe('30d')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  activeTimeframe === '30d' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INTERACTION_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121829',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="interactions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorInteractions)" name="Total Queries" />
                <Area type="monotone" dataKey="memoryRetrievals" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" name="Hindsight Recalls" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-around text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-400">Total Queries:</span>
              <span className="font-bold font-mono text-slate-200">2,490</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-slate-400">Hindsight Recalls:</span>
              <span className="font-bold font-mono text-purple-400">2,315 (93%)</span>
            </div>
          </div>
        </div>

        {/* Right Chart (4 cols): Issue Categories Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-dark-card/60 dark:bg-dark-card/60 light:bg-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
              Resolved Issue Categories
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Knowledge domains in persistent memory
            </p>

            <div className="h-52 mt-4 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TICKET_CATEGORY_DATA}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {TICKET_CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121829',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-xl font-bold font-mono text-white">100%</span>
                <span className="block text-[10px] text-slate-400 uppercase">Covered</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5">
            {TICKET_CATEGORY_DATA.slice(0, 4).map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 dark:text-slate-300 light:text-slate-700">{item.name}</span>
                </div>
                <span className="font-mono font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Conversations & Recent Tickets Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Conversations (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-dark-card/60 dark:bg-dark-card/60 light:bg-white shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-slate-200">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-400" />
              <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Recent AI Support Conversations
              </h3>
            </div>
            <Link to="/chat" className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {MOCK_CONVERSATIONS.slice(0, 3).map((conv) => (
              <Link
                key={conv.id}
                to="/chat"
                className="p-3.5 rounded-2xl border border-white/5 hover:border-brand-500/30 bg-white/5 hover:bg-white/10 transition-all block group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-brand-300 transition-colors">
                    {conv.customerName}
                  </span>
                  <span className="text-[10px] text-slate-400">{conv.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1 font-medium">
                  {conv.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {conv.lastMessage}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Support Tickets (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-dark-card/60 dark:bg-dark-card/60 light:bg-white shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-slate-200">
            <div className="flex items-center gap-2">
              <TicketCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                Live Support Tickets
              </h3>
            </div>
            <Link to="/tickets" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              <span>View Tickets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {MOCK_TICKETS.slice(0, 3).map((ticket) => (
              <div
                key={ticket.id}
                className="p-3.5 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-purple-400 font-bold">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : ticket.status === 'in_progress'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mt-1 truncate">
                    {ticket.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {ticket.customerName} ({ticket.customerCompany})
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                    {ticket.memoryUsed ? '⚡ Memory Recalled' : 'Indexing'}
                  </span>
                  <span className="text-[10px] text-slate-500">{ticket.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
