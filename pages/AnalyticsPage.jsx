import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Zap,
  Smile,
  Clock,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../components/common/StatCard';
import {
  ANALYTICS_SUMMARY,
  INTERACTION_ACTIVITY_DATA,
  MEMORY_RETRIEVAL_TREND,
  TICKET_CATEGORY_DATA,
  TOP_RECALLED_TOPICS
} from '../data/mockAnalytics';
import { useToast } from '../context/ToastContext';

export default function AnalyticsPage() {
  const { addToast } = useToast();
  const [dateRange, setDateRange] = useState('30d');

  const handleExportReport = () => {
    addToast({
      title: 'Analytics Report Generated',
      message: 'Persistent memory intelligence audit exported to CSV format.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
            Memory &amp; Resolution Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deep observability into Hindsight vector hit rates, response latencies, and repetition avoidance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  dateRange === range ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 6 Key Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Queries"
          value="24,892"
          trend="+18.4%"
          isPositive={true}
          icon={BarChart3}
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          title="First Contact (FCR)"
          value="91.8%"
          trend="+28.5%"
          isPositive={true}
          icon={CheckCircle2}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Avg Latency"
          value="340ms"
          trend="-64.2%"
          isPositive={true}
          icon={Zap}
          gradient="from-cyan-500 to-blue-500"
        />
        <StatCard
          title="Memory Hit Rate"
          value="94.6%"
          trend="+12.1%"
          isPositive={true}
          icon={Brain}
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard
          title="Repeat Reduction"
          value="-68.5%"
          trend="-68.5%"
          isPositive={true}
          icon={TrendingUp}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          title="CSAT Score"
          value="4.92 / 5"
          trend="+0.42"
          isPositive={true}
          icon={Smile}
          gradient="from-rose-500 to-red-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart (7 cols): Monthly Hindsight Recall Growth */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-white/10 bg-dark-card/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Persistent Memory Ingestion & Hit Rate Growth
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total vectors accumulated in Hindsight vs semantic hit accuracy (%)
              </p>
            </div>
            <span className="font-mono text-xs text-purple-400 font-bold">14,280 Vectors</span>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MEMORY_RETRIEVAL_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121829',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="hitRate" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} name="Hit Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (5 cols): Top Recalled Knowledge Topics */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-white/10 bg-dark-card/60 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Top Recalled Memory Topics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Knowledge entities most frequently injected into prompts
            </p>

            <div className="mt-5 space-y-3">
              {TOP_RECALLED_TOPICS.map((topic, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{topic.topic}</span>
                    <span className="text-[10px] text-purple-400 font-mono">Confidence: {topic.confidence}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-100 px-2 py-1 rounded-lg bg-black/40">
                    {topic.count} recalls
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Powered by Vectorize Semantic Index</span>
            <span className="text-emerald-400 font-mono font-bold">14.8ms avg</span>
          </div>
        </div>

      </div>

    </div>
  );
}
