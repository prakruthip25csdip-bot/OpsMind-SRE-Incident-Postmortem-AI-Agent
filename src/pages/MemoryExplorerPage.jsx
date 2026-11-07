import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Search,
  Plus,
  Sparkles,
  Database,
  Filter,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { MOCK_MEMORIES, MEMORY_CATEGORIES, MEMORY_STATS } from '../data/mockMemories';
import MemoryGraph from '../components/memory/MemoryGraph';
import MemoryDetailDrawer from '../components/memory/MemoryDetailDrawer';
import IngestMemoryModal from '../components/memory/IngestMemoryModal';
import { useToast } from '../context/ToastContext';
import { useApi } from '../context/ApiContext';
import confetti from 'canvas-confetti';
import { playSuccessChime } from '../utils/soundEffects';

export default function MemoryExplorerPage() {
  const { isLive } = useApi();
  const { addToast } = useToast();

  const [memories, setMemories] = useState(MOCK_MEMORIES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMemory, setActiveMemory] = useState(null);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'timeline'

  const handleIngestNewMemory = (newMem) => {
    const memoryNode = {
      id: 'mem_' + Math.random().toString(36).substring(2, 7),
      confidence: 0.97,
      similarityScore: 0.94,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      embeddingDim: 1536,
      status: 'active',
      recallCount: 1,
      decayScore: 0.01,
      ...newMem
    };

    setMemories([memoryNode, ...memories]);
    playSuccessChime();
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#10b981']
      });
    } catch (e) {}

    addToast({
      title: 'Memory Vectorized & Indexed',
      message: `Persisted "${newMem.title}" to Hindsight vector store (1536 dims)`,
      type: 'success'
    });
  };

  const filteredMemories = memories.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Title & Hero Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-2">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>Hindsight by Vectorize • Neural Memory Graph</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
            Persistent Memory Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Visually inspect all customer knowledge nodes, preferences, and verified technical solutions stored in Hindsight’s vector database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 shadow-neon-purple transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest Vector Memory</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Chips Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl border border-white/10 bg-dark-card/60 shadow-lg">
          <span className="text-slate-400 text-[11px] block">Total Persistent Vectors</span>
          <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
            {MEMORY_STATS.totalMemories.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">99.2% retention rate</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-dark-card/60 shadow-lg">
          <span className="text-slate-400 text-[11px] block">Average Recall Latency</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            {MEMORY_STATS.avgRecallLatencyMs}ms
          </span>
          <span className="text-[10px] text-slate-400">Sub-15ms guaranteed</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-dark-card/60 shadow-lg">
          <span className="text-slate-400 text-[11px] block">Semantic Hit Rate</span>
          <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
            {MEMORY_STATS.semanticHitRate}%
          </span>
          <span className="text-[10px] text-slate-400">Cosine threshold &gt; 0.85</span>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-dark-card/60 shadow-lg">
          <span className="text-slate-400 text-[11px] block">Active Knowledge Clusters</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
            {MEMORY_STATS.activeNodes}
          </span>
          <span className="text-[10px] text-purple-400 font-mono">Vectorize Cloud</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-2xl border border-white/10 bg-dark-card/40 backdrop-blur-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {MEMORY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white border-purple-500 shadow-neon-purple'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input & View switch */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search vector embeddings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'graph' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Graph
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'timeline' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Canvas */}
      {viewMode === 'graph' ? (
        <MemoryGraph
          memories={filteredMemories}
          selectedMemory={activeMemory}
          onSelectMemory={(mem) => setActiveMemory(mem)}
        />
      ) : (
        /* Timeline View */
        <div className="rounded-3xl border border-white/10 bg-dark-card/60 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 mb-4">Chronological Memory Ingestion Timeline</h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-white/10">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                onClick={() => setActiveMemory(mem)}
                className="relative pl-8 cursor-pointer group"
              >
                <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-purple-500 ring-4 ring-[#080b12] group-hover:scale-125 transition-transform" />
                <div className="p-4 rounded-2xl border border-white/5 group-hover:border-purple-500/30 bg-white/5 group-hover:bg-white/10 transition-all text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                      {mem.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{mem.timestamp}</span>
                  </div>
                  <p className="text-slate-300 mt-1 leading-relaxed">{mem.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-purple-400">{mem.customerName}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Similarity: {(mem.similarityScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards list below graph */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-100">
          Knowledge Vectors ({filteredMemories.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemories.map((mem) => (
            <motion.div
              key={mem.id}
              whileHover={{ y: -3 }}
              onClick={() => setActiveMemory(mem)}
              className="p-5 rounded-2xl border border-white/10 bg-dark-card/50 hover:bg-dark-card/80 hover:border-purple-500/40 transition-all cursor-pointer shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-purple-400">{mem.id}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                    {mem.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100">{mem.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                  {mem.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{mem.customerName}</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {(mem.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Drawer */}
      <MemoryDetailDrawer
        memory={activeMemory}
        onClose={() => setActiveMemory(null)}
      />

      {/* Ingest Modal */}
      <IngestMemoryModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onIngest={handleIngestNewMemory}
      />

    </div>
  );
}
