import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Database,
  Brain,
  Sparkles,
  Calendar,
  User,
  TicketCheck,
  Tag,
  Copy,
  Check,
  Cpu,
  Layers
} from 'lucide-react';
import { useState } from 'react';

export default function MemoryDetailDrawer({ memory, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!memory) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(memory, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock embedding vector snippet
  const mockVectorSample = [
    0.0418, -0.0192, 0.0821, -0.0034, 0.1294, -0.0542, 0.0911, -0.0238,
    0.0152, 0.0763, -0.0384, 0.1042, -0.0091, 0.0652, -0.0118, 0.0489
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-lg h-full border-l shadow-2xl z-10 flex flex-col justify-between overflow-y-auto bg-[#0d1220] dark:bg-[#0d1220] light:bg-white border-white/10 dark:border-white/10 light:border-slate-200 text-slate-100 dark:text-slate-100 light:text-slate-900"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                  Memory Node Inspector
                </h3>
                <span className="font-mono text-xs text-purple-400 font-bold">{memory.id}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            
            {/* Title & Category Badge */}
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Category: {memory.category}
              </span>
              <h2 className="text-lg font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mt-2">
                {memory.title}
              </h2>
            </div>

            {/* Core Memory Content */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 light:bg-slate-50 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Extracted Semantic Knowledge
              </span>
              <p className="text-xs text-slate-200 dark:text-slate-200 light:text-slate-800 leading-relaxed font-medium">
                {memory.content}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] block">Customer</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{memory.customerName}</span>
                <span className="font-mono text-[10px] text-purple-400">{memory.customerId}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] block">Semantic Confidence</span>
                <span className="font-bold font-mono text-emerald-400 text-sm mt-0.5 block">
                  {(memory.confidence * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500">Cosine similarity: {memory.similarityScore}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] block">Vector Dimension</span>
                <span className="font-semibold font-mono text-cyan-400 mt-0.5 block">
                  {memory.embeddingDim || 1536} dims
                </span>
                <span className="text-[10px] text-slate-500">Hindsight cluster</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[10px] block">Associated Ticket</span>
                <span className="font-semibold font-mono text-brand-400 mt-0.5 block">
                  {memory.sourceTicketId || 'Direct Interaction'}
                </span>
                <span className="text-[10px] text-slate-500">Auto-linked</span>
              </div>
            </div>

            {/* Tags */}
            {memory.tags && memory.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Semantic Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {memory.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Embedding Vector Sample */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" /> Vector Embedding (First 16 floats)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">1536-D FP32</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080b12] border border-white/10 font-mono text-[10px] text-emerald-400/90 leading-relaxed overflow-x-auto">
                [{mockVectorSample.map(n => n.toFixed(4)).join(', ')}, ...]
              </div>
            </div>

            {/* Hindsight JSON Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Hindsight API Raw Schema
                </span>
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-[#080b12] border border-white/10 font-mono text-[11px] text-purple-300/90 overflow-x-auto max-h-40">
                <pre>{JSON.stringify(memory, null, 2)}</pre>
              </div>
            </div>

          </div>

          {/* Footer button */}
          <div className="p-4 border-t border-white/10 dark:border-white/10 light:border-slate-200 bg-black/20 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Synced with Hindsight Cloud
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
