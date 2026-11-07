import React from 'react';
import { useApi } from '../../context/ApiContext';
import { Database, Zap, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StatusIndicator({ compact = false }) {
  const { backendStatus, mode, toggleMode, checkBackendHealth } = useApi();

  const isConnected = backendStatus === 'connected';

  if (compact) {
    return (
      <button
        onClick={toggleMode}
        title={`Backend: ${backendStatus} | Mode: ${mode.toUpperCase()} (Click to toggle)`}
        className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border bg-dark-card/60 dark:bg-dark-card/60 light:bg-slate-100 border-white/10 dark:border-white/10 light:border-slate-300 hover:border-brand-500/40 transition-all cursor-pointer"
      >
        <span className="relative flex h-2 w-2">
          {isConnected ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </>
          )}
        </span>
        <span className="hidden sm:inline text-slate-300 dark:text-slate-300 light:text-slate-700">
          {isConnected ? 'FastAPI Live' : 'Demo Simulation Mode'}
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-dark-card/40 dark:bg-dark-card/40 light:bg-slate-50 text-xs">
      {/* Backend Status Pill */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/20 dark:bg-black/20 light:bg-white border border-white/5 dark:border-white/5 light:border-slate-200">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
        <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">FastAPI:</span>
        <span className={`font-medium ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
          {isConnected ? 'Connected (:8000)' : 'Offline (Demo Data)'}
        </span>
        <button
          onClick={checkBackendHealth}
          className="ml-1 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"
          title="Retry connecting to http://localhost:8000"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Hindsight Status Pill */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/20 dark:bg-black/20 light:bg-white border border-white/5 dark:border-white/5 light:border-slate-200">
        <Database className="w-3 h-3 text-purple-400" />
        <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">Hindsight Memory:</span>
        <span className="text-purple-400 font-medium">Persistent Active</span>
      </div>

      {/* Groq Model Pill */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/20 dark:bg-black/20 light:bg-white border border-white/5 dark:border-white/5 light:border-slate-200">
        <Zap className="w-3 h-3 text-cyan-400" />
        <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">LLM:</span>
        <span className="text-cyan-400 font-mono font-medium">Groq Llama-3.3-70b</span>
      </div>
    </div>
  );
}
