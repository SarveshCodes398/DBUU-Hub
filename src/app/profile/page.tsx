'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  Trophy, 
  Award, 
  Gamepad2, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';
import { sounds } from '@/lib/utils';

export default function ProfilePage() {
  const [student, setStudent] = useState({
    name: 'Aryan Vashistha',
    rollNumber: '23BCSE042',
    email: 'demo@dbuu.ac.in',
    department: 'School of Engineering & Computing',
    program: 'B.Tech Computer Science & Engineering',
    semester: 'Semester 4',
    campusId: 'DBUU-2023-9081',
    xp: 1450,
    level: 4,
    rank: '#1 in Engineering Mind Games',
    badges: [
      { name: 'Chess Grandmaster', icon: '♟', desc: 'Defeated Level 3 AI in under 30 moves' },
      { name: 'Dance Ikon Volunteer', icon: '💃', desc: 'Applied for Core Event Execution 2026' },
      { name: 'Speed Math Scribe', icon: '⚡', desc: 'Maintained a 10x arithmetic combo streak' },
      { name: 'Verified DBUU Student', icon: '🛡️', desc: 'University Roll Number Authenticated' },
    ],
    gameStats: {
      chessWins: 14,
      chessGames: 18,
      ludoWins: 8,
      ludoGames: 12,
      sudokuSolves: 11,
      mathHighScore: 280
    },
    applications: [
      {
        eventName: 'DBUU Dance Ikon 2026',
        role: 'Sound, Lighting & Console Crew',
        date: '2026-02-11',
        status: 'Shortlisted for Interview'
      }
    ]
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner / Student ID Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-cyan-500/30 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 p-[2px] shadow-neon-cyan">
              <div className="w-full h-full bg-[#070A14] rounded-2xl flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-300 to-purple-400">
                AV
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {student.name}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LEVEL {student.level}
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400">
                Roll No: {student.rollNumber} • {student.campusId}
              </p>
              <p className="text-xs text-gray-400">
                {student.program} • {student.department}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-white/10 flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-gray-400 block mb-0.5">HUB XP</span>
              <span className="text-xl font-bold text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {student.xp}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <span className="text-gray-400 block mb-0.5">CAMPUS RANK</span>
              <span className="text-xs font-bold text-amber-400">
                {student.rank}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Badges & Applications */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Unlocked Badges */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              University Merit & Activity Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {student.badges.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-100 border border-white/5 flex items-start gap-3 hover:border-cyan-500/30 transition-all"
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

          {/* Event Applications Status */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Active Volunteering Applications
              </h3>
              <Link
                href="/recruitment"
                onClick={() => sounds.playClick()}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <span>Browse More</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {student.applications.map((app, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-100 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{app.eventName}</h4>
                    <p className="text-xs font-mono text-cyan-300 mt-0.5">
                      Role Applied: {app.role}
                    </p>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Submitted on: {app.date}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Games Win / Loss Matrix */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              Gaming Record & Stats
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-100 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">♟ Chess AI Record:</span>
                <span className="text-cyan-300 font-bold">
                  {student.gameStats.chessWins} Wins / {student.gameStats.chessGames} Played
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-100 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">🎲 Ludo Royale Victories:</span>
                <span className="text-purple-300 font-bold">
                  {student.gameStats.ludoWins} 1st Places
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-100 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">🧩 Sudoku Matrices Solved:</span>
                <span className="text-emerald-300 font-bold">
                  {student.gameStats.sudokuSolves} Completed
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-100 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">⚡ Speed Math High Score:</span>
                <span className="text-amber-400 font-bold">
                  {student.gameStats.mathHighScore} PTS
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/games"
                onClick={() => sounds.playClick()}
                className="w-full btn-cyber-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>ENTER ARCADE TO EARN XP</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick link to Vercel Benchmark */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 text-xs space-y-2">
            <span className="text-gray-400 font-mono block">Dev Diagnostic:</span>
            <Link
              href="/benchmark"
              onClick={() => sounds.playClick()}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5"
            >
              <span>Run Vercel Concurrency Benchmark</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
