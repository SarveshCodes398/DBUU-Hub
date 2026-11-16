'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Trophy, 
  Award, 
  Gamepad2, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  User,
  ShieldCheck,
  LogOut,
  Swords,
  Dices,
  Flame
} from 'lucide-react';
import { sounds } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<{
    name: string;
    email: string;
    erpId: string;
    xp: number;
    level: number;
    rank: string;
    badges: { name: string; icon: string; desc: string }[];
    applications: { eventName: string; role: string; date: string; status: string }[];
    gameStats: {
      chessWins: number;
      chessGames: number;
      ludoWins: number;
      ludoGames: number;
      sudokuSolves: number;
      mathHighScore: number;
    };
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        // 1. Check API session first
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        let userData = null;
        if (res.ok && data.loggedIn && data.user) {
          userData = data.user;
        } else if (typeof window !== 'undefined') {
          // Fallback to local storage if offline or cookie expired
          const saved = localStorage.getItem('dbuu_auth_user');
          if (saved) {
            try {
              userData = JSON.parse(saved);
            } catch (e) {}
          }
        }

        if (userData) {
          // Load real gameplay stats saved from games
          let localGameStats = {
            chessWins: 0,
            chessGames: 0,
            ludoWins: 0,
            ludoGames: 0,
            sudokuSolves: 0,
            mathHighScore: 0
          };

          if (typeof window !== 'undefined') {
            const rawStats = localStorage.getItem('dbuu_game_stats');
            if (rawStats) {
              try {
                localGameStats = { ...localGameStats, ...JSON.parse(rawStats) };
              } catch (e) {}
            }
          }

          // Calculate real XP from gameplay: 100 XP per chess win, 150 per ludo win, 80 per sudoku, etc.
          const calculatedXp = 
            (localGameStats.chessWins * 100) + 
            (localGameStats.ludoWins * 150) + 
            (localGameStats.sudokuSolves * 80) + 
            Math.floor(localGameStats.mathHighScore / 2);

          const calculatedLevel = Math.floor(calculatedXp / 500);

          let rankTitle = 'Level 0 Recruit';
          if (calculatedLevel >= 5) rankTitle = 'Campus Grandmaster';
          else if (calculatedLevel >= 3) rankTitle = 'University Veteran';
          else if (calculatedLevel >= 1) rankTitle = 'Active Competitor';

          // Load badges earned
          const earnedBadges: { name: string; icon: string; desc: string }[] = [];
          if (localGameStats.chessWins > 0) {
            earnedBadges.push({ name: 'Tactical Checkmate', icon: '♟', desc: `Secured ${localGameStats.chessWins} victories on the board` });
          }
          if (localGameStats.ludoWins > 0) {
            earnedBadges.push({ name: 'Ludo Conqueror', icon: '🎲', desc: `Crowned winner in ${localGameStats.ludoWins} Ludo battles` });
          }
          if (localGameStats.sudokuSolves > 0) {
            earnedBadges.push({ name: 'Logic Solver', icon: '🧩', desc: `Completed ${localGameStats.sudokuSolves} Sudoku matrices` });
          }

          // Load applications (if submitted via recruitment portal)
          let applications: any[] = [];
          if (typeof window !== 'undefined') {
            const rawApps = localStorage.getItem('dbuu_volunteer_applications');
            if (rawApps) {
              try {
                applications = JSON.parse(rawApps);
              } catch (e) {}
            }
          }

          setStudent({
            name: userData.name || 'DBUU Student',
            email: userData.email || '',
            erpId: userData.erpId || 'Not provided',
            xp: calculatedXp,
            level: calculatedLevel,
            rank: rankTitle,
            badges: earnedBadges,
            applications: applications,
            gameStats: localGameStats
          });
        }
      } catch (err) {
        console.error('Failed to load student profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dbuu_auth_user');
    }
    sounds.playClick();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#ffc16b] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-gray-400">Loading student profile...</span>
        </div>
      </div>
    );
  }

  // If user is not logged in, prompt them directly to sign in with their ERP ID
  if (!student) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[#ffc16b]/10 border border-[#ffc16b]/30 flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-[#ffc16b]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            No Student Session Found
          </h2>
          <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
            Please log in with your University ERP ID to view your dynamic student dashboard, level, and gaming achievements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/login"
              onClick={() => sounds.playClick()}
              className="btn-cyber-primary w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider"
            >
              Sign In with ERP ID
            </Link>
            <Link
              href="/auth/register"
              onClick={() => sounds.playClick()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm font-bold transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasAnyGameStats = 
    student.gameStats.chessGames > 0 ||
    student.gameStats.ludoGames > 0 ||
    student.gameStats.sudokuSolves > 0 ||
    student.gameStats.mathHighScore > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Banner / Student ID Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-[#ffc16b]/30 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#ffc16b] to-purple-600 p-[2px] shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-[#0d0813] rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-[#ffc16b]">
                {student.name.slice(0, 2).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-extrabold text-white">
                  {student.name}
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#ffc16b]/20 text-[#ffc16b] border border-[#ffc16b]/30 font-bold">
                  LEVEL {student.level}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#ffc16b] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                ERP ID: <span className="font-bold text-white tracking-wider">{student.erpId}</span>
              </p>
              {student.email && (
                <p className="text-xs text-gray-400 font-mono">
                  {student.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-400 block mb-0.5 text-[10px]">TOTAL XP</span>
                <span className="text-lg sm:text-xl font-bold text-[#ffc16b] flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-[#ffc16b]" />
                  {student.xp}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div>
                <span className="text-gray-400 block mb-0.5 text-[10px]">CAMPUS RANK</span>
                <span className="text-xs font-bold text-emerald-400">
                  {student.rank}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Dynamic Sections (Badges & Applications ONLY if they exist) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Unlocked Badges (Only shown if student earned badges) */}
          {student.badges.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Unlocked Activity & Merit Badges ({student.badges.length})
              </h3>

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

          {/* Active Volunteering Applications (Only shown if student applied) */}
          {student.applications.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Your Active Volunteering Applications
                </h3>
                <Link
                  href="/recruitment"
                  onClick={() => sounds.playClick()}
                  className="text-xs text-[#ffc16b] hover:text-[#ffd9a4] font-mono flex items-center gap-1"
                >
                  <span>Browse Listings</span>
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
                      <p className="text-xs font-mono text-[#ffc16b] mt-0.5">
                        Role: {app.role}
                      </p>
                      <span className="text-[10px] text-gray-500 font-mono">
                        Submitted: {app.date}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Play & Action Cards */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ffc16b]" />
              Level Up Your Profile in the Games Arcade
            </h3>
            <p className="text-xs text-gray-400">
              Each match played advances your campus XP streak. Challenge algorithmic bots, play Pass-and-Play with friends, or host a room key multiplayer battle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/games/chess"
                onClick={() => sounds.playClick()}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl text-cyan-300">
                    ♟
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">Grandmaster Chess</h4>
                    <p className="text-[11px] text-gray-400">Earn +100 XP per checkmate</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </Link>

              <Link
                href="/games/ludo"
                onClick={() => sounds.playClick()}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl text-amber-300">
                    🎲
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">Campus Ludo Royale</h4>
                    <p className="text-[11px] text-gray-400">4-Player key battles & bot matches</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Game Stats Record */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#ffc16b]" />
              Live Gaming Record
            </h3>

            {hasAnyGameStats ? (
              <div className="space-y-3 text-xs font-mono">
                {student.gameStats.chessGames > 0 && (
                  <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                    <span className="text-gray-300">♟ Chess Wins:</span>
                    <span className="text-[#ffc16b] font-bold">
                      {student.gameStats.chessWins} / {student.gameStats.chessGames}
                    </span>
                  </div>
                )}

                {student.gameStats.ludoGames > 0 && (
                  <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                    <span className="text-gray-300">🎲 Ludo Victories:</span>
                    <span className="text-purple-300 font-bold">
                      {student.gameStats.ludoWins} / {student.gameStats.ludoGames}
                    </span>
                  </div>
                )}

                {student.gameStats.sudokuSolves > 0 && (
                  <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                    <span className="text-gray-300">🧩 Sudoku Solved:</span>
                    <span className="text-emerald-300 font-bold">
                      {student.gameStats.sudokuSolves} Completed
                    </span>
                  </div>
                )}

                {student.gameStats.mathHighScore > 0 && (
                  <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-white/5">
                    <span className="text-gray-300">⚡ Math Blitz High Score:</span>
                    <span className="text-[#ffc16b] font-bold">
                      {student.gameStats.mathHighScore} pts
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 px-3">
                <p className="text-xs text-gray-400 mb-3">No game matches logged yet.</p>
                <p className="text-[11px] text-gray-500">Play matches in Chess or Ludo to start building your university record from Level 0!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
