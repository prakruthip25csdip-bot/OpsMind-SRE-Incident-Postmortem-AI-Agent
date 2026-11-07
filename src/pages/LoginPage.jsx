import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database,
  Zap,
  Users,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ThemeToggle from '../components/common/ThemeToggle';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAs } = useAuth();
  const { addToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('alex.m@memoradesk.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [fullName, setFullName] = useState('Alex Morgan');
  const [company, setCompany] = useState('MemoraDesk Global');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email, password, rememberMe);
      setIsLoading(false);
      addToast({
        title: isRegister ? 'Account Created' : 'Welcome Back',
        message: `Authenticated as ${email}. Hindsight memory session active.`,
        type: 'success'
      });
      navigate('/dashboard');
    }, 600);
  };

  const handleQuickLogin = (personaKey, label) => {
    setIsLoading(true);
    setTimeout(() => {
      const user = loginAs(personaKey);
      setIsLoading(false);
      addToast({
        title: 'Logged in via Quick Persona',
        message: `Welcome, ${user.name} (${user.role})! Memory cluster synchronized.`,
        type: 'success'
      });
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070a12] text-slate-100 relative overflow-hidden">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-brand-600/15 via-purple-600/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-gradient-to-bl from-cyan-500/10 via-brand-600/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="p-6 flex items-center justify-between max-w-7xl w-full mx-auto relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-purple-600 p-0.5 shadow-neon-blue group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
              <Brain className="w-4 h-4 text-brand-400" />
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MemoraDesk
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase font-bold text-purple-400">
              HINDSIGHT AI
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/10 bg-[#0e1424]/80 shadow-2xl backdrop-blur-2xl overflow-hidden">
          
          {/* Left Column: Form & Persona Logins (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hack with Hyderabad 3.0 Platform Access</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {isRegister ? 'Create Your Account' : 'Welcome Back'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {isRegister
                  ? 'Get started with persistent AI memory support powered by Hindsight.'
                  : 'Sign in to access your persistent memory graph and support dashboard.'}
              </p>

              {/* Tab Selector: Sign In vs Register */}
              <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 mt-6 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    !isRegister
                      ? 'bg-brand-600 text-white shadow-neon-blue'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    isRegister
                      ? 'bg-brand-600 text-white shadow-neon-blue'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Login / Register Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
                {isRegister && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Full Name</label>
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border bg-black/40 border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Company Name</label>
                      <input
                        type="text"
                        placeholder="FinTech Labs"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border bg-black/40 border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-black/40 border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">Password</label>
                    {!isRegister && (
                      <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset simulation link sent to ' + email); }} className="text-brand-400 hover:text-brand-300 text-[11px]">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border bg-black/40 border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-brand-500 w-3.5 h-3.5 rounded"
                    />
                    <span>Remember my session on this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-neon-blue transition-all disabled:opacity-50"
                >
                  <span>{isLoading ? 'Authenticating...' : isRegister ? 'Create Account & Launch' : 'Sign In to MemoraDesk'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Persona Logins */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Instant 1-Click Demo Profiles (For Evaluators)
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('judge', 'Judge')}
                    className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-left transition-all flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold block truncate">Hackathon Judge</span>
                      <span className="text-[9px] text-amber-400/80 block truncate">VIP Evaluator Pass</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin', 'Lead Support')}
                    className="p-2.5 rounded-xl border border-brand-500/30 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 text-left transition-all flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold block truncate">Alex Morgan</span>
                      <span className="text-[9px] text-slate-400 block truncate">Support Lead</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('sarah', 'Sarah Chen')}
                    className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-left transition-all flex items-center gap-2"
                  >
                    <Database className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold block truncate">Sarah Chen</span>
                      <span className="text-[9px] text-slate-400 block truncate">Prisma & Supabase</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('elena', 'Elena Rostova')}
                    className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-left transition-all flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold block truncate">Elena Rostova</span>
                      <span className="text-[9px] text-slate-400 block truncate">NovaBank GDPR</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Holographic Illustration & Value Prop (5 cols) */}
          <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-[#12182c] via-[#101524] to-[#0a0d18] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between relative overflow-hidden">
            {/* Background Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-neon-blue">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Persistent Memory Architecture
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Every interaction is vectorized and stored in Hindsight’s episodic cluster. Customer preferences, tech configurations, and historical fixes persist across all support sessions.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { text: 'Sub-15ms vector retrieval via Hindsight', icon: Database, color: 'text-purple-400' },
                  { text: 'Sub-350ms streaming via Groq LPUs', icon: Zap, color: 'text-cyan-400' },
                  { text: 'Zero repetitive questions asked', icon: CheckCircle2, color: 'text-emerald-400' },
                  { text: 'GDPR BaFin banking compliance certified', icon: ShieldCheck, color: 'text-brand-400' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonial / quote box */}
            <div className="relative z-10 mt-8 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-300">
              <p className="italic leading-relaxed text-slate-200">
                "MemoraDesk remembered our exact PostgreSQL pooling flags from 3 weeks ago without repetitive questions. Game changer."
              </p>
              <div className="mt-3 flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div>
                  <span className="font-bold text-white text-[11px] block">Sarah Chen</span>
                  <span className="text-[10px] text-slate-400">Lead Cloud Architect, FinTech Labs</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 relative z-10">
        © 2026 MemoraDesk • Hack with Hyderabad 3.0 • Powered by Hindsight &amp; Groq
      </footer>

    </div>
  );
}
