import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function StatCard({
  title,
  value,
  prefix = '',
  suffix = '',
  trend,
  isPositive = true,
  icon: Icon,
  gradient = 'from-blue-500 to-indigo-600',
  glowColor = 'rgba(59, 130, 246, 0.25)',
  description
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="relative p-5 rounded-2xl border transition-all duration-300 group overflow-hidden bg-dark-card/70 dark:bg-dark-card/70 light:bg-white border-white/10 dark:border-white/10 light:border-slate-200/80 shadow-lg hover:shadow-2xl"
      style={{
        boxShadow: `0 8px 30px -10px ${glowColor}`
      }}
    >
      {/* Background glow orb */}
      <div 
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
        style={{ background: glowColor.replace('0.25', '0.6') }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold mt-2 font-mono tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900">
            {typeof value === 'number' ? (
              <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
            ) : (
              <span>{prefix}{value}{suffix}</span>
            )}
          </h3>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md transform group-hover:rotate-6 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs relative z-10">
        {trend && (
          <div className={`flex items-center gap-1 font-semibold ${isPositive ? 'text-emerald-400 dark:text-emerald-400 light:text-emerald-600' : 'text-rose-400 dark:text-rose-400 light:text-rose-600'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{trend}</span>
            <span className="text-slate-500 font-normal">vs last month</span>
          </div>
        )}
        {description && (
          <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">{description}</span>
        )}
      </div>
    </motion.div>
  );
}
