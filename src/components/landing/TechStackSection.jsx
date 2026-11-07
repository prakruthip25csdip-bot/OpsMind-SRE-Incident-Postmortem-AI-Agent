import React from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Code2, Server, ExternalLink, ArrowRight } from 'lucide-react';

export default function TechStackSection() {
  const technologies = [
    {
      name: 'Hindsight by Vectorize',
      role: 'Mandatory Persistent AI Memory',
      description: 'Provides long-term episodic and semantic memory storage for LLM agents. Enables lightning-fast similarity recall and dynamic memory ingestion.',
      icon: Database,
      gradient: 'from-purple-600 to-indigo-600',
      badge: 'Core Hackathon Tech',
      link: 'https://hindsight.vectorize.io',
      features: ['Episodic & Semantic Vectors', 'Sub-15ms Recall Latency', 'Automated Memory Decay & Consolidation']
    },
    {
      name: 'Groq LPUs',
      role: 'High-Performance Inference',
      description: 'Powers ultra-low-latency responses with Llama-3.3-70b-versatile, generating full context-injected solutions in under 350ms.',
      icon: Zap,
      gradient: 'from-cyan-500 to-blue-600',
      badge: 'Recommended LLM Gateway',
      link: 'https://groq.com',
      features: ['Llama-3.3-70b-versatile', '120+ tokens/sec throughput', 'Deterministic low-latency streaming']
    },
    {
      name: 'React 18 & Vite',
      role: 'Modern Reactive Frontend',
      description: 'Crafted with Tailwind CSS, Framer Motion, GSAP, and Lucide Icons for fluid 60fps micro-animations, glassmorphism, and responsive design.',
      icon: Code2,
      gradient: 'from-blue-500 to-sky-400',
      badge: 'Interactive UI/UX',
      link: 'https://react.dev',
      features: ['Framer Motion Animations', 'Recharts Visualizations', 'Dual Theme (Dark / Light)']
    },
    {
      name: 'FastAPI Backend',
      role: 'High-Throughput Async REST Engine',
      description: 'Lightweight asynchronous Python microservice routing requests between Groq, Hindsight memory nodes, and customer ticket stores.',
      icon: Server,
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'Clean Architecture',
      link: 'https://fastapi.tiangolo.com',
      features: ['Async ASGI Engine', 'OpenAPI Schema Specs', 'Modular Service Endpoints']
    }
  ];

  return (
    <section id="technology" className="py-24 relative overflow-hidden bg-[#070a13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Powered by Next-Gen Technologies
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            Built on Industry-Leading <span className="gradient-text-blue-purple">AI Infrastructure</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Engineered strictly in alignment with the Hack with Hyderabad 3.0 problem statement: AI Agents That Learn Using Hindsight.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between bg-[#0e1424]/80 dark:bg-[#0e1424]/80 light:bg-white border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tech.gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {tech.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 group-hover:text-brand-300 transition-colors">
                    {tech.name}
                  </h3>
                  <span className="text-xs font-mono text-purple-400 block mt-0.5 mb-2">
                    {tech.role}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tech.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                    {tech.features.map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10">
                  <a
                    href={tech.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    <span>Official Documentation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
