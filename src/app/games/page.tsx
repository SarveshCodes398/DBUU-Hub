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
  Flame, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { sounds } from '@/lib/utils';

export default function GamesHubPage() {
  const games = [
    {
      id: 'chess',
      title: 'Grandmaster Chess',
      subtitle: 'FIDE Rules • Stockfish-Style Minimax AI • 2-Player PvP',
      description: 'Test your tactical brilliance in the ultimate mind game. Challenge the computer across 3 difficulty tiers or play local pass-and-play with legal move analysis.',
      href: '/games/chess',
      icon: Crown,
      category: 'Strategic Mind Game',
      players: '1 - 2 Players',
      difficulty: 'Novice to Grandmaster',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      gradient: 'from-cyan-900/30 via-slate-900 to-slate-950',
      activeCount: 38,
      xpReward: '+150 XP / Win'
    },
    {
      id: 'ludo',
      title: 'Campus Ludo Royale',
      subtitle: 'Classic 4-House Track • Smart AI Bots • Knockout Captures',
      description: 'The beloved university hostel classic! Roll the dice, break out from your yard, knock opposing tokens back to start, and sprint into the home safety triangle.',
      href: '/games/ludo',
      icon: Dice6,
      category: 'Multiplayer Board Game',
      players: '2 - 4 Players / Bots',
      difficulty: 'Casual & Competitive',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      gradient: 'from-purple-900/30 via-slate-900 to-slate-950',
      activeCount: 64,
      xpReward: '+120 XP / Win'
    },
    {
      id: 'sudoku',
      title: 'Quantum Sudoku',
      subtitle: '9x9 Matrix • Notes Mode • Hints • 3 Difficulty Tiers',
      description: 'Sharp logical deduction workout. Fill the grid with digits 1 through 9 with pencil marks, instant error validation, and time attack leaderboards.',
      href: '/games/sudoku',
      icon: Grid3X3,
      category: 'Logic & Deduction',
      players: 'Solo Time Attack',
      difficulty: 'Easy / Medium / Hard',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      gradient: 'from-emerald-900/30 via-slate-900 to-slate-950',
      activeCount: 22,
      xpReward: '+100 XP / Solve'
    },
    {
      id: 'maths',
      title: 'Speed Math Blitz',
      subtitle: '45-Second Sprint • Arithmetic Duels • Flame Multipliers',
      description: 'Fast-paced mental arithmetic against the clock or against our high-speed Quantum Cortex Bot. Hit rapid addition, multiplication, and mixed chains to stack combos.',
      href: '/games/maths',
      icon: Calculator,
      category: 'Speed Arithmetic',
      players: 'Solo vs AI / 2-Player',
      difficulty: 'All Skill Levels',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      gradient: 'from-amber-900/30 via-slate-900 to-slate-950',
      activeCount: 47,
      xpReward: '+180 XP / High Streak'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Banner inspired by IIT Bombay E-Summit aesthetic */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-12 glass-panel-glow border border-cyan-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
            <Gamepad2 className="w-4 h-4" />
            DBUU NEXUS ARCADE • MULTIPLAYER & AI
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            CAMPUS MIND GAMES <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              & STRATEGY BATTLES
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            All your favorite mind sports and classic parlor games engineered with modern web technologies. Play solo against algorithmic bots or battle your fellow hostelers in real time!
          </p>

          {/* Quick Stats Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-300">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>171 Students In-Game</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Minimax & Heuristic AI Online</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Daily XP & Leaderboard Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.id}
              className={`rounded-2xl border border-white/10 bg-gradient-to-b ${g.gradient} p-7 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-neon-cyan transition-all duration-300 group`}
            >
              <div className="space-y-4">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:border-cyan-400 transition-all">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${g.badgeColor}`}>
                      {g.category}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
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
                  {g.activeCount} Active Sessions
                </span>

                <Link
                  href={g.href}
                  onClick={() => sounds.playClick()}
                  className="btn-cyber-primary px-4 py-2 text-xs font-bold flex items-center gap-2 group-hover:shadow-neon-cyan"
                >
                  <span>LAUNCH GAME</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* University Leaderboard & XP Showcase */}
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
          <span className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg bg-cyan-950/40">
            Season 2026 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-surface-100 border border-white/5 space-y-2">
            <span className="text-amber-400 font-bold block">🥇 1st Place - Grandmaster</span>
            <div className="text-white font-bold text-sm">Aryan Vashistha</div>
            <div className="text-gray-400">School of Engineering (B.Tech CSE)</div>
            <div className="text-cyan-300 font-bold">1,450 Total Hub XP</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-white/5 space-y-2">
            <span className="text-slate-300 font-bold block">🥈 2nd Place - Tactician</span>
            <div className="text-white font-bold text-sm">Priya Negi</div>
            <div className="text-gray-400">School of Management & Commerce</div>
            <div className="text-cyan-300 font-bold">1,210 Total Hub XP</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-100 border border-white/5 space-y-2">
            <span className="text-amber-600 font-bold block">🥉 3rd Place - Strategist</span>
            <div className="text-white font-bold text-sm">Kabir Rawat</div>
            <div className="text-gray-400">School of Allied Sciences</div>
            <div className="text-cyan-300 font-bold">1,090 Total Hub XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
