import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, ExternalLink, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 dark:border-white/10 light:border-slate-200 bg-[#06080e] dark:bg-[#06080e] light:bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-memory-purple p-0.5 shadow-neon-blue">
                <div className="w-full h-full bg-[#0a0d14] dark:bg-[#0a0d14] light:bg-white rounded-[10px] flex items-center justify-center">
                  <Brain className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MemoraDesk
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI Customer Support Agent with Persistent Memory powered by Hindsight. Every interaction becomes an opportunity to remember and deliver superior intelligence.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Hack with Hyderabad 3.0</span>
            </div>
          </div>

          {/* Hackathon Technologies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-900 mb-3">
              Official Stack
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://hindsight.vectorize.io"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  <span>Hindsight by Vectorize</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://groq.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <span>Groq LPUs (Llama-3.3-70b)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.band.ai"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-400 transition-colors flex items-center gap-1"
                >
                  <span>Band AI Desktop</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <span className="text-slate-500">FastAPI Async Core</span>
              </li>
            </ul>
          </div>

          {/* Product Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-900 mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Overview Dashboard</Link></li>
              <li><Link to="/chat" className="hover:text-brand-400 transition-colors">AI Support Chat</Link></li>
              <li><Link to="/memory-explorer" className="hover:text-purple-400 transition-colors">Memory Explorer (Graph)</Link></li>
              <li><Link to="/comparison" className="hover:text-brand-400 transition-colors">Before & After Comparison</Link></li>
              <li><Link to="/customers" className="hover:text-brand-400 transition-colors">Customer Directory</Link></li>
              <li><Link to="/analytics" className="hover:text-brand-400 transition-colors">Resolution Analytics</Link></li>
            </ul>
          </div>

          {/* Hackathon Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-900 mb-3">
              Hackathon Statement
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Theme: <em className="text-purple-400 not-italic font-semibold">AI Agents That Learn Using Hindsight</em>. Solving repetitive support friction through persistent semantic recall.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FastAPI Backend Ready (:8000)</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 dark:border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MemoraDesk. Built for Hack with Hyderabad 3.0.</p>
          <p className="flex items-center gap-1.5">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for intelligent persistent AI customer support.
          </p>
        </div>
      </div>
    </footer>
  );
}
