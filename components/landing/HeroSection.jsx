import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  Play
} from 'lucide-react';
import { fadeInUp, floatingAnimation } from '../../animations/variants';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Orbs & Glowing Mesh */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-brand-600/20 via-purple-600/20 to-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-60 left-10 w-72 h-72 bg-cyan-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-xs font-semibold text-purple-300 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Hack with Hyderabad 3.0 • Persistent Memory Innovation</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]"
            >
              Support That Remembers.{' '}
              <span className="block mt-1 bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                AI That Gets Smarter.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 dark:text-slate-300 light:text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Experience intelligent customer support powered by persistent AI memory. Every interaction becomes an opportunity to learn, remember and deliver better solutions using <strong className="text-white dark:text-white light:text-slate-900 font-semibold">Hindsight</strong> &amp; <strong className="text-white dark:text-white light:text-slate-900 font-semibold">Groq</strong>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-neon-blue hover:shadow-neon-purple transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#demo-preview"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold border backdrop-blur-md transition-all duration-300 bg-white/5 border-white/10 hover:bg-white/10 text-slate-200 hover:text-white dark:bg-white/5 dark:border-white/10 light:bg-white light:border-slate-300 light:text-slate-700 light:hover:bg-slate-50"
              >
                <Play className="w-4 h-4 text-brand-400 fill-brand-400" />
                <span>Explore Demo</span>
              </a>

              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <span>Sign In →</span>
              </Link>
            </motion.div>

            {/* Quick credibility bullet points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero repetitive questions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>14.8ms Hindsight recall</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>94.6% semantic accuracy</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Floating 3D AI Assistant & Memory Card Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Center glowing orb behind assistant */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-brand-500/30 to-purple-500/30 blur-2xl animate-pulse-slow pointer-events-none" />

            {/* Main Interactive Hologram Card */}
            <motion.div
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
              className="relative w-full max-w-md p-6 rounded-3xl border shadow-2xl backdrop-blur-2xl bg-gradient-to-b from-[#141c2e]/90 via-[#101726]/80 to-[#0a0f1d]/90 border-white/15 dark:border-white/15 light:border-slate-300 light:bg-white/95"
            >
              {/* Top card header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 light:border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-neon-blue">
                      <Brain className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#101726]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                      MemoraBot Agent
                    </h4>
                    <p className="text-[10px] text-purple-400 font-mono">
                      HINDSIGHT MEMORY SYNCHRONIZED
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  94.6% MATCH
                </span>
              </div>

              {/* Memory Recall Simulation Stream */}
              <div className="mt-4 space-y-3">
                {/* Incoming prompt preview */}
                <div className="p-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 text-xs">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Incoming Query (Sarah Chen)</p>
                  <p className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-medium mt-1">
                    "Database pool timeout is happening again on Supabase..."
                  </p>
                </div>

                {/* Hindsight Vector Search Indicator */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
                      Hindsight Vector Store Recall
                    </span>
                    <span className="font-mono text-emerald-400">14.8ms</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-purple-500/20 text-[11px] text-slate-300">
                    <strong className="text-purple-300 block font-mono text-[10px]">RECALLED MEMORY #mem_9013b:</strong>
                    "Customer uses Prisma with statement_timeout=15000 and sslmode=require. Stack: Node.js."
                  </div>
                </div>

                {/* AI Instant Personalized Answer */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-brand-950/50 to-indigo-950/40 border border-brand-500/30 text-xs">
                  <div className="flex items-center gap-1.5 text-brand-300 font-semibold mb-1">
                    <Zap className="w-3.5 h-3.5 text-brand-400" />
                    <span>Groq Llama-3.3-70b Response</span>
                  </div>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    "Welcome back Sarah! Applying your verified Prisma Supabase pool config with 25 connections..."
                  </p>
                </div>
              </div>

              {/* Bottom stats pill inside card */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-purple-400" /> 14,280 Total Memories
                </span>
                <span className="text-emerald-400 font-semibold">
                  Zero Repetition
                </span>
              </div>
            </motion.div>

            {/* Floating badge 1: Groq LPUs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 p-3 rounded-2xl border shadow-xl backdrop-blur-xl bg-dark-card/90 border-white/15 dark:bg-dark-card/90 light:bg-white text-xs flex items-center gap-2.5 hidden sm:flex"
            >
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">Groq Ultra-Fast LPUs</p>
                <p className="text-[10px] text-slate-400">Sub-second streaming</p>
              </div>
            </motion.div>

            {/* Floating badge 2: Persistent Vector Bank */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -top-4 -right-4 p-3 rounded-2xl border shadow-xl backdrop-blur-xl bg-dark-card/90 border-white/15 dark:bg-dark-card/90 light:bg-white text-xs flex items-center gap-2.5 hidden sm:flex"
            >
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">Vectorize Hindsight</p>
                <p className="text-[10px] text-purple-400">100% Persistent Memory</p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
