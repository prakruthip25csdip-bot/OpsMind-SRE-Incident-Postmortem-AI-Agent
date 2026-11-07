import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Database, Cpu, Sparkles, ArrowDown, ArrowRight } from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    {
      number: '01',
      title: 'Customer Interaction',
      subtitle: 'Natural language input',
      description: 'The customer submits a support query via chat, webhook, or support ticket without needing to repeat their technical setup.',
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-neon-blue'
    },
    {
      number: '02',
      title: 'Hindsight Memory',
      subtitle: 'Vector Semantic Lookup',
      description: 'Hindsight instantly scans the customer’s persistent memory bank, retrieving preferences, past issues, and verified solutions in <15ms.',
      icon: Database,
      color: 'from-purple-500 to-violet-600',
      shadow: 'shadow-neon-purple'
    },
    {
      number: '03',
      title: 'AI Processing',
      subtitle: 'Groq LPU Inference',
      description: 'Groq Llama-3.3-70b synthesizes the live question with historical memory context, avoiding any generic or repetitive inquiry.',
      icon: Cpu,
      color: 'from-cyan-500 to-blue-600',
      shadow: 'shadow-neon-cyan'
    },
    {
      number: '04',
      title: 'Personalized Solution',
      subtitle: 'Continuous Evolution',
      description: 'Delivers a pinpoint, copy-pasteable resolution. Any new solution or feedback is automatically ingested back into Hindsight for the future.',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-neon-cyan'
    }
  ];

  return (
    <section id="workflow" className="py-24 relative overflow-hidden bg-[#070a12]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
            Intelligent Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            How MemoraDesk Learns with{' '}
            <span className="gradient-text-blue-purple">Hindsight</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Unlike stateless bots that forget everything the moment a chat closes, our persistent vector memory architecture continuously evolves with your customers.
          </p>
        </div>

        {/* Steps Grid with Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative flex flex-col p-6 rounded-2xl border transition-all duration-300 group hover:-translate-y-1.5 bg-[#101626]/80 dark:bg-[#101626]/80 light:bg-white border-white/10 dark:border-white/10 light:border-slate-200/80 shadow-xl"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold font-mono text-white/10 group-hover:text-brand-400/30 transition-colors">
                    {step.number}
                  </span>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} text-white ${step.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 group-hover:text-brand-300 transition-colors">
                  {step.title}
                </h3>
                <span className="text-xs font-mono text-purple-400 mt-0.5 mb-2 block">
                  {step.subtitle}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Animated connector arrow to next step */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/40 items-center justify-center text-brand-300 backdrop-blur-sm">
                    <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
