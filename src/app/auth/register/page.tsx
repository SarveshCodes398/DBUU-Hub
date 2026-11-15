'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  GraduationCap
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('School of Engineering & Computing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
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

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="glass-panel-glow rounded-3xl p-8 border border-purple-500/30 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-600 to-cyan-400 p-[1.5px] mx-auto shadow-neon-purple">
            <div className="w-full h-full bg-[#070A14] rounded-2xl flex items-center justify-center text-purple-400">
              <UserPlus className="w-6 h-6" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-white">
            STUDENT REGISTRATION
          </h1>
          <p className="text-xs text-gray-400">
            Create your unified DBUU Hub digital identity
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Aryan Vashistha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">University Roll Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. 23BCSE042"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">Department / School *</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
            >
              <option value="School of Engineering & Computing">School of Engineering & Computing</option>
              <option value="School of Management & Commerce">School of Management & Commerce</option>
              <option value="School of Pharmacy">School of Pharmacy</option>
              <option value="School of Allied Sciences">School of Allied Sciences</option>
              <option value="School of Architecture & Design">School of Architecture & Design</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">DBUU Email *</label>
            <input
              type="email"
              required
              placeholder="name@dbuu.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-cyber-purple py-2.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            {submitting ? 'Creating Identity...' : success ? 'Account Created ✓' : 'Create Student Account'}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 text-center text-xs text-gray-400">
          Already registered?{' '}
          <Link
            href="/auth/login"
            onClick={() => sounds.playClick()}
            className="text-purple-400 hover:text-purple-300 font-bold"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
