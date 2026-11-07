import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl transition-all duration-300 border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
        isDark 
          ? 'bg-dark-card/80 border-white/10 text-amber-300 hover:border-amber-500/40 hover:bg-white/5' 
          : 'bg-white/80 border-slate-200 text-slate-700 hover:border-brand-500/40 hover:bg-slate-100 shadow-sm'
      } ${className}`}
      aria-label="Toggle theme mode"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600" />
        )}
      </motion.div>
    </button>
  );
}
