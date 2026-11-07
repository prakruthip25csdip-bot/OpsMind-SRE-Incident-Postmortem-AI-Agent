import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Send,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '../../data/mockCustomers';
import { MOCK_MEMORIES } from '../../data/mockMemories';

export default function LiveDemoPreview() {
  const [selectedCustomerId, setSelectedCustomerId] = useState('cust_001');
  const [query, setQuery] = useState('Database pool timeout is happening again on Supabase...');
  const [isSearching, setIsSearching] = useState(false);
  const [retrievedMemories, setRetrievedMemories] = useState([MOCK_MEMORIES[1]]);
  const [response, setResponse] = useState({
    text: "Welcome back Sarah! I recalled your previous session on Oct 28 (Ticket #TICK-0988). You're using Node.js TypeScript with Prisma on Supabase in AWS us-east-1. The issue is likely caused by the pooler statement_timeout parameter. Here is the verified parameter update for your setup:",
    code: `DATABASE_URL="postgres://user:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=25&statement_timeout=15000&sslmode=require"`,
    confidence: '96%',
    latency: '14.8ms'
  });

  const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === selectedCustomerId) || MOCK_CUSTOMERS[0];

  const handleSimulate = (customer, sampleQuery, sampleMemories, answerText, codeSnippet) => {
    setSelectedCustomerId(customer.id);
    setQuery(sampleQuery);
    setIsSearching(true);
    setResponse(null);

    setTimeout(() => {
      setRetrievedMemories(sampleMemories);
      setTimeout(() => {
        setIsSearching(false);
        setResponse({
          text: answerText,
          code: codeSnippet,
          confidence: '95%',
          latency: '14.2ms'
        });
      }, 500);
    }, 600);
  };

  return (
    <section id="demo-preview" className="py-24 relative overflow-hidden bg-[#090d18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Interactive Testbed
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            Experience Persistent Memory <span className="gradient-text-cyan-emerald">In Action</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Click on different customer personas below to observe how Hindsight retrieves historical context and synthesizes zero-repetition answers in milliseconds.
          </p>
        </div>

        {/* Persona Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => handleSimulate(
              MOCK_CUSTOMERS[0],
              "Database pool timeout is happening again on Supabase...",
              [MOCK_MEMORIES[1]],
              "Welcome back Sarah! I recalled your previous session on Oct 28 (Ticket #TICK-0988). You're using Node.js TypeScript with Prisma on Supabase in AWS us-east-1. The issue is likely caused by the pooler statement_timeout parameter. Here is the verified parameter update for your setup:",
              `DATABASE_URL="postgres://user:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=25&statement_timeout=15000&sslmode=require"`
            )}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              selectedCustomerId === 'cust_001'
                ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-neon-blue'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <img src={MOCK_CUSTOMERS[0].avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
            <span>Sarah Chen (Prisma / Supabase)</span>
          </button>

          <button
            onClick={() => handleSimulate(
              MOCK_CUSTOMERS[1],
              "Stripe webhook signature is failing with 400 Bad Request in NestJS...",
              [MOCK_MEMORIES[2], MOCK_MEMORIES[3]],
              "Hey Alex! Remembering HyperCommerce's NestJS 10 stack on GCP europe-west1: this happens because body-parser parses the raw JSON buffer before HMAC verification. Here is the fix:",
              `const app = await NestFactory.create(AppModule, { rawBody: true });\n// In controller:\nconst event = this.stripe.constructEvent(req.rawBody, sig);`
            )}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              selectedCustomerId === 'cust_002'
                ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-neon-blue'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <img src={MOCK_CUSTOMERS[1].avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
            <span>Alex Rivera (NestJS / Stripe)</span>
          </button>

          <button
            onClick={() => handleSimulate(
              MOCK_CUSTOMERS[2],
              "Need verification of Frankfurt region encryption keys for tomorrow's audit.",
              [MOCK_MEMORIES[4]],
              "Good morning Elena! NovaBank's memory bank is pinned to Frankfurt (eu-central-1) sovereign cluster under GDPR Article 28. All 42 vector embeddings are encrypted at rest with your dedicated KMS key.",
              null
            )}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              selectedCustomerId === 'cust_003'
                ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-neon-blue'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <img src={MOCK_CUSTOMERS[2].avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
            <span>Elena Rostova (NovaBank / GDPR)</span>
          </button>
        </div>

        {/* Interactive Chat Console Window */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/15 bg-[#0f1422] shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top terminal bar */}
          <div className="px-5 py-3.5 border-b border-white/10 bg-[#0a0e19] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">
                memoradesk-agent-sandbox v1.0.0 — Customer: {selectedCustomer.name} ({selectedCustomer.company})
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-purple-400">
              <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Hindsight Connected</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* User message */}
            <div className="flex items-start gap-3">
              <img
                src={selectedCustomer.avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20 mt-1"
              />
              <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 max-w-xl text-xs text-slate-200">
                <p className="font-semibold text-brand-300 text-[11px] mb-1">{selectedCustomer.name}</p>
                <p>{query}</p>
              </div>
            </div>

            {/* Hindsight Memory Pipeline Indicator */}
            <AnimatePresence>
              {isSearching ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs flex items-center gap-3 text-purple-300"
                >
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                  <div>
                    <p className="font-semibold">Querying Hindsight vector memory store...</p>
                    <p className="text-[10px] text-purple-400/80">Scanning customer vector subspace for cosine similarity &gt; 0.85</p>
                  </div>
                </motion.div>
              ) : (
                <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-purple-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Persistent Memories Recalled ({retrievedMemories.length})
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">Latency: 14.8ms</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {retrievedMemories.map(mem => (
                      <div key={mem.id} className="p-2.5 rounded-xl bg-black/40 border border-purple-500/10 text-[11px]">
                        <span className="font-mono text-purple-400 text-[10px] block font-bold">{mem.id} • {mem.category.toUpperCase()}</span>
                        <p className="text-slate-300 mt-1 line-clamp-2">{mem.title}: {mem.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* AI Assistant Answer */}
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white mt-1 shadow-neon-blue flex-shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-gradient-to-br from-[#121b2d] to-[#151c33] border border-brand-500/30 text-xs text-slate-100 max-w-2xl space-y-3">
                  <div className="flex items-center justify-between text-[11px] border-b border-white/10 pb-2">
                    <span className="font-semibold text-brand-300">MemoraBot (Groq + Hindsight)</span>
                    <span className="font-mono text-[10px] text-emerald-400">Confidence: 96%</span>
                  </div>
                  <p className="leading-relaxed">{response.text}</p>
                  {response.code && (
                    <div className="p-3 rounded-xl bg-[#080b12] border border-white/10 font-mono text-[11px] text-brand-300 overflow-x-auto">
                      <pre>{response.code}</pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
