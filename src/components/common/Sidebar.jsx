import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  TicketCheck,
  Brain,
  SplitSquareVertical,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  ExternalLink,
  LogOut,
  LogIn,
  ShieldCheck,
  Github
} from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { mode } = useApi();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Support Chat', to: '/chat', icon: MessageSquare, badge: 'Live AI' },
    { name: 'Memory Explorer', to: '/memory-explorer', icon: Brain, badge: 'Hindsight' },
    { name: 'Before & After', to: '/comparison', icon: SplitSquareVertical, badge: 'Demo' },
    { name: 'Customers', to: '/customers', icon: Users },
    { name: 'Support Tickets', to: '/tickets', icon: TicketCheck },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Settings', to: '/settings', icon: Settings },
    { name: 'Login & Personas', to: '/login', icon: LogIn, badge: 'Auth' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out border-r flex flex-col justify-between bg-[#0b0f19] dark:bg-[#0b0f19] light:bg-white border-white/10 dark:border-white/10 light:border-slate-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top brand header */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 dark:border-white/10 light:border-slate-200">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-memory-purple p-0.5 shadow-neon-blue">
                <div className="w-full h-full bg-[#0a0d14] dark:bg-[#0a0d14] light:bg-white rounded-[10px] flex items-center justify-center">
                  <Brain className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MemoraDesk
                </span>
                <span className="block text-[9px] text-slate-400 font-mono tracking-wider">
                  HINDSIGHT MEMORY
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Main Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600/20 to-purple-600/20 text-brand-300 dark:text-brand-300 light:text-brand-700 border border-brand-500/30 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 dark:text-slate-400 dark:hover:text-slate-100 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider ${
                          item.badge === 'Hindsight'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : item.badge === 'Live AI'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom card: Persistent Memory status & User Profile */}
        <div className="p-4 border-t border-white/10 dark:border-white/10 light:border-slate-200 space-y-3">
          <div className="p-3.5 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-slate-950/40 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                Hindsight Persistent Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              14,280 memories indexed. Recall: <strong className="text-emerald-400 font-mono">14.8ms</strong>.
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[10px]">
              <a
                href="https://github.com/prakruthip25csdip-bot/OpsMind-SRE-Incident-Postmortem-AI-Agent.git"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                title="OpsMind GitHub Repository"
              >
                <Github className="w-3 h-3 text-purple-400" />
                <span>GitHub Repo</span>
              </a>
              <a
                href="https://hindsight.vectorize.io"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
              >
                Docs <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* User Sign Out Row */}
          {isAuthenticated && user && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <img src={user.avatar} alt="" className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-200 block truncate leading-tight text-[11px]">
                    {user.name}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">
                    {user.role}
                  </span>
                </div>
              </div>
              <Link
                to="/login"
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
