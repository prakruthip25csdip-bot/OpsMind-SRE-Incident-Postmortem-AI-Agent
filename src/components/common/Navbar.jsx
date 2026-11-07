import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Sparkles, ArrowRight, Menu, X, Cpu, LogIn, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import StatusIndicator from './StatusIndicator';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080b12]/80 dark:bg-[#080b12]/80 light:bg-white/85 backdrop-blur-xl border-b border-white/10 dark:border-white/10 light:border-slate-200 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-memory-purple p-0.5 shadow-neon-blue group-hover:shadow-neon-purple transition-all duration-300">
              <div className="w-full h-full bg-[#0a0d14] dark:bg-[#0a0d14] light:bg-white rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                MemoraDesk
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Hindsight AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-600">
            <a href="#features" className="hover:text-brand-400 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-brand-400 transition-colors">How It Works</a>
            <a href="#demo-preview" className="hover:text-brand-400 transition-colors">Interactive Demo</a>
            <a href="#technology" className="hover:text-brand-400 transition-colors">Tech Stack</a>
            <Link to="/comparison" className="hover:text-brand-400 transition-colors flex items-center gap-1">
              <span>Before & After</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-purple-500/20 text-purple-300 rounded font-bold">New</span>
            </Link>
            <Link to="/login" className="hover:text-brand-400 transition-colors flex items-center gap-1 text-slate-300">
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <StatusIndicator compact />
            <ThemeToggle />

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            ) : (
              <Link
                to="/settings"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
                title={`Signed in as ${user.name}`}
              >
                <img src={user.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                <span className="font-semibold text-white">{user.name.split(' ')[0]}</span>
              </Link>
            )}

            <Link
              to="/dashboard"
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-neon-blue hover:shadow-neon-purple transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 pt-3 border-t border-white/10 dark:border-white/10 light:border-slate-200 flex flex-col gap-3 pb-4"
          >
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white py-1">Features</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white py-1">How It Works</a>
            <a href="#demo-preview" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white py-1">Interactive Demo</a>
            <a href="#technology" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white py-1">Tech Stack</a>
            <Link to="/comparison" onClick={() => setMobileMenuOpen(false)} className="text-purple-400 py-1">Before & After Comparison</Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-brand-300 py-1 flex items-center gap-1.5 font-semibold">
              <LogIn className="w-4 h-4" />
              <span>Sign In / Login</span>
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-500"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </header>
  );
}
