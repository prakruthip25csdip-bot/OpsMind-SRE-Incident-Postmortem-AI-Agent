import React from 'react';
import {
  User,
  ShieldCheck,
  Brain,
  History,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Tag,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerIntelPanel({ customer, memories = [] }) {
  if (!customer) return null;

  const previousIssues = customer.knownIssues || [];
  const preferences = customer.preferences || {};

  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
      
      {/* Top Customer Header Card */}
      <div className="p-4 rounded-2xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 dark:bg-white/5 light:bg-slate-50 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-500/40"
          />
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 truncate">
              {customer.name}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">{customer.company}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[10px] text-purple-400 font-bold">{customer.id}</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {customer.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Sentiment & Memory stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
          <div className="p-2 rounded-xl bg-black/20">
            <span className="text-slate-400 block text-[10px]">CSAT Sentiment</span>
            <span className="font-bold font-mono text-emerald-400">{customer.sentiment}% Satisfied</span>
          </div>
          <div className="p-2 rounded-xl bg-black/20">
            <span className="text-slate-400 block text-[10px]">Persistent Memories</span>
            <span className="font-bold font-mono text-purple-400">{customer.memoryCount} Vectors</span>
          </div>
        </div>
      </div>

      {/* Customer Preferences (Retrieved from Hindsight) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-purple-400">
            <Brain className="w-3.5 h-3.5" /> Customer Preferences
          </span>
          <span className="text-[10px] text-slate-500">Auto-Recall</span>
        </div>

        <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-950/20 space-y-2">
          {preferences.framework && (
            <div className="flex items-start justify-between">
              <span className="text-slate-400 text-[11px]">Tech Stack:</span>
              <span className="font-mono font-semibold text-purple-300 text-right">{preferences.framework}</span>
            </div>
          )}
          {preferences.cloud && (
            <div className="flex items-start justify-between">
              <span className="text-slate-400 text-[11px]">Region / Cloud:</span>
              <span className="font-mono font-semibold text-purple-300 text-right">{preferences.cloud}</span>
            </div>
          )}
          {preferences.database && (
            <div className="flex items-start justify-between">
              <span className="text-slate-400 text-[11px]">Database:</span>
              <span className="font-mono font-semibold text-purple-300 text-right">{preferences.database}</span>
            </div>
          )}
          {preferences.communication && (
            <div className="pt-1.5 border-t border-purple-500/10">
              <span className="text-[10px] text-slate-400 block mb-0.5">Style Preference:</span>
              <p className="text-[11px] text-slate-300 italic">"{preferences.communication}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Previous Issues & Solutions */}
      <div className="space-y-2">
        <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-amber-400">
          <History className="w-3.5 h-3.5" /> Historical Issues &amp; Fixes
        </span>

        <div className="space-y-1.5">
          {previousIssues.map((issue, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-white/5 bg-white/5 flex items-start gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-[11px] text-slate-300 leading-tight">{issue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Link to Full Memory Explorer */}
      <div className="pt-2">
        <Link
          to="/memory-explorer"
          className="w-full py-2.5 px-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-center font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inspect {customer.name}'s Vector Graph</span>
        </Link>
      </div>

    </div>
  );
}
