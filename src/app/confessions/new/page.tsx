'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function NewConfessionPage() {
  const router = useRouter();

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'crush' | 'campus-rant' | 'hostel' | 'exams' | 'confession' | 'appreciation'>('crush');
  const [authorAlias, setAuthorAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const generateRandomAlias = () => {
    const animals = ['Falcon', 'Raven', 'Wolf', 'Panther', 'Owl', 'Phantom', 'Cipher', 'Viper'];
    const places = ['Shivalik', 'Doon', 'Hostel Wing', 'Canteen', 'Lab 4', 'Library', 'Clock Tower'];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const place = places[Math.floor(Math.random() * places.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setAuthorAlias(`${place} ${animal} #${num}`);
    sounds.playClick();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 5) {
      setErrorMsg('Confession must be at least 5 characters long.');
      sounds.playError();
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          category,
          authorAlias: authorAlias.trim() || undefined
        })
      });

      const json = await res.json();
      if (json.success) {
        sounds.playSuccess();
        triggerConfetti();
        if (json.data && typeof window !== 'undefined') {
          try {
            const localList = JSON.parse(localStorage.getItem('dbuu_local_confessions') || '[]');
            localList.unshift(json.data);
            localStorage.setItem('dbuu_local_confessions', JSON.stringify(localList.slice(0, 50)));
          } catch (e) {}
        }
        router.refresh();
        router.push('/confessions');
      } else {
        setErrorMsg(json.error || 'Failed to submit confession');
        sounds.playError();
      }
    } catch {
      setErrorMsg('Submission error. Please retry.');
      sounds.playError();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/confessions"
        onClick={() => sounds.playClick()}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:text-purple-300 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        BACK TO CONFESSION WALL
      </Link>

      <div className="glass-panel-purple rounded-3xl p-6 sm:p-10 border border-purple-500/30 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold mb-3">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            ANONYMITY SHIELD ACTIVE • NO LOGIN IDENTITY RECORDED
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Drop an Anonymous Secret
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Speak your mind without holding back. Your identity is automatically stripped from all records before database storage.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category selection */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-2">Select Confession Category *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'crush', label: '💌 Secret Crush' },
                { id: 'hostel', label: '🌙 Hostel Diaries' },
                { id: 'campus-rant', label: '🔥 Campus Life' },
                { id: 'exams', label: '📚 Exam Chronicles' },
                { id: 'appreciation', label: '✨ Wholesome Praise' },
                { id: 'confession', label: '🤫 Deep Confession' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id as any);
                    sounds.playClick();
                  }}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    category === cat.id
                      ? 'bg-purple-600 text-white shadow-neon-purple font-bold'
                      : 'bg-surface-100 text-gray-300 hover:bg-surface-200 border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Phantom Alias */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-gray-400">
                Phantom Author Alias (Optional):
              </label>
              <button
                type="button"
                onClick={generateRandomAlias}
                className="text-[11px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Randomize Alias
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. Shivalik Falcon #42 (leave blank for random)"
              value={authorAlias}
              onChange={(e) => setAuthorAlias(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
            />
          </div>

          {/* Confession text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-gray-400">
                Write Your Confession *
              </label>
              <span className="text-[11px] font-mono text-gray-500">
                {content.length}/1000
              </span>
            </div>
            <textarea
              rows={5}
              maxLength={1000}
              required
              placeholder="Spill the tea, share your crush, or express your feelings anonymously..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-surface-100 rounded-xl border border-white/10 text-sm text-white focus:outline-none focus:border-purple-400 leading-relaxed"
            />
          </div>

          {/* Anonymity disclaimer */}
          <div className="p-4 rounded-xl bg-surface-100/60 border border-white/5 text-xs text-gray-400 space-y-1">
            <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Privacy Assurance
            </span>
            <p>
              Your name, email address, roll number, and IP are strictly discarded. Fellow students and moderators cannot track your identity.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Link
              href="/confessions"
              className="px-4 py-2.5 rounded-xl glass-panel text-xs font-bold text-gray-300 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-cyber-purple px-6 py-2.5 text-xs font-bold flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Broadcasting...' : 'Broadcast Anonymously'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
