'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Gamepad2, 
  Users, 
  EyeOff, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Cpu, 
  ArrowRight, 
  Trophy, 
  ShieldCheck, 
  Flame, 
  Dice6, 
  Crown, 
  Calculator, 
  Grid3X3,
  ExternalLink,
  Zap,
  Activity,
  Heart,
  MessageSquare
} from 'lucide-react';
import { sounds } from '@/lib/utils';
import { initialConfessions, campusEvents } from '@/lib/data';

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION — IIT Bombay E-Summit style cyberpunk glass aesthetic */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-500/20 via-purple-600/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block"></span>
            DEV BHOOMI UTTARAKHAND UNIVERSITY • NEXUS 2026
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            THE ALL-IN-ONE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-glow-cyan">
              DIGITAL UNIVERSE
            </span> <br />
            OF DBUU
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Battle in multiplayer & AI mind games, recruit student volunteer crews for events like <strong className="text-pink-400">DBUU Dance Ikon 2026</strong>, whisper anonymous confessions with zero identity tracking, and access the campus study vault.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/games"
              onClick={() => sounds.playClick()}
              className="btn-cyber-primary px-7 py-3.5 text-sm font-bold flex items-center gap-2 group"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>PLAY CAMPUS GAMES</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/recruitment/apply/dance-ikon-2026-volunteers"
              onClick={() => sounds.playClick()}
              className="btn-cyber-purple px-7 py-3.5 text-sm font-bold flex items-center gap-2 group shadow-neon-purple"
            >
              <Users className="w-4 h-4" />
              <span>JOIN DANCE IKON 2026 CREW</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/confessions"
              onClick={() => sounds.playClick()}
              className="px-6 py-3.5 rounded-xl text-sm font-bold glass-panel hover:bg-white/10 text-gray-200 border border-white/10 flex items-center gap-2 transition-all"
            >
              <EyeOff className="w-4 h-4 text-purple-400" />
              <span>ANONYMOUS WALL</span>
            </Link>
          </div>

          {/* Live Telemetry / Interactive Counter Grid */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="glass-panel p-4 rounded-xl border border-cyan-500/20">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Student Community</span>
              <span className="text-2xl font-black text-white font-mono">5,000+</span>
              <span className="text-[11px] text-cyan-400 block font-mono">DBUU Enrolled</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-purple-500/20">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Mind Games Arcade</span>
              <span className="text-2xl font-black text-white font-mono">4 Modes</span>
              <span className="text-[11px] text-purple-400 block font-mono">AI Bots & Multiplayer</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-pink-500/20">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Dance Ikon 2026</span>
              <span className="text-2xl font-black text-pink-400 font-mono">42 Applied</span>
              <span className="text-[11px] text-pink-300 block font-mono">Volunteering Open</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Vercel Edge Ready</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">99.9%</span>
              <span className="text-[11px] text-emerald-300 block font-mono">High Concurrency</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SPOTLIGHT: DBUU DANCE IKON 2026 & RECRUITMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-pink-500/40 relative overflow-hidden bg-gradient-to-r from-pink-950/30 via-purple-950/30 to-slate-950">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-mono text-xs font-bold animate-pulse">
                  FLAGSHIP MEGA EVENT
                </span>
                <span className="text-xs font-mono text-pink-300">
                  Event Date: February 28, 2026
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                DBUU DANCE IKON 2026 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300">
                  VOLUNTEERING & ORGANIZING SQUAD
                </span>
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Uttarakhand's biggest university dance tournament is recruiting passionate students for <strong>Stage Operations, VIP Hospitality, Lighting & Sound Console, Security Escorts, and Live Media Reels</strong>. Receive official university leadership certificates, all-access VIP passes, and authorized duty leave!
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-mono pt-2">
                <span className="px-3 py-1 rounded-lg bg-surface-100 border border-white/10 text-cyan-300">
                  ✓ Official Duty Leave Approved
                </span>
                <span className="px-3 py-1 rounded-lg bg-surface-100 border border-white/10 text-emerald-300">
                  ✓ Verified Leadership Certificate
                </span>
                <span className="px-3 py-1 rounded-lg bg-surface-100 border border-white/10 text-pink-300">
                  ✓ Backstage Access with Celebrity Judges
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/recruitment/apply/dance-ikon-2026-volunteers"
                onClick={() => sounds.playClick()}
                className="btn-cyber-purple py-4 px-6 text-sm font-bold text-center shadow-neon-purple hover:scale-105 transition-all"
              >
                APPLY FOR DANCE IKON VOLUNTEER
              </Link>
              
              <Link
                href="/recruitment"
                onClick={() => sounds.playClick()}
                className="py-3 px-6 rounded-xl glass-panel text-center text-xs font-bold text-gray-300 hover:text-white border border-white/10"
              >
                View All Campus Recruitment Listings →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GAMES ARCADE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Gamepad2 className="w-4 h-4" />
              MIND SPORTS & MULTIPLAYER
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Campus Games Arcade
            </h2>
          </div>

          <Link
            href="/games"
            onClick={() => sounds.playClick()}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <span>EXPLORE ALL 4 GAMES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Chess */}
          <Link
            href="/games/chess"
            onClick={() => sounds.playClick()}
            className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-cyan-400 hover:shadow-neon-cyan transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Grandmaster Chess
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Minimax AI engine with 3 difficulty tiers & 2-player pass and play. Full legal move calculation.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">VS BOT / 2-PLAYER</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Ludo */}
          <Link
            href="/games/ludo"
            onClick={() => sounds.playClick()}
            className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-purple-400 hover:shadow-neon-purple transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Dice6 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                Campus Ludo Royale
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                2 to 4 players board game. Roll the 3D dice, capture opposing tokens, and sprint to the safety square.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold">2-4 PLAYERS / BOTS</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Sudoku */}
          <Link
            href="/games/sudoku"
            onClick={() => sounds.playClick()}
            className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Grid3X3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Quantum Sudoku
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Logic & deduction matrix with 3 difficulty modes, notes mode, hints, timer and mistake strikes.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">EASY / MED / HARD</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Speed Math */}
          <Link
            href="/games/maths"
            onClick={() => sounds.playClick()}
            className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Speed Math Blitz
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                45-second arithmetic speed duel vs Quantum AI. Stack flame combo streaks and climb the leaderboard.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">SOLO & AI DUEL</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ANONYMOUS CONFESSIONS LIVE WALL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-mono uppercase tracking-wider mb-1">
              <EyeOff className="w-4 h-4" />
              CRYPTOGRAPHIC PRIVACY GUARANTEED
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Anonymous Student Confessions
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/confessions/new"
              onClick={() => sounds.playClick()}
              className="btn-cyber-purple px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-neon-purple"
            >
              <span>POST ANONYMOUSLY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/confessions"
              onClick={() => sounds.playClick()}
              className="px-4 py-2 rounded-xl glass-panel text-xs font-bold text-gray-300 hover:text-white"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialConfessions.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="glass-panel-purple rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-purple-300">{c.authorAlias}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 uppercase">
                    #{c.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed italic">
                  "{c.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-pink-400">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    {c.reactions.love}
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {c.comments.length}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500">{c.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VERCEL LOAD & CONCURRENCY BENCHMARK BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-surface-100 via-[#070D1A] to-surface-100">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Cpu className="w-4 h-4" />
              INFRASTRUCTURE LOAD & LATENCY TESTING
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white">
              Vercel Concurrency & Traffic Stress Simulator
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Test how this website handles sudden flash-crowds of 100 to 500 simultaneous student requests when fest voting or auditions open.
            </p>
          </div>

          <Link
            href="/benchmark"
            onClick={() => sounds.playClick()}
            className="btn-cyber-primary px-6 py-3.5 text-xs font-bold flex items-center gap-2 shrink-0 shadow-neon-cyan"
          >
            <Activity className="w-4 h-4" />
            <span>RUN STRESS TEST NOW</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
