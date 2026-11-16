'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Gamepad2, 
  Crown, 
  Grid3X3, 
  Dice6, 
  Calculator, 
  Users, 
  Bot, 
  Trophy, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { sounds } from '@/lib/utils';
import { Key } from 'lucide-react';

export default function GamesHubPage() {
  const games = [
    {
      id: 'chess',
      title: 'Grandmaster Chess',
      subtitle: 'FIDE Rules • Minimax AI • 2-Player PvP',
      description: 'Test your tactical brilliance in the classic mind game. Challenge the computer across 3 difficulty tiers or play local pass-and-play with legal move analysis.',
      href: '/games/chess',
      icon: Crown,
      category: 'Strategic Mind Game',
      players: '1 - 2 Players',
      difficulty: 'Novice to Master',
      badgeColor: 'text-[#ffc16b] bg-[#ffc16b]/10 border-[#ffc16b]/30',
      gradient: 'from-amber-950/20 via-slate-900 to-[#0d0813]',
      activeCount: 38,
      xpReward: '+150 XP / Win'
    },
    {
      id: 'ludo',
      title: 'Campus Ludo Royale',
      subtitle: 'Classic 4-House Track • Smart AI Bots • Knockout Captures',
      description: 'The beloved university classic! Roll the dice, break out from your yard, knock opposing tokens back to start, and sprint into the home safety triangle.',
      href: '/games/ludo',
      icon: Dice6,
      category: 'Multiplayer Board Game',
      players: '2 - 4 Players / Bots',
      difficulty: 'Casual & Tactical',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      gradient: 'from-purple-950/20 via-slate-900 to-[#0d0813]',
      activeCount: 64,
      xpReward: '+120 XP / Win'
    },
    {
      id: 'sudoku',
      title: 'Quantum Sudoku',
      subtitle: '9x9 Matrix • Notes Mode • Hints • 3 Difficulty Tiers',
      description: 'Sharp logical deduction workout. Fill the grid with digits 1 through 9 with pencil marks, instant error validation, and time attack challenges.',
      href: '/games/sudoku',
      icon: Grid3X3,
      category: 'Logic & Deduction',
      players: 'Solo Time Attack',
      difficulty: 'Easy / Medium / Hard',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      gradient: 'from-emerald-950/20 via-slate-900 to-[#0d0813]',
      activeCount: 22,
      xpReward: '+100 XP / Solve'
    },
    {
      id: 'maths',
      title: 'Speed Math Blitz',
      subtitle: '45-Second Sprint • Arithmetic Duels • Flame Multipliers',
      description: 'Fast-paced mental arithmetic against the clock or against our high-speed Quantum Bot. Hit rapid addition, multiplication, and mixed chains to stack combos.',
      href: '/games/maths',
      icon: Calculator,
      category: 'Speed Arithmetic',
      players: 'Solo vs AI / 2-Player',
      difficulty: 'All Skill Levels',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      gradient: 'from-amber-950/20 via-slate-900 to-[#0d0813]',
      activeCount: 47,
      xpReward: '+180 XP / High Streak'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-12 glass-panel-glow border border-[#ffc16b]/30">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc16b]/10 border border-[#ffc16b]/30 text-[#ffc16b] text-xs font-mono font-semibold">
            <Gamepad2 className="w-4 h-4" />
            DBUU MIND GAMES ARCADE • MULTIPLAYER & AI
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            CAMPUS MIND GAMES <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc16b] via-amber-400 to-purple-400">
              & STRATEGY BATTLES
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            All your favorite mind sports and classic parlor games engineered for smooth play on desktop and mobile. Challenge algorithmic AI levels or battle fellow students in real-time pass & play!
          </p>

          {/* Quick Stats Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#ffc16b]">
              <Users className="w-4 h-4 text-[#ffc16b]" />
              <span>Multiplayer & 2-Player Ready</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>AI Levels & Bots Enabled</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Instant Gameplay (No Install Required)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multiplayer Arena Banner */}
      <div className="w-full glass-panel rounded-2xl p-6 border border-[#ffc16b]/40 shadow-[0_0_30px_rgba(255,193,107,0.15)] mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#ffc16b]/15 text-[#ffc16b] border border-[#ffc16b]/30 shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide uppercase">Multiplayer Key Arena</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                NEW FEATURE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
              Host a match to generate your unique room key, then share it with any university peer. They simply paste the key in &quot;Join With Key&quot; to duel instantly in Ludo, Chess, Sudoku, or Speed Math!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <Link
            href="/games/ludo"
            onClick={() => sounds.playClick()}
            className="btn-cyber-primary px-5 py-2.5 text-xs font-bold w-full md:w-auto text-center"
          >
            Launch Ludo Room
          </Link>
          <Link
            href="/games/chess"
            onClick={() => sounds.playClick()}
            className="px-5 py-2.5 rounded-full border border-white/20 text-xs font-bold text-white hover:border-[#ffc16b] glass-panel w-full md:w-auto text-center transition-all"
          >
            Launch Chess Room
          </Link>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.id}
              className={`rounded-2xl border border-white/10 bg-gradient-to-b ${g.gradient} p-7 flex flex-col justify-between hover:border-[#ffc16b]/50 hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="space-y-4">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:border-[#ffc16b] transition-all">
                    <Icon className="w-6 h-6 text-[#ffc16b]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${g.badgeColor}`}>
                      {g.category}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#ffc16b] transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    {g.subtitle}
                  </p>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {g.description}
                </p>

                {/* Meta details */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span>{g.players}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300">{g.xpReward}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Computer AI & Local PvP
                </span>

                <Link
                  href={g.href}
                  onClick={() => sounds.playClick()}
                  className="btn-cyber-primary px-5 py-2 text-xs font-bold flex items-center gap-2"
                >
                  <span>LAUNCH GAME</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* University Hall of Champions */}
      <div className="glass-panel rounded-2xl p-8 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              University Hall of Champions
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Live standings across Chess, Sudoku, Ludo & Math Sprint.
            </p>
          </div>
          <span className="text-xs font-mono text-[#ffc16b] border border-[#ffc16b]/30 px-3 py-1 rounded-full bg-[#ffc16b]/10">
            Season 2026 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-amber-400 font-bold block">🥇 1st Place - Grandmaster Tier</span>
            <div className="text-white font-bold text-sm">Engineering Chapter</div>
            <div className="text-gray-400">School of Engineering & Computing</div>
            <div className="text-[#ffc16b] font-bold">1,450 Total Hub XP</div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-slate-300 font-bold block">🥈 2nd Place - Tactician Tier</span>
            <div className="text-white font-bold text-sm">Management League</div>
            <div className="text-gray-400">School of Management & Commerce</div>
            <div className="text-[#ffc16b] font-bold">1,210 Total Hub XP</div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-amber-600 font-bold block">🥉 3rd Place - Strategist Tier</span>
            <div className="text-white font-bold text-sm">Allied Sciences Guild</div>
            <div className="text-gray-400">School of Allied Sciences</div>
            <div className="text-[#ffc16b] font-bold">1,090 Total Hub XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
