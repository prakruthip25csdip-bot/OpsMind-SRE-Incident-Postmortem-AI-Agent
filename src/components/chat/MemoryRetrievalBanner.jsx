import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Sparkles, CheckCircle2, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function MemoryRetrievalBanner({ step, retrievedCount = 3, latency = '14.8ms', isLive = false }) {
  // Step: 0: idle, 1: 'retrieving', 2: 'found', 3: 'generated'
  if (step === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, y: -10 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -10 }}
        className="px-4 py-3 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-[#14122b] to-indigo-950/60 backdrop-blur-xl shadow-lg my-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          {/* Active step message */}
          <div className="flex items-center gap-2.5">
            {step === 1 && (
              <>
                <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
                <div>
                  <span className="font-semibold text-purple-300">
                    Retrieving customer memories from Hindsight...
                  </span>
                  <span className="block text-[10px] text-purple-400/80">
                    Vector cosine similarity search over persistent bank
                  </span>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <Database className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-semibold text-emerald-300">
                    {retrievedCount} relevant memories found.
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Hindsight recall latency: <strong className="text-emerald-400 font-mono">{latency}</strong>
                  </span>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="font-semibold text-cyan-300">
                    Personalized response generated via Groq.
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Context synthesized with zero repetitive questions
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Pipeline badges */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              step >= 1 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-slate-500'
            }`}>
              1. Recall
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              step >= 2 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-slate-500'
            }`}>
              2. Inject
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              step >= 3 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-slate-500'
            }`}>
              3. Solve
            </span>
            <span className="ml-2 text-[10px] font-mono text-slate-400">
              {isLive ? '🟢 Live API' : '🟣 Demo Mode'}
            </span>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
