'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  RotateCcw, 
  Bot, 
  Flame, 
  Timer, 
  Trophy, 
  Zap, 
  Award,
  Users,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';
import MultiplayerRoom from '@/components/MultiplayerRoom';

type Operation = '+' | '-' | '×' | '÷' | 'mixed';

interface Question {
  num1: number;
  num2: number;
  op: string;
  answer: number;
  options: number[];
}

export default function MathBlitzPage() {
  const [mode, setMode] = useState<'solo' | 'ai'>('ai');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [operation, setOperation] = useState<Operation>('mixed');
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  
  // Game state
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [aiStatus, setAiStatus] = useState<string>('Ready to calculate...');

  // Sync multiplayer duel scores
  const handleMultiplayerSync = useCallback((incoming: any) => {
    if (!incoming) return;
    if (typeof incoming.playerScore === 'number') {
      setAiScore(incoming.playerScore);
      setAiStatus(`Opponent is at ${incoming.playerScore} pts!`);
    }
  }, []);

  const currentMultiplayerState = {
    playerScore,
    streak,
    timeLeft
  };

  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate question
  const generateQuestion = useCallback((): Question => {
    let max = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100;
    let n1 = Math.floor(Math.random() * max) + 1;
    let n2 = Math.floor(Math.random() * max) + 1;

    let op = operation;
    if (op === 'mixed') {
      const ops = ['+', '-', '×', '÷'];
      op = ops[Math.floor(Math.random() * ops.length)] as Operation;
    }

    let answer = 0;
    if (op === '+') {
      answer = n1 + n2;
    } else if (op === '-') {
      // Ensure positive result for smooth blitz
      if (n1 < n2) [n1, n2] = [n2, n1];
      answer = n1 - n2;
    } else if (op === '×') {
      n1 = Math.floor(Math.random() * (difficulty === 'hard' ? 15 : 12)) + 2;
      n2 = Math.floor(Math.random() * (difficulty === 'hard' ? 15 : 12)) + 2;
      answer = n1 * n2;
    } else { // Division
      n2 = Math.floor(Math.random() * (difficulty === 'hard' ? 12 : 9)) + 2;
      answer = Math.floor(Math.random() * 12) + 1;
      n1 = n2 * answer;
      op = '÷';
    }

    // Generate 4 plausible options
    const optionsSet = new Set<number>([answer]);
    while (optionsSet.size < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 8) + 1);
      const fake = answer + delta;
      if (fake >= 0) optionsSet.add(fake);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return { num1: n1, num2: n2, op, answer, options };
  }, [difficulty, operation]);

  // Start new round
  const startGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    setStreak(0);
    setTimeLeft(45);
    setIsPlaying(true);
    setIsGameOver(false);
    setFeedback(null);
    sounds.playClick();
    const q = generateQuestion();
    setCurrentQ(q);
  };

  // Next question
  const nextRound = useCallback(() => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    const q = generateQuestion();
    setCurrentQ(q);
    setFeedback(null);

    // Schedule AI response if in AI mode
    if (mode === 'ai' && isPlaying) {
      setAiStatus('Calculating...');
      const delay = difficulty === 'easy' ? 3800 : difficulty === 'medium' ? 2400 : 1500;
      const jitter = Math.random() * 800;

      aiTimerRef.current = setTimeout(() => {
        // AI might make a mistake on easy
        const accuracy = difficulty === 'easy' ? 0.7 : difficulty === 'medium' ? 0.88 : 0.98;
        const willBeCorrect = Math.random() < accuracy;

        if (willBeCorrect) {
          setAiScore(s => s + 10);
          setAiStatus(`Bot solved it in ${(delay / 1000).toFixed(1)}s!`);
        } else {
          setAiStatus('Bot miscalculated!');
        }
      }, delay + jitter);
    }
  }, [generateQuestion, mode, isPlaying, difficulty]);

  // Answer handler
  const handleAnswer = (chosen: number) => {
    if (!currentQ || !isPlaying || isGameOver) return;

    if (chosen === currentQ.answer) {
      sounds.playMove();
      setFeedback('correct');
      const streakBonus = Math.min(streak * 2, 20);
      setPlayerScore(s => s + 10 + streakBonus);
      setStreak(st => {
        const nextSt = st + 1;
        if (nextSt > highestStreak) setHighestStreak(nextSt);
        if (nextSt === 5 || nextSt === 10) triggerConfetti();
        return nextSt;
      });
      setTimeout(() => {
        nextRound();
      }, 300);
    } else {
      sounds.playError();
      setFeedback('wrong');
      setStreak(0);
      setPlayerScore(s => Math.max(0, s - 5));
      setTimeout(() => {
        nextRound();
      }, 500);
    }
  };

  // Timer Countdown
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          setIsPlaying(false);
          sounds.playSuccess();
          triggerConfetti();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/games"
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            BACK TO GAMES ARCADE
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span className="text-amber-400">SPEED MATH</span> BLITZ
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
              MENTAL SPRINT
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Solve rapid-fire equations, build flame streaks, and defeat the Quantum Bot!
          </p>
        </div>

        <button
          onClick={startGame}
          className="btn-cyber-primary px-4 py-2 text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {isPlaying ? 'Restart Blitz' : 'Start 45s Blitz'}
        </button>
      </div>

      {/* MULTIPLAYER ROOM ARENA */}
      <MultiplayerRoom
        game="maths"
        currentGameState={currentMultiplayerState}
        onRoomSync={handleMultiplayerSync}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Math Arena */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Top Scoreboard HUD */}
          <div className="w-full max-w-[560px] grid grid-cols-3 gap-2 px-4 py-3 bg-surface-100 rounded-t-2xl border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">TIME LEFT</span>
                <span className={`text-base font-bold font-mono ${timeLeft < 10 ? 'text-rose-400 animate-ping' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-amber-400">
              <Flame className={`w-5 h-5 ${streak > 2 ? 'text-amber-400 animate-bounce' : 'text-gray-500'}`} />
              <div className="text-center">
                <span className="text-[10px] text-gray-400 block font-mono">STREAK</span>
                <span className="text-base font-black font-mono">{streak}x</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 block font-mono">YOUR SCORE</span>
              <span className="text-base font-black text-cyan-300 font-mono">
                {playerScore} PTS
              </span>
            </div>
          </div>

          {/* Central Problem Display */}
          <div className="w-full max-w-[560px] bg-[#0A0E1A] p-8 border-x border-white/10 flex flex-col items-center justify-center min-h-[220px] relative">
            
            {!isPlaying && !isGameOver ? (
              <div className="text-center space-y-4 py-6">
                <Sparkles className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                <h3 className="text-xl font-bold text-white">Ready for the Mental Math Challenge?</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Click below to begin your 45-second arithmetic sprint. Answer as fast as possible to build streak multipliers!
                </p>
                <button
                  onClick={startGame}
                  className="btn-cyber-primary px-6 py-2.5 text-sm font-bold shadow-neon-cyan"
                >
                  PRESS TO START BLITZ
                </button>
              </div>
            ) : isGameOver ? (
              <div className="text-center space-y-3 py-4">
                <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                <h3 className="text-2xl font-black text-white">BLITZ COMPLETE!</h3>
                <p className="text-sm text-gray-300">
                  Final Score: <strong className="text-cyan-300">{playerScore} pts</strong> • Best Streak: <strong>{highestStreak}x</strong>
                </p>
                {mode === 'ai' && (
                  <div className="text-xs font-mono text-purple-300 py-1 px-3 rounded-full bg-purple-950/50 border border-purple-500/30 inline-block">
                    {playerScore > aiScore ? '🏆 You defeated Quantum AI!' : '🤖 Quantum AI took this round!'}
                  </div>
                )}
                <div className="pt-2">
                  <button onClick={startGame} className="btn-cyber-primary px-5 py-2 text-xs font-bold">
                    Play Again
                  </button>
                </div>
              </div>
            ) : currentQ ? (
              <div className="text-center space-y-3">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">CALCULATE RAPIDLY:</span>
                <div className="text-4xl sm:text-6xl font-black text-white font-mono tracking-wider flex items-center justify-center gap-4">
                  <span>{currentQ.num1}</span>
                  <span className="text-cyan-400">{currentQ.op}</span>
                  <span>{currentQ.num2}</span>
                  <span className="text-gray-500">= ?</span>
                </div>
                {feedback && (
                  <div className={`text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-1.5 ${
                    feedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {feedback === 'correct' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {feedback === 'correct' ? 'EXCELLENT! +10' : 'MISCALCULATED! -5'}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* 4 Multi-Choice Option Buttons */}
          <div className="w-full max-w-[560px] bg-surface-100 p-4 rounded-b-2xl border border-white/10 grid grid-cols-2 gap-3">
            {currentQ?.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={!isPlaying || isGameOver}
                onClick={() => handleAnswer(opt)}
                className="py-4 px-3 rounded-xl bg-[#0F1626] hover:bg-cyan-500/20 active:scale-95 border border-white/10 hover:border-cyan-400 text-2xl font-bold font-mono text-white transition-all disabled:opacity-40 shadow-md"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* AI Rival Live Status Bar */}
          {mode === 'ai' && (
            <div className="w-full max-w-[560px] mt-4 px-4 py-3 rounded-xl glass-panel border-purple-500/30 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-purple-300 font-bold">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Quantum AI Score: {aiScore} PTS</span>
              </div>
              <span className="text-gray-400 text-[11px]">{aiStatus}</span>
            </div>
          )}
        </div>

        {/* Right Settings & Mode Picker */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mode Configuration */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Blitz Settings</h3>
            
            {/* Mode selection */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">Opponent Type:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMode('ai');
                    sounds.playClick();
                  }}
                  className={`p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    mode === 'ai' ? 'bg-purple-600 text-white shadow-neon-purple' : 'bg-surface-100 text-gray-300'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  Vs Quantum AI
                </button>
                <button
                  onClick={() => {
                    setMode('solo');
                    sounds.playClick();
                  }}
                  className={`p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    mode === 'solo' ? 'bg-cyan-500 text-black shadow-neon-cyan' : 'bg-surface-100 text-gray-300'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Solo Time Attack
                </button>
              </div>
            </div>

            {/* Difficulty selection */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">Difficulty Tier:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['easy', 'medium', 'hard'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => {
                      setDifficulty(d);
                      sounds.playClick();
                    }}
                    className={`py-1.5 rounded text-xs font-mono uppercase font-bold transition-all ${
                      difficulty === d ? 'bg-cyan-950 text-cyan-300 border border-cyan-400' : 'bg-surface-100 text-gray-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Arithmetic Operation */}
            <div>
              <label className="text-xs text-gray-400 block mb-2">Operation Type:</label>
              <div className="grid grid-cols-5 gap-1 text-xs font-bold font-mono">
                {(['+', '-', '×', '÷', 'mixed'] as const).map(op => (
                  <button
                    key={op}
                    onClick={() => {
                      setOperation(op);
                      sounds.playClick();
                    }}
                    className={`py-2 rounded transition-all ${
                      operation === op ? 'bg-amber-500 text-black shadow-md' : 'bg-surface-100 text-gray-300'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Math High Score Tracker */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              University Sprint Leaderboard
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-surface-100 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">#1 Engineering Guild</span>
                <span className="text-amber-400 font-bold">280 PTS</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-100 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">#2 Management Division</span>
                <span className="text-cyan-400 font-bold">240 PTS</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-100 flex items-center justify-between border border-white/5">
                <span className="text-gray-300">#3 Quantum AI</span>
                <span className="text-purple-400 font-bold">210 PTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
