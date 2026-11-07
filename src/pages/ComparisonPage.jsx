import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Play,
  RotateCcw,
  ArrowRight,
  SplitSquareVertical,
  Layers,
  Database
} from 'lucide-react';
import { COMPARISON_SCENARIOS } from '../data/comparisonScenarios';
import confetti from 'canvas-confetti';
import { playSuccessChime } from '../utils/soundEffects';

export default function ComparisonPage() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(true);

  const scenario = COMPARISON_SCENARIOS[selectedScenarioIndex];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationComplete(false);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
      playSuccessChime();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']
        });
      } catch (e) {}
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
          The Power of Persistent Memory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Same AI. Different Intelligence.{' '}
          <span className="gradient-text-blue-purple block sm:inline">The Power of Memory.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Observe how persistent vector recall turns a repetitive, frustrating AI support interaction into an immediate, delight-inducing solution.
        </p>
      </div>

      {/* Scenario Picker & Simulation Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl border border-white/10 bg-dark-card/60 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Scenarios:
          </span>
          {COMPARISON_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setSimulationComplete(true);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                selectedScenarioIndex === idx
                  ? 'bg-brand-600 text-white border-brand-500 shadow-neon-blue'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-neon-blue transition-all disabled:opacity-50"
        >
          {isSimulating ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isSimulating ? 'Simulating Dual Responses...' : 'Simulate Both AIs'}</span>
        </button>
      </div>

      {/* Incoming Customer Query Display */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#0f1422] text-xs flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300 flex-shrink-0">
          <SplitSquareVertical className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">Customer Query from {scenario.customer}</span>
            <span className="text-[10px] text-slate-400 font-mono">Identical Prompt Delivered to Both AIs</span>
          </div>
          <p className="text-slate-300 font-medium text-sm mt-1 italic">
            "{scenario.customerQuery}"
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* LEFT PANEL: WITHOUT MEMORY (Generic / Stateless AI) */}
        <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-b from-[#181318]/90 via-[#141216]/80 to-[#100f12]/90 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-rose-300">
                    WITHOUT MEMORY
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    Stateless • Zero History • Amnesic
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                Frustration: {scenario.withoutMemory.frustrationScore}
              </span>
            </div>

            {/* Repetitive Questions Box */}
            <div className="mt-5 p-3.5 rounded-2xl bg-black/40 border border-rose-500/20 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Repetitive Questions Asked:
              </span>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {scenario.withoutMemory.repetitiveQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-rose-200/80">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Response Output */}
            <div className="mt-5 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Generic Response:</span>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed font-sans min-h-[140px]">
                {isSimulating ? (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    <span>Generating generic questionnaire...</span>
                  </div>
                ) : (
                  <p>{scenario.withoutMemory.aiResponse}</p>
                )}
              </div>
            </div>
          </div>

          {/* Outcome pill */}
          <div className="mt-6 pt-4 border-t border-rose-500/20 text-xs">
            <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">Customer Impact:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {scenario.withoutMemory.outcome}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: WITH HINDSIGHT (Persistent Vector AI) */}
        <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#14122b]/90 via-[#101426]/80 to-[#0c1020]/90 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white shadow-neon-blue">
                  <Brain className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    WITH HINDSIGHT
                  </h3>
                  <p className="text-[10px] font-mono text-purple-300">
                    Persistent Memory • Sub-15ms Recall • Zero Repetition
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Delight: {scenario.withHindsight.frustrationScore}
              </span>
            </div>

            {/* Recalled Memories Box */}
            <div className="mt-5 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Hindsight Memory Automatically Recalled:
              </span>
              <div className="space-y-1.5">
                {scenario.withHindsight.recalledMemories.map((m, i) => (
                  <div key={i} className="p-2 rounded-xl bg-black/40 border border-purple-500/10 text-[11px]">
                    <span className="font-mono text-[10px] text-purple-300 font-bold block">{m.id} • {m.title}</span>
                    <span className="text-slate-300">{m.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Personalized Response Output */}
            <div className="mt-5 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Personalized Pinpoint Solution:</span>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121c33] to-[#161a36] border border-brand-500/30 text-xs text-slate-100 leading-relaxed font-sans min-h-[140px] space-y-2">
                {isSimulating ? (
                  <div className="flex items-center gap-2 text-purple-300">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-spin" />
                    <span>Recalling persistent memory from Hindsight in 14.8ms...</span>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-line">{scenario.withHindsight.aiResponse}</p>
                    {scenario.withHindsight.codeSnippet && (
                      <div className="p-2.5 rounded-xl bg-[#090c14] border border-white/10 font-mono text-[10px] text-cyan-300 overflow-x-auto">
                        <pre>{scenario.withHindsight.codeSnippet}</pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Outcome pill */}
          <div className="mt-6 pt-4 border-t border-purple-500/20 text-xs">
            <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Customer Impact:</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {scenario.withHindsight.outcome}
            </p>
          </div>
        </div>

      </div>

      {/* Quantitative Improvement Bar */}
      <div className="p-6 rounded-3xl border border-white/10 bg-dark-card/60 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Benchmark Efficiency Metrics
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-slate-400 text-[11px] block">Time to Resolution</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="line-through text-rose-400">{scenario.metrics.timeToResolution.without}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-lg font-bold font-mono text-emerald-400">{scenario.metrics.timeToResolution.with}</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 mt-1 block">
              ⚡ {scenario.metrics.timeToResolution.improvement}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-slate-400 text-[11px] block">Repetitive Onboarding Questions</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="line-through text-rose-400">{scenario.metrics.questionsAsked.without}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-lg font-bold font-mono text-emerald-400">{scenario.metrics.questionsAsked.with}</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 mt-1 block">
              ⚡ {scenario.metrics.questionsAsked.improvement}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-slate-400 text-[11px] block">Customer Sentiment</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="line-through text-rose-400">{scenario.metrics.developerEffort.without}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-lg font-bold font-mono text-emerald-400">{scenario.metrics.developerEffort.with}</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 mt-1 block">
              ⚡ Compounding retention
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
