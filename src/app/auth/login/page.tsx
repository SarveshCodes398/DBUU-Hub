'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Success - redirect to home
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light font-['Cormorant_Garamond'] text-[#fff8e9]">
            Welcome Back to <span className="text-[#ffc16b]">DBUU Hub</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">Login with your student account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@dbuu.ac.in"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc16b]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc16b]/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cyber-primary py-3 text-sm font-bold uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-[#ffc16b] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
