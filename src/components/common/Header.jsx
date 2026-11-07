import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Check,
  Cpu,
  User,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  LogIn,
  Github
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import StatusIndicator from './StatusIndicator';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Header({ onMenuClick, onSearchClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Determine current page title based on pathname
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Dashboard Overview', subtitle: 'Real-time customer interaction and memory metrics' };
      case '/chat':
        return { title: 'AI Support Chat', subtitle: 'Persistent context-aware conversation powered by Hindsight' };
      case '/memory-explorer':
        return { title: 'Memory Explorer', subtitle: 'Interactive vector graph of customer knowledge nodes' };
      case '/comparison':
        return { title: 'Before & After Memory', subtitle: 'Side-by-side benchmark of zero-state vs Hindsight recall' };
      case '/customers':
        return { title: 'Customer Management', subtitle: 'Customer memory profiles, preferences and history' };
      case '/tickets':
        return { title: 'Support Tickets', subtitle: 'Active issues augmented by persistent memory solutions' };
      case '/analytics':
        return { title: 'Memory & Resolution Analytics', subtitle: 'Key performance indicators and recall accuracy' };
      case '/settings':
        return { title: 'Settings & Integrations', subtitle: 'Configure Hindsight, Groq LLM and FastAPI backend' };
      default:
        return { title: 'MemoraDesk', subtitle: 'AI Support Platform' };
    }
  };

  const { title, subtitle } = getPageTitle();

  const notifications = [
    { id: 1, text: 'Hindsight indexed 4 new memories from Ticket #TICK-1042', time: '5m ago', unread: true },
    { id: 2, text: 'Elena Rostova (NovaBank) compliance certificate verified', time: '1h ago', unread: true },
    { id: 3, text: 'Groq Llama-3.3-70b latency averaged 310ms across 120 chats', time: '3h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b backdrop-blur-xl transition-all duration-300 bg-[#080b12]/80 dark:bg-[#080b12]/80 light:bg-white/85 border-white/10 dark:border-white/10 light:border-slate-200">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-slate-400 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/5 lg:hidden focus:outline-none"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold truncate text-slate-100 dark:text-slate-100 light:text-slate-900">
              {title}
            </h1>
            <p className="hidden md:block text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Bar (Trigger for Command Palette) */}
          <button
            onClick={onSearchClick}
            className="hidden xl:flex items-center justify-between w-64 px-3 py-1.5 text-xs rounded-xl border bg-dark-card/60 dark:bg-dark-card/60 light:bg-slate-100 border-white/10 dark:border-white/10 light:border-slate-300 text-slate-400 hover:text-slate-200 hover:border-brand-500/40 transition-all cursor-pointer text-left"
            aria-label="Open Command Palette"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">Search memories, tickets...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 dark:bg-white/10 light:bg-slate-200 text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Status Indicator */}
          <StatusIndicator compact />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/prakruthip25csdip-bot/OpsMind-SRE-Incident-Postmortem-AI-Agent.git"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-300 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">GitHub</span>
          </a>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/10 dark:border-white/10 light:border-slate-200 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-[#080b12]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border p-3 shadow-2xl backdrop-blur-xl z-50 bg-[#121829] dark:bg-[#121829] light:bg-white border-white/10 dark:border-white/10 light:border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 dark:border-white/10 light:border-slate-200 text-xs font-semibold">
                  <span>Notifications</span>
                  <span className="text-[10px] text-brand-400">2 unread</span>
                </div>
                <div className="mt-2 space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-xl text-xs bg-white/5 dark:bg-white/5 light:bg-slate-50 hover:bg-white/10 transition-colors"
                    >
                      <p className="text-slate-200 dark:text-slate-200 light:text-slate-800">{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 hover:bg-white/5 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-brand-500/50"
                  />
                  <div className="hidden md:block text-left text-xs">
                    <span className="block font-semibold leading-tight text-slate-200 dark:text-slate-200 light:text-slate-800">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" /> {user.role}
                    </span>
                  </div>
                  <ChevronDown className="hidden md:block w-3.5 h-3.5 text-slate-400" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border p-3 shadow-2xl backdrop-blur-xl z-50 bg-[#121829] dark:bg-[#121829] light:bg-white border-white/10 dark:border-white/10 light:border-slate-200 text-xs">
                    <div className="pb-2.5 border-b border-white/10 dark:border-white/10 light:border-slate-200">
                      <p className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 font-bold">
                        {user.plan}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="px-2 py-1.5 rounded-lg text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-white/5">
                        Cluster: <span className="font-mono text-purple-400">{user.cluster || 'eu-central-1'}</span>
                      </div>
                      <Link
                        to="/settings"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-white/5 transition-colors"
                      >
                        <SettingsIcon className="w-3.5 h-3.5" />
                        <span>Account Settings</span>
                      </Link>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10 dark:border-white/10 light:border-slate-200">
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          logout();
                          addToast({
                            title: 'Signed Out',
                            message: 'You have been signed out of MemoraDesk.',
                            type: 'info'
                          });
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors font-medium text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-500/40 bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 text-xs font-semibold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
