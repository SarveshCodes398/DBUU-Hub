'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    sounds.playMove();

    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      sounds.playSuccess();
      triggerConfetti();
      setTimeout(() => {
        router.push('/profile');
      }, 700);
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setEmail('aryan.vashistha@dbuu.ac.in');
    setPassword('DBUU-Student-2026');
    setSubmitting(true);
    sounds.playMove();

    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      sounds.playSuccess();
      triggerConfetti();
      setTimeout(() => {
        router.push('/profile');
      }, 700);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      
      {/* Container */}
      <div className="glass-panel-glow rounded-3xl p-8 border border-cyan-500/30 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 p-[1.5px] mx-auto shadow-neon-cyan">
            <div className="w-full h-full bg-[#070A14] rounded-2xl flex items-center justify-center text-cyan-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-white">
            DBUU STUDENT ENTRY
          </h1>
          <p className="text-xs text-gray-400">
            Dev Bhoomi Uttarakhand University Unified Hub Nexus
          </p>
        </div>

        {/* Quick 1-Click Demo Login Banner */}
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Quick Student Demo Login
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
              Instant
            </span>
          </div>
          <p className="text-[11px] text-gray-300">
            Click below to instantly authenticate as a student without typing credentials.
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-neon-cyan"
          >
            <span>One-Click Student Entry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Normal Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">
              University Email / Roll Number
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="rollno@dbuu.ac.in or 23BCSE042"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-cyber-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            {submitting ? 'Authenticating...' : success ? 'Entry Granted ✓' : 'Authenticate & Enter'}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 text-center text-xs text-gray-400 space-y-2">
          <div>
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              onClick={() => sounds.playClick()}
              className="text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Register here
            </Link>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>MongoDB Encrypted Auth & JWT Token Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
