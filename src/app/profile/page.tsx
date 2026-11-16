'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Trophy,
  Award,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { sounds } from '@/lib/utils';

// Helper component for section headers
function SectionHeader({ icon: Icon, title }) {
  return (
    <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
      <Icon className="w-4 h-4" /> {title}
    </h3>
  );
}

export default function ProfilePage() {
  // Form handling state
  const [form, setForm] = useState({ name: '', erpId: '' });
  const [submitted, setSubmitted] = useState(false);

  // Student profile state – populated after form submission
  const [student, setStudent] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return; // name required
    const newStudent = {
      name: form.name.trim(),
      erpId: form.erpId.trim() || null,
      xp: 0,
      level: 0,
      rank: 'Newcomer',
      badges: [],
      applications: [],
      gameStats: {
        chessWins: 0,
        chessGames: 0,
        ludoWins: 0,
        ludoGames: 0,
        sudokuSolves: 0,
        mathHighScore: 0,
      },
    };
    setStudent(newStudent);
    setSubmitted(true);
  };

  // Re‑calculate level whenever XP changes
  useEffect(() => {
    if (student) {
      const lvl = Math.floor(student.xp / 500);
      if (lvl !== student.level) {
        setStudent((prev) => ({ ...prev, level: lvl }));
      }
    }
  }, [student?.xp]);

  // ---- Render ----
  if (!submitted) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Create Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">
              Name (required)
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#ffc16b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="erpId">
              ERP ID (optional)
            </label>
            <input
              id="erpId"
              name="erpId"
              placeholder="e.g. 2023001234"
              value={form.erpId}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#ffc16b]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#ffc16b] text-black rounded hover:bg-[#ffd9a4] transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    );
  }

  // Once submitted, render the profile UI (similar to previous static version)
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Top Banner / Student ID Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-[#ffc16b]/30 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#ffc16b] to-purple-600 p-[2px] shadow-lg">
              <div className="w-full h-full bg-[#0d0813] rounded-2xl flex items-center justify-center text-3xl font-black text-[#ffc16b]">
                {student.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{student.name}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ffc16b]/20 text-[#ffc16b] border border-[#ffc16b]/30">
                  LEVEL {student.level}
                </span>
              </div>
              {student.erpId && (
                <p className="text-xs font-mono text-[#ffc16b]">ERP ID: {student.erpId}</p>
              )}
              <p className="text-xs text-gray-400">{student.rank}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-gray-400 block mb-0.5">HUB XP</span>
              <span className="text-xl font-bold text-[#ffc16b] flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#ffc16b]" /> {student.xp}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <span className="text-gray-400 block mb-0.5">STATUS</span>
              <span className="text-xs font-bold text-emerald-400">{student.rank}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Badges & Applications */}
        <div className="lg:col-span-8 space-y-6">
          {/* Badges */}
          {student.badges && student.badges.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
              <SectionHeader icon={Award} title="University Merit & Activity Badges" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {student.badges.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3 hover:border-[#ffc16b]/30 transition-all"
                  >
                    <div className="text-2xl">{b.icon}</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{b.name}</h4>
                      <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applications */}
          {student.applications && student.applications.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader icon={CheckCircle2} title="Active Volunteering Applications" />
                <Link
                  href="/recruitment"
                  onClick={() => sounds.playClick()}
                  className="text-xs text-[#ffc16b] hover:text-[#ffd9a4] font-mono flex items-center gap-1"
                >
                  <span>Browse More</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {student.applications.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{app.eventName}</h4>
                      <p className="text-xs font-mono text-[#ffc16b] mt-0.5">Role Applied: {app.role}</p>
                      <span className="text-[10px] text-gray-500 font-mono">Submitted on: {app.date}</span>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Game Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <SectionHeader icon={Gamepad2} title="Gaming Record & Stats" />
            <div className="space-y-3 text-xs font-mono">
              {/* Chess */}
              <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">♟ Chess AI Record:</span>
                <span className="text-[#ffc16b] font-bold">
                  {student.gameStats.chessWins} Wins / {student.gameStats.chessGames} Played
                </span>
              </div>
              {/* Ludo */}
              <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">🎲 Ludo Royale Victories:</span>
                <span className="text-purple-300 font-bold">{student.gameStats.ludoWins} 1st Places</span>
              </div>
              {/* Sudoku */}
              <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">🧩 Sudoku Matrices Solved:</span>
                <span className="text-emerald-300 font-bold">{student.gameStats.sudokuSolves} Completed</span>
              </div>
              {/* Math */}
              <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">✏️ Math High Score:</span>
                <span className="text-[#ffc16b] font-bold">{student.gameStats.mathHighScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
