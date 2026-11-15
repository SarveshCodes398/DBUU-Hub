'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, ExternalLink, Sparkles, Server, Zap } from 'lucide-react';
import { sounds } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="w-full bg-[#05070C] border-t border-white/10 relative overflow-hidden mt-20">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-white text-lg">
                DBUU<span className="text-cyan-400">.</span>HUB
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                CAMPUS NEXUS
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The all-in-one open-source digital nerve center for Dev Bhoomi Uttarakhand University students. Built with Next.js, tailored for high-concurrency resilience on Vercel Edge.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Services Operational
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Core Portals
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/games" onClick={() => sounds.playClick()} className="hover:text-cyan-300 transition-colors">
                  Multiplayer & AI Games Arcade
                </Link>
              </li>
              <li>
                <Link href="/recruitment" onClick={() => sounds.playClick()} className="hover:text-cyan-300 transition-colors">
                  Dance Ikon 2026 & Volunteering
                </Link>
              </li>
              <li>
                <Link href="/confessions" onClick={() => sounds.playClick()} className="hover:text-cyan-300 transition-colors">
                  Encrypted Anonymous Confessions
                </Link>
              </li>
              <li>
                <Link href="/events" onClick={() => sounds.playClick()} className="hover:text-cyan-300 transition-colors">
                  University Events & Mega Fests
                </Link>
              </li>
              <li>
                <Link href="/vault" onClick={() => sounds.playClick()} className="hover:text-cyan-300 transition-colors">
                  Academic Vault (Notes & PYQs)
                </Link>
              </li>
            </ul>
          </div>

          {/* Games Direct Jumps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              Games Direct Access
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/games/chess" onClick={() => sounds.playClick()} className="hover:text-purple-300 transition-colors">
                  Grandmaster Chess (AI & 2-Player)
                </Link>
              </li>
              <li>
                <Link href="/games/ludo" onClick={() => sounds.playClick()} className="hover:text-purple-300 transition-colors">
                  Multiplayer Campus Ludo Royale
                </Link>
              </li>
              <li>
                <Link href="/games/sudoku" onClick={() => sounds.playClick()} className="hover:text-purple-300 transition-colors">
                  Quantum Sudoku Matrix
                </Link>
              </li>
              <li>
                <Link href="/games/maths" onClick={() => sounds.playClick()} className="hover:text-purple-300 transition-colors">
                  Math Blitz Arithmetic Duel
                </Link>
              </li>
              <li>
                <Link href="/benchmark" onClick={() => sounds.playClick()} className="hover:text-purple-300 transition-colors">
                  Vercel Load & Latency Benchmark
                </Link>
              </li>
            </ul>
          </div>

          {/* University Attribution & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
              Student Privacy Guarantee
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Confessions are cryptographically anonymous. Student names and emails are never tied to confession posts.
            </p>
            <a
              href="https://www.dbuu.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg bg-cyan-950/30 transition-all hover:bg-cyan-950/50"
            >
              <span>Visit Official dbuu.ac.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 DBUU Hub Nexus. Created for Dev Bhoomi Uttarakhand University students.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              Engineered with Next.js & MongoDB Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
