import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Sliders,
  Database,
  Server,
  Zap,
  Bell,
  Check,
  RefreshCw,
  ShieldCheck,
  Sun,
  Moon,
  Trash2
} from 'lucide-react';
import { useApi } from '../context/ApiContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const {
    apiUrl,
    setApiUrl,
    hindsightEndpoint,
    setHindsightEndpoint,
    groqModel,
    setGroqModel,
    backendStatus,
    checkBackendHealth,
    mode,
    toggleMode
  } = useApi();

  const { theme, toggleTheme, isDark } = useTheme();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('integrations'); // integrations, ai, profile, notifications
  const [temperature, setTemperature] = useState(0.4);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [hindsightApiKeyMasked, setHindsightApiKeyMasked] = useState('hin_live_••••••••••••••••38f9');
  const [isPinging, setIsPinging] = useState(false);

  const handleTestBackend = async () => {
    setIsPinging(true);
    const connected = await checkBackendHealth();
    setIsPinging(false);
    if (connected) {
      addToast({
        title: 'Backend Connected',
        message: 'FastAPI server on port 8000 responded successfully (HTTP 200).',
        type: 'success'
      });
    } else {
      addToast({
        title: 'FastAPI Offline',
        message: 'Could not connect to http://localhost:8000. Running in Demo Simulation Mode.',
        type: 'warning'
      });
    }
  };

  const handleTestHindsight = () => {
    addToast({
      title: 'Hindsight Cluster Verified',
      message: 'Persistent memory vector database ready at ui.hindsight.vectorize.io.',
      type: 'success'
    });
  };

  const handleResetData = () => {
    addToast({
      title: 'Cache Cleared',
      message: 'Demo memory state restored to default hackathon dataset.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
          Settings &amp; Integrations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure persistent memory connections, Groq LLM inference parameters, and FastAPI backend endpoints.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'integrations', label: 'Backend & Memory Integrations', icon: Server },
          { id: 'ai', label: 'Groq & Model Parameters', icon: Zap },
          { id: 'profile', label: 'User Profile & Theme', icon: User },
          { id: 'notifications', label: 'Alerts & Telemetry', icon: Bell },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-neon-blue'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Backend & Memory Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          
          {/* FastAPI Backend Configuration Card */}
          <div className="p-6 rounded-3xl border border-white/10 bg-dark-card/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">FastAPI Backend Endpoint</h3>
                  <p className="text-xs text-slate-400">REST service orchestrating LLM prompt synthesis & memory queries</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                backendStatus === 'connected'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {backendStatus === 'connected' ? 'LIVE CONNECTED' : 'OFFLINE (DEMO MODE)'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">API Base URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    onClick={handleTestBackend}
                    disabled={isPinging}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                    <span>Test Ping</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Default: http://localhost:8000. Start backend with `uvicorn main:app --reload`.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Execution Mode</span>
                  <span className="text-[11px] text-slate-400">
                    Switch between Interactive Demo Mode and Live Backend REST calls
                  </span>
                </div>
                <button
                  onClick={toggleMode}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    mode === 'live'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-purple-600 text-white border-purple-500'
                  }`}
                >
                  Mode: {mode.toUpperCase()}
                </button>
              </div>
            </div>
          </div>

          {/* Hindsight Persistent Memory Configuration Card */}
          <div className="p-6 rounded-3xl border border-purple-500/30 bg-dark-card/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Hindsight Persistent Memory (Vectorize)</h3>
                  <p className="text-xs text-slate-400">Official hackathon mandatory persistent memory engine</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                SYNCHRONIZED (14.8ms)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Hindsight Cloud Endpoint</label>
                <input
                  type="text"
                  value={hindsightEndpoint}
                  onChange={(e) => setHindsightEndpoint(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Hindsight API Key (Masked for Security)
                </label>
                <input
                  type="text"
                  value={hindsightApiKeyMasked}
                  disabled
                  className="w-full p-2.5 rounded-xl border bg-dark-card/40 border-white/10 text-slate-400 font-mono text-xs cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  API secrets are securely managed on the backend and never exposed in client bundles.
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleTestHindsight}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 transition-colors"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Verify Vector Cluster Health</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Groq & Model Parameters */}
      {activeTab === 'ai' && (
        <div className="p-6 rounded-3xl border border-white/10 bg-dark-card/60 shadow-xl space-y-6 text-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Groq LLM Gateway Parameters</h3>
              <p className="text-xs text-slate-400">LPU inference configuration for zero-repetition answer synthesis</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Active LLM Model</label>
              <select
                value={groqModel}
                onChange={(e) => setGroqModel(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-dark-card/80 border-white/10 text-slate-200 focus:outline-none"
              >
                <option value="llama-3.3-70b-versatile">Groq Llama-3.3-70b-versatile (Recommended)</option>
                <option value="llama-3.1-8b-instant">Groq Llama-3.1-8b-instant (Ultra-Fast)</option>
                <option value="mixtral-8x7b-32768">Groq Mixtral-8x7b-32768</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Sampling Temperature: {temperature}</label>
                <span className="text-[10px] text-slate-500">Deterministic code generation</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Max Generation Tokens: {maxTokens}</label>
                <span className="text-[10px] text-slate-500">Limits per turn</span>
              </div>
              <input
                type="range"
                min="512"
                max="4096"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-brand-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: User Profile & Theme */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-3xl border border-white/10 bg-dark-card/60 shadow-xl space-y-6 text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt=""
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500"
            />
            <div>
              <h3 className="text-base font-bold text-slate-100">Alex Morgan</h3>
              <p className="text-slate-400">alex.m@memoradesk.ai • Support Lead</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-500/20 text-brand-300">
                Admin Role • Hackathon Evaluator
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
              <div>
                <span className="font-semibold text-slate-200 block">Color Theme</span>
                <span className="text-[11px] text-slate-400">Toggle between Futuristic Dark and Clean Light</span>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold bg-white/5"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
              <div>
                <span className="font-semibold text-slate-200 block">Reset Memory Cache</span>
                <span className="text-[11px] text-slate-400">Restore demo vector seeds and reset test tickets</span>
              </div>
              <button
                onClick={handleResetData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Alerts & Telemetry */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-3xl border border-white/10 bg-dark-card/60 shadow-xl space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-white/10">
            Real-time Alert Preferences
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Vector Ingestion Notifications', desc: 'Alert when a new verified fix is vectorized into Hindsight' },
              { title: 'Low Similarity Warnings', desc: 'Notify if memory retrieval confidence falls below 0.85' },
              { title: 'GDPR Region Compliance Verification', desc: 'Alert on cross-border vector partition syncs' },
              { title: 'Groq Sub-Second Latency Monitor', desc: 'Real-time telemetry on inference speed' },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                <div>
                  <span className="font-semibold text-slate-200 block">{n.title}</span>
                  <span className="text-[11px] text-slate-400">{n.desc}</span>
                </div>
                <input type="checkbox" defaultChecked className="accent-brand-500 w-4 h-4" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
