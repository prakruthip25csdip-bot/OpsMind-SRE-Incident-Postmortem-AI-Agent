import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  History,
  UserCheck,
  Wrench,
  Sparkles,
  BarChart4,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturesGrid() {
  const features = [
    {
      title: 'Persistent AI Memory',
      description: 'Powered by Hindsight by Vectorize. Retains technical environment context, past conversations, preferences, and architectures across months.',
      icon: Brain,
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'Vectorize Powered',
      link: '/memory-explorer'
    },
    {
      title: 'Intelligent Customer Recall',
      description: 'Zero repetitive onboarding or configuration inquiries. The AI recognizes returning users instantly and restores their historical state in 14.8ms.',
      icon: History,
      gradient: 'from-purple-500 to-pink-600',
      badge: 'Zero Repetition',
      link: '/customers'
    },
    {
      title: 'Personalized Customer Support',
      description: 'Generates code snippets in the exact programming language, ORM, and cloud region each customer uses without them prompting it.',
      icon: UserCheck,
      gradient: 'from-cyan-500 to-teal-600',
      badge: 'Context-Aware',
      link: '/chat'
    },
    {
      title: 'Smart Troubleshooting',
      description: 'Correlates present bug reports with historically validated fixes and known edge cases, reducing Mean Time to Resolution (MTTR) by 68%.',
      icon: Wrench,
      gradient: 'from-amber-500 to-orange-600',
      badge: 'MTTR -68%',
      link: '/comparison'
    },
    {
      title: 'Continuous Learning',
      description: 'Every solved ticket and verified solution is automatically encoded into vector embeddings, making the collective AI smarter with every interaction.',
      icon: Sparkles,
      gradient: 'from-emerald-500 to-green-600',
      badge: 'Autonomous Ingestion',
      link: '/tickets'
    },
    {
      title: 'Memory Analytics & Observability',
      description: 'Inspect recall hit rate, semantic confidence, knowledge decay indices, and customer sentiment through interactive visual dashboards.',
      icon: BarChart4,
      gradient: 'from-rose-500 to-red-600',
      badge: 'Deep Metrics',
      link: '/analytics'
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Enterprise Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            Designed for Modern Customer Support That{' '}
            <span className="gradient-text-blue-purple">Never Forgets</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Standard customer support agents treat every session as day zero. MemoraDesk builds compounding customer intelligence with every turn.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-[#101626]/70 dark:bg-[#101626]/70 light:bg-white border-white/10 dark:border-white/10 light:border-slate-200 shadow-lg hover:shadow-2xl"
              >
                {/* Glow accent */}
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/10 to-purple-500/10 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 border border-white/10 dark:border-white/10 light:border-slate-200">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 group-hover:text-brand-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-5 pt-3 border-t border-white/5 dark:border-white/5 light:border-slate-100 flex items-center justify-between">
                  <Link
                    to={feature.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    <span>Explore Module</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
