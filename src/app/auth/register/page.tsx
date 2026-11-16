'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [erpId, setErpId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!erpId.trim()) {
      setError('Student ERP ID / University Roll number is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          erpId: erpId.trim().toUpperCase(),
          email: email.trim(), 
          password 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Store in localStorage for instant client access in profile and games
      if (typeof window !== 'undefined' && data.user) {
        localStorage.setItem('dbuu_auth_user', JSON.stringify(data.user));
      }

      // Success - redirect to profile
      router.push('/profile');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light font-['Cormorant_Garamond'] text-[#fff8e9]">
            Join <span className="text-[#ffc16b]">DBUU Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Create your authenticated student account with University ERP ID
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Full Name <span className="text-[#ffc16b]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarvesh Mathur"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc16b]/50 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Student ERP ID / University Roll No <span className="text-[#ffc16b]">*</span>
            </label>
            <input
              type="text"
              required
              value={erpId}
              onChange={(e) => setErpId(e.target.value)}
              placeholder="e.g. 23BCSE042 or DBUU20239081"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc16b]/50 text-sm uppercase transition-colors"
            />
            <p className="text-[11px] text-gray-500 mt-1">Used to verify student profile and game achievements</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address <span className="text-[#ffc16b]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@dbuu.ac.in"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc16b]/50 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Password <span className="text-[#ffc16b]">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 4 chars)"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc16b]/50 text-sm transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cyber-primary py-3 text-xs sm:text-sm font-bold uppercase tracking-wider disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Student Registration'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs sm:text-sm text-gray-400">
          Already registered?{' '}
          <Link href="/auth/login" className="text-[#ffc16b] hover:underline font-bold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
