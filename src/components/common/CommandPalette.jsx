import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  Brain,
  SplitSquareVertical,
  Users,
  TicketCheck,
  BarChart3,
  Settings,
  Sparkles,
  Sun,
  Moon,
  RefreshCw,
  ArrowRight,
  User,
  X
} from 'lucide-react';
import { MOCK_CUSTOMERS } from '../../data/mockCustomers';
import { MOCK_MEMORIES } from '../../data/mockMemories';
import { useTheme } from '../../context/ThemeContext';
import { useApi } from '../../context/ApiContext';

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();
  const { toggleMode, checkBackendHealth } = useApi();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pages = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { name: 'AI Support Chat', path: '/chat', icon: MessageSquare, category: 'Navigation' },
    { name: 'Memory Explorer (Graph)', path: '/memory-explorer', icon: Brain, category: 'Navigation' },
    { name: 'Before & After Memory Comparison', path: '/comparison', icon: SplitSquareVertical, category: 'Navigation' },
    { name: 'Customers Directory', path: '/customers', icon: Users, category: 'Navigation' },
    { name: 'Support Tickets', path: '/tickets', icon: TicketCheck, category: 'Navigation' },
    { name: 'Resolution Analytics', path: '/analytics', icon: BarChart3, category: 'Navigation' },
    { name: 'Settings & Integrations', path: '/settings', icon: Settings, category: 'Navigation' },
  ];

  const actions = [
    {
      name: `Switch to ${isDark ? 'Light' : 'Dark'} Mode`,
      action: () => { toggleTheme(); onClose(); },
      icon: isDark ? Sun : Moon,
      category: 'Actions'
    },
    {
      name: 'Ping FastAPI Backend (:8000)',
      action: () => { checkBackendHealth(); onClose(); },
      icon: RefreshCw,
      category: 'Actions'
    },
    {
      name: 'Toggle Demo / Live API Mode',
      action: () => { toggleMode(); onClose(); },
      icon: Sparkles,
      category: 'Actions'
    }
  ];

  const q = query.toLowerCase();

  const filteredPages = pages.filter(p => p.name.toLowerCase().includes(q));
  const filteredCustomers = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
  );
  const filteredMemories = MOCK_MEMORIES.filter(m =>
    m.title.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 3);
  const filteredActions = actions.filter(a => a.name.toLowerCase().includes(q));

  const allItems = [
    ...filteredPages.map(p => ({ ...p, type: 'page' })),
    ...filteredCustomers.map(c => ({
      name: `${c.name} (${c.company})`,
      path: '/customers',
      icon: User,
      category: 'Customers',
      type: 'customer'
    })),
    ...filteredMemories.map(m => ({
      name: m.title,
      path: '/memory-explorer',
      icon: Brain,
      category: 'Memories',
      type: 'memory'
    })),
    ...filteredActions.map(a => ({ ...a, type: 'action' }))
  ];

  const handleSelect = (item) => {
    if (item.type === 'action') {
      item.action();
    } else {
      navigate(item.path);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#0f1424] shadow-2xl overflow-hidden z-10 text-slate-100"
        >
          {/* Search Input Bar */}
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <Search className="w-5 h-5 text-brand-400 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search pages, customers, persistent memories, or actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-400">
              ESC
            </span>
          </div>

          {/* Results list */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-1 text-xs">
            {allItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
                <p>No matching items found for "{query}"</p>
                <span className="text-[11px] text-slate-500 mt-1 block">Try "Chat", "Supabase", "Sarah", or "Settings"</span>
              </div>
            ) : (
              allItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className="w-full p-2.5 rounded-xl flex items-center justify-between text-left hover:bg-white/10 transition-colors group text-slate-300 hover:text-white"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-brand-600/30 text-brand-400 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold block truncate text-slate-200 group-hover:text-white">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 border-t border-white/5 bg-black/30 flex items-center justify-between text-[10px] text-slate-500">
            <span>MemoraDesk Global Command Palette</span>
            <div className="flex items-center gap-2">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">↵</kbd> to select</span>
              <span>•</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Ctrl+K</kbd> to toggle</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
