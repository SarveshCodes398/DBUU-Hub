'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  EyeOff, 
  Sparkles, 
  MessageSquare, 
  Heart, 
  Coffee, 
  Smile, 
  Zap, 
  ShieldCheck, 
  PlusCircle, 
  Send, 
  Search, 
  Filter, 
  Lock,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Confession } from '@/lib/types';
import { initialConfessions } from '@/lib/data';
import { sounds, triggerConfetti } from '@/lib/utils';

export default function ConfessionsPage() {
  const [confessions, setConfessions] = useState<Confession[]>(initialConfessions);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [hasReacted, setHasReacted] = useState<Record<string, string[]>>({});

  // Inline Quick Post State
  const [inlineOpen, setInlineOpen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'crush' | 'campus-rant' | 'hostel' | 'exams' | 'confession' | 'appreciation'>('crush');
  const [newAlias, setNewAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [postSuccessMsg, setPostSuccessMsg] = useState('');

  const fetchConfessions = () => {
    fetch('/api/confessions', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Merge with any local submissions
          let merged = [...data.data];
          if (typeof window !== 'undefined') {
            try {
              const localList: Confession[] = JSON.parse(localStorage.getItem('dbuu_local_confessions') || '[]');
              localList.forEach(localItem => {
                if (!merged.some(m => m.id === localItem.id)) {
                  merged.unshift(localItem);
                }
              });
            } catch (e) {}
          }
          setConfessions(merged);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || newContent.trim().length < 5) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newContent.trim(),
          category: newCategory,
          authorAlias: newAlias.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        // Immediately add to top of feed
        setConfessions(prev => [data.data, ...prev.filter(item => item.id !== data.data.id)]);
        // Also save to localStorage
        if (typeof window !== 'undefined') {
          try {
            const localList = JSON.parse(localStorage.getItem('dbuu_local_confessions') || '[]');
            localList.unshift(data.data);
            localStorage.setItem('dbuu_local_confessions', JSON.stringify(localList.slice(0, 50)));
          } catch (e) {}
        }
        setNewContent('');
        setNewAlias('');
        setPostSuccessMsg('✨ Secret posted anonymously and added to the wall!');
        sounds.playSuccess();
        triggerConfetti();
        setTimeout(() => setPostSuccessMsg(''), 4000);
      }
    } catch {
      // fallback
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Whispers' },
    { id: 'crush', label: '💌 Secret Crushes' },
    { id: 'hostel', label: '🌙 Hostel Diaries' },
    { id: 'campus-rant', label: '🔥 Campus Life' },
    { id: 'exams', label: '📚 Exam Chronicles' },
    { id: 'appreciation', label: '✨ Wholesome & Praise' },
  ];

  const handleReaction = async (confessionId: string, type: 'love' | 'laugh' | 'shock' | 'support' | 'tea') => {
    // Optimistic UI update
    setConfessions(prev =>
      prev.map(c => {
        if (c.id === confessionId) {
          return {
            ...c,
            reactions: {
              ...c.reactions,
              [type]: c.reactions[type] + 1
            }
          };
        }
        return c;
      })
    );

    sounds.playClick();

    try {
      await fetch(`/api/confessions/${confessionId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
    } catch {}
  };

  const handlePostComment = async (confessionId: string) => {
    const text = commentInputs[confessionId]?.trim();
    if (!text) return;

    sounds.playMove();

    try {
      const res = await fetch(`/api/confessions/${confessionId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      });
      const data = await res.json();
      if (data.success) {
        setConfessions(prev =>
          prev.map(c => {
            if (c.id === confessionId) {
              return {
                ...c,
                comments: [...c.comments, data.data]
              };
            }
            return c;
          })
        );
        setCommentInputs({ ...commentInputs, [confessionId]: '' });
      }
    } catch {}
  };

  const filtered = confessions.filter(c => {
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchSearch = c.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Banner inspired by IIT Bombay E-Summit aesthetic */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-10 glass-panel-purple border border-purple-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              100% ENCRYPTED • ZERO IDENTITY LEAKS GUARANTEED
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              CAMPUS SHADOWS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400">
                ANONYMOUS CONFESSIONS
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Unfiltered campus thoughts, unspoken hostel secrets, cafeteria debates, and heartfelt crushes. Your identity is cryptographically masked; no name, email, or student ID is ever recorded or transmitted.
            </p>
          </div>

          <Link
            href="/confessions/new"
            onClick={() => sounds.playClick()}
            className="btn-cyber-purple px-6 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shrink-0 shadow-neon-purple hover:scale-105 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Drop Anonymous Secret</span>
          </Link>
        </div>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="mb-6 p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Ironclad Privacy:</strong> Inspect our network headers anytime. Author identity is entirely stripped before writing to database.
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-300 hidden sm:inline-block">
          ZERO TRACKING
        </span>
      </div>

      {/* Quick Anonymous Secret Composer — Appears directly on the wall */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl glass-panel-purple border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.12)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🤫</span>
            <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
              Post an Anonymous Whisper to the Wall
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Instant & Untracked
          </span>
        </div>

        {postSuccessMsg && (
          <div className="mb-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{postSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleInlineSubmit} className="space-y-3">
          <textarea
            rows={3}
            placeholder="What's your unspoken secret, hostel gossip, cafeteria rant, or crush confession? (Min 5 chars)"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-purple-400 resize-none transition-colors"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-gray-400 mr-1">Category:</span>
              {[
                { id: 'crush', label: '💌 Crush' },
                { id: 'campus-rant', label: '🔥 Campus' },
                { id: 'hostel', label: '🌙 Hostel' },
                { id: 'exams', label: '📚 Exams' },
                { id: 'confession', label: '🤫 Secret' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNewCategory(cat.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    newCategory === cat.id
                      ? 'bg-purple-600 text-white font-bold shadow-sm'
                      : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Alias (optional)"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                className="w-32 sm:w-36 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={submitting || newContent.trim().length < 5}
                className="btn-cyber-purple px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-neon-purple disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Posting...' : 'Post Whisper'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                sounds.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-neon-purple font-bold'
                  : 'glass-panel text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search whispers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-100 rounded-xl border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
          />
        </div>
      </div>

      {/* Confession Cards */}
      <div className="space-y-6">
        {filtered.map(c => (
          <div
            key={c.id}
            className="glass-panel rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-purple-500/30 transition-all duration-200 space-y-4"
          >
            {/* Header: Phantom alias & category */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500/30 to-pink-500/30 border border-purple-500/40 flex items-center justify-center text-purple-300 font-mono font-bold text-xs">
                  🎭
                </div>
                <div>
                  <span className="font-bold text-purple-300 block font-mono">
                    {c.authorAlias}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {c.createdAt} • DBUU Campus
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 uppercase">
                #{c.category}
              </span>
            </div>

            {/* Confession body */}
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans font-normal pt-1">
              "{c.content}"
            </p>

            {/* Reactions bar */}
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleReaction(c.id, 'love')}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-100 hover:bg-pink-950/40 border border-white/5 hover:border-pink-500/30 text-gray-300 hover:text-pink-400 flex items-center gap-1.5 transition-all text-xs"
                >
                  <span>❤️</span>
                  <span className="font-mono">{c.reactions.love}</span>
                </button>

                <button
                  onClick={() => handleReaction(c.id, 'laugh')}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-100 hover:bg-amber-950/40 border border-white/5 hover:border-amber-500/30 text-gray-300 hover:text-amber-400 flex items-center gap-1.5 transition-all text-xs"
                >
                  <span>😂</span>
                  <span className="font-mono">{c.reactions.laugh}</span>
                </button>

                <button
                  onClick={() => handleReaction(c.id, 'tea')}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-100 hover:bg-purple-950/40 border border-white/5 hover:border-purple-500/30 text-gray-300 hover:text-purple-400 flex items-center gap-1.5 transition-all text-xs"
                >
                  <span>☕</span>
                  <span className="font-mono">{c.reactions.tea} Spilled</span>
                </button>

                <button
                  onClick={() => handleReaction(c.id, 'support')}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-100 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-400 flex items-center gap-1.5 transition-all text-xs"
                >
                  <span>🫂</span>
                  <span className="font-mono">{c.reactions.support}</span>
                </button>
              </div>

              {/* Comment toggle button */}
              <button
                onClick={() => {
                  setActiveCommentBox(activeCommentBox === c.id ? null : c.id);
                  sounds.playClick();
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors font-mono"
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>{c.comments.length} Whispers</span>
              </button>
            </div>

            {/* Threaded Comments Drawer */}
            {activeCommentBox === c.id && (
              <div className="pt-3 mt-3 border-t border-white/5 space-y-3">
                <div className="space-y-2">
                  {c.comments.map(cmt => (
                    <div key={cmt.id} className="p-3 rounded-xl bg-surface-100/70 border border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between text-gray-400 font-mono text-[10px]">
                        <span className="text-purple-300 font-bold">{cmt.authorAlias}</span>
                        <span>{cmt.createdAt}</span>
                      </div>
                      <p className="text-gray-200">{cmt.content}</p>
                    </div>
                  ))}
                  {c.comments.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No whispers on this confession yet. Be the first!</p>
                  )}
                </div>

                {/* Comment input form */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Whisper anonymously..."
                    value={commentInputs[c.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [c.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handlePostComment(c.id);
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-surface-100 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={() => handlePostComment(c.id)}
                    className="btn-cyber-purple px-3.5 py-2 text-xs font-bold flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Whisper</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
