'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Zap, PlusCircle, ExternalLink } from 'lucide-react';
import { sounds } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="w-full bg-[#08050c] border-t border-white/10 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#ffc16b] to-transparent opacity-40" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="wordmark text-xl">
              DBUU<span className="text-[#ffc16b]">.</span>HUB
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The unified student hub for Dev Bhoomi Uttarakhand University. Explore multiplayer mind games, event crew recruiting for DBUU Dance Ikon 2026, and anonymous student confessions.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Campus Services Active
            </div>
          </div>

          {/* Quick Hub Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffc16b] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Core Portals
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/games" onClick={() => sounds.playClick()} className="hover:text-white transition-colors">
                  Multiplayer & AI Games Arcade
                </Link>
              </li>
              <li>
                <Link href="/recruitment/apply/dance-ikon-2026-volunteers" onClick={() => sounds.playClick()} className="hover:text-white transition-colors">
                  DBUU Dance Ikon 2026 Volunteering
                </Link>
              </li>
              <li>
                <Link href="/confessions" onClick={() => sounds.playClick()} className="hover:text-white transition-colors">
                  Anonymous Confessions Wall
                </Link>
              </li>
              <li>
                <Link href="/events" onClick={() => sounds.playClick()} className="hover:text-white transition-colors">
                  College Events & Fests
                </Link>
              </li>
              <li>
                <Link href="/events/new" onClick={() => sounds.playClick()} className="hover:text-[#ffc16b] transition-colors font-semibold">
                  + Add College Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Games Direct Jumps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffc16b] mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Games Arcade
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/games/chess" onClick={() => sounds.playClick()} className="hover:text-white transition-colors">
                  Grandmaster Chess (AI & 2-Player)
                </Link>
              </li>
              <li>
                <Link href="/games/ludo" onClick={() => sounds.playClick()} className="hover:text-white transition-colors">
                  Campus Ludo Royale (Multiplayer)
                </Link>
              </li>
              <li>
                <Link href="/games/sudoku" onClick={() => sounds.playClick()} className="hover:text-white transition-colors">
                  Quantum Sudoku Matrix
                </Link>
              </li>
              <li>
                <Link href="/games/maths" onClick={() => sounds.playClick()} className="hover:text-white transition-colors">
                  Speed Math Blitz Duel
                </Link>
              </li>
              <li>
                <Link href="/vault" onClick={() => sounds.playClick()} className="hover:text-white transition-colors">
                  Academic Study Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* University Attribution & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Student Privacy Guarantee
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Confessions are 100% anonymous. Student names and personal identities are strictly hidden and never stored.
            </p>
            <a
              href="https://www.dbuu.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#ffc16b] hover:text-[#ffd9a4] border border-[#ffc16b]/30 px-3.5 py-1.5 rounded-full bg-[#ffc16b]/10 transition-all"
            >
              <span>Visit Official dbuu.ac.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Dev Bhoomi Uttarakhand University Hub.</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Open-Source Campus Nexus</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
