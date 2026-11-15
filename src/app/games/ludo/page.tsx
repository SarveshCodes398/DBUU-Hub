'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  RotateCcw, 
  Sparkles, 
  Bot, 
  Users, 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6, 
  Trophy, 
  ShieldAlert,
  Play
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';

type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

interface Token {
  id: number;
  color: PlayerColor;
  step: number; // -1 = in yard, 0..50 = track, 51..55 = home stretch, 56 = home
}

const COLOR_CONFIG: Record<PlayerColor, { name: string; hex: string; bg: string; border: string; glow: string }> = {
  red: { name: 'Red Squad', hex: '#EF4444', bg: 'bg-red-500', border: 'border-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' },
  green: { name: 'Green Legion', hex: '#10B981', bg: 'bg-emerald-500', border: 'border-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
  yellow: { name: 'Yellow Sun', hex: '#F59E0B', bg: 'bg-amber-500', border: 'border-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
  blue: { name: 'Blue Cyber', hex: '#3B82F6', bg: 'bg-blue-500', border: 'border-blue-500', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' },
};

const START_OFFSETS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

const SAFE_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

export default function LudoPage() {
  const [playerCount, setPlayerCount] = useState<2 | 4>(4);
  const [players, setPlayers] = useState<{ color: PlayerColor; isBot: boolean }[]>([
    { color: 'red', isBot: false },
    { color: 'green', isBot: true },
    { color: 'yellow', isBot: true },
    { color: 'blue', isBot: true },
  ]);

  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [diceValue, setDiceValue] = useState<number>(6);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('Red to roll the dice!');
  const [winner, setWinner] = useState<PlayerColor | null>(null);

  // 4 tokens per player
  const [tokens, setTokens] = useState<Token[]>([
    { id: 0, color: 'red', step: -1 },
    { id: 1, color: 'red', step: -1 },
    { id: 2, color: 'red', step: -1 },
    { id: 3, color: 'red', step: -1 },
    { id: 4, color: 'green', step: -1 },
    { id: 5, color: 'green', step: -1 },
    { id: 6, color: 'green', step: -1 },
    { id: 7, color: 'green', step: -1 },
    { id: 8, color: 'yellow', step: -1 },
    { id: 9, color: 'yellow', step: -1 },
    { id: 10, color: 'yellow', step: -1 },
    { id: 11, color: 'yellow', step: -1 },
    { id: 12, color: 'blue', step: -1 },
    { id: 13, color: 'blue', step: -1 },
    { id: 14, color: 'blue', step: -1 },
    { id: 15, color: 'blue', step: -1 },
  ]);

  const activeColor = players[currentTurnIdx].color;
  const isCurrentBot = players[currentTurnIdx].isBot;

  // Reset Game
  const resetGame = () => {
    setTokens(tokens.map(t => ({ ...t, step: -1 })));
    setCurrentTurnIdx(0);
    setDiceValue(6);
    setHasRolled(false);
    setIsRolling(false);
    setWinner(null);
    setStatusMessage('Game reset! Red rolls first.');
    sounds.playClick();
  };

  // Switch turn
  const nextTurn = useCallback((rolledSix: boolean = false) => {
    if (rolledSix) {
      setHasRolled(false);
      setStatusMessage(`${COLOR_CONFIG[players[currentTurnIdx].color].name} rolled a 6! Roll again.`);
      return;
    }
    const nextIdx = (currentTurnIdx + 1) % players.length;
    setCurrentTurnIdx(nextIdx);
    setHasRolled(false);
    setStatusMessage(`${COLOR_CONFIG[players[nextIdx].color].name}'s turn! Roll dice.`);
  }, [currentTurnIdx, players]);

  // Move a specific token
  const moveToken = useCallback((tokenId: number) => {
    const t = tokens.find(item => item.id === tokenId);
    if (!t || t.color !== activeColor || !hasRolled || winner) return;

    let newStep = t.step;

    if (t.step === -1) {
      if (diceValue === 6) {
        newStep = 0; // enter track
      } else {
        return; // cannot move out
      }
    } else {
      if (t.step + diceValue <= 56) {
        newStep = t.step + diceValue;
      } else {
        return; // need exact number to enter home
      }
    }

    sounds.playMove();

    // Check capture if on main track
    let capturedOpponent = false;
    let updatedTokens = tokens.map(token => {
      if (token.id === tokenId) {
        return { ...token, step: newStep };
      }
      return token;
    });

    if (newStep >= 0 && newStep <= 50) {
      const globalPos = (START_OFFSETS[activeColor] + newStep) % 52;
      const isSafe = SAFE_INDICES.includes(globalPos);

      if (!isSafe) {
        updatedTokens = updatedTokens.map(other => {
          if (other.color !== activeColor && other.step >= 0 && other.step <= 50) {
            const otherGlobalPos = (START_OFFSETS[other.color] + other.step) % 52;
            if (otherGlobalPos === globalPos) {
              capturedOpponent = true;
              return { ...other, step: -1 }; // Send back to yard
            }
          }
          return other;
        });
      }
    }

    setTokens(updatedTokens);

    // Check winner
    const currentTokens = updatedTokens.filter(x => x.color === activeColor);
    const hasWon = currentTokens.every(x => x.step === 56);

    if (hasWon) {
      setWinner(activeColor);
      setStatusMessage(`🎉 VICTORY! ${COLOR_CONFIG[activeColor].name} has won the Ludo Championship!`);
      sounds.playSuccess();
      triggerConfetti();
      return;
    }

    // If captured opponent or rolled 6, get another turn
    if (diceValue === 6 || capturedOpponent) {
      nextTurn(true);
    } else {
      nextTurn(false);
    }
  }, [tokens, activeColor, hasRolled, winner, diceValue, nextTurn]);

  // Roll Dice
  const rollDice = useCallback(() => {
    if (isRolling || hasRolled || winner) return;

    setIsRolling(true);
    sounds.playDice();

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 8) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalVal);
        setIsRolling(false);
        setHasRolled(true);

        // Check if player has any valid moves
        const playerTokens = tokens.filter(t => t.color === activeColor);
        const canMoveAny = playerTokens.some(t => {
          if (t.step === -1) return finalVal === 6;
          return t.step + finalVal <= 56;
        });

        if (!canMoveAny) {
          setStatusMessage(`No valid moves with ${finalVal}. Passing turn...`);
          setTimeout(() => {
            nextTurn(finalVal === 6);
          }, 800);
        } else {
          setStatusMessage(`${COLOR_CONFIG[activeColor].name} rolled ${finalVal}! Tap a token to advance.`);
        }
      }
    }, 60);
  }, [isRolling, hasRolled, winner, tokens, activeColor, nextTurn]);

  // Handle Bot Turn automatically
  useEffect(() => {
    if (isCurrentBot && !hasRolled && !isRolling && !winner) {
      const timer = setTimeout(() => {
        rollDice();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isCurrentBot, hasRolled, isRolling, winner, rollDice]);

  // Bot makes move after rolling
  useEffect(() => {
    if (isCurrentBot && hasRolled && !winner) {
      const timer = setTimeout(() => {
        const playerTokens = tokens.filter(t => t.color === activeColor);
        // Find best token to move
        // Priority 1: token that can capture
        // Priority 2: token that can enter track (from yard with 6)
        // Priority 3: token furthest advanced
        const movableTokens = playerTokens.filter(t => {
          if (t.step === -1) return diceValue === 6;
          return t.step + diceValue <= 56;
        });

        if (movableTokens.length > 0) {
          // Sort by step descending
          movableTokens.sort((a, b) => b.step - a.step);
          moveToken(movableTokens[0].id);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isCurrentBot, hasRolled, winner, tokens, activeColor, diceValue, moveToken]);

  const renderDiceIcon = () => {
    switch (diceValue) {
      case 1: return <Dice1 className="w-12 h-12 text-white" />;
      case 2: return <Dice2 className="w-12 h-12 text-white" />;
      case 3: return <Dice3 className="w-12 h-12 text-white" />;
      case 4: return <Dice4 className="w-12 h-12 text-white" />;
      case 5: return <Dice5 className="w-12 h-12 text-white" />;
      case 6: return <Dice6 className="w-12 h-12 text-cyan-400 animate-pulse" />;
      default: return <Dice6 className="w-12 h-12 text-white" />;
    }
  };

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
            <span className="text-purple-400">CAMPUS LUDO</span> ROYALE
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono">
              2-4 PLAYERS / BOTS
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Roll the dice, knock out opponent tokens into their yard, and guide your squad to the home square!
          </p>
        </div>

        <button
          onClick={resetGame}
          className="btn-cyber-purple px-4 py-2 text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Board
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Ludo Board Graphic & Tokens */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Main Board Container */}
          <div className="w-full max-w-[560px] aspect-square bg-[#0B0F1A] p-4 rounded-2xl border border-white/10 shadow-2xl relative flex flex-col justify-between">
            
            {/* Top Row: Red Yard & Green Yard */}
            <div className="flex justify-between items-center w-full">
              {/* Red Base Yard */}
              <div className="w-40 sm:w-48 aspect-square rounded-xl bg-red-950/40 border-2 border-red-500/40 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-400">Red Base</span>
                  <span className="text-[10px] text-gray-400 font-mono">Yard</span>
                </div>
                <div className="grid grid-cols-2 gap-2 place-items-center">
                  {tokens.filter(t => t.color === 'red' && t.step === -1).map(t => (
                    <button
                      key={t.id}
                      onClick={() => moveToken(t.id)}
                      disabled={activeColor !== 'red' || !hasRolled || diceValue !== 6}
                      className="w-10 h-10 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 disabled:opacity-40 transition-all font-mono font-bold text-white text-xs"
                    >
                      R{t.id + 1}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-red-300 text-center font-mono">Roll 6 to release</div>
              </div>

              {/* Center Track Indicator */}
              <div className="text-center font-mono text-[10px] text-gray-400">
                <span className="px-2 py-1 rounded bg-surface-100 border border-white/5">DBUU ARENA</span>
              </div>

              {/* Green Base Yard */}
              <div className="w-40 sm:w-48 aspect-square rounded-xl bg-emerald-950/40 border-2 border-emerald-500/40 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Green Base</span>
                  <span className="text-[10px] text-gray-400 font-mono">Bot</span>
                </div>
                <div className="grid grid-cols-2 gap-2 place-items-center">
                  {tokens.filter(t => t.color === 'green' && t.step === -1).map(t => (
                    <button
                      key={t.id}
                      onClick={() => moveToken(t.id)}
                      disabled={activeColor !== 'green' || !hasRolled || diceValue !== 6}
                      className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 disabled:opacity-40 transition-all font-mono font-bold text-white text-xs"
                    >
                      G{t.id - 3}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-emerald-300 text-center font-mono">Roll 6 to release</div>
              </div>
            </div>

            {/* Center Runway & Active Tokens Tracker */}
            <div className="my-4 p-4 rounded-xl glass-panel border border-cyan-500/20 w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-gray-400">Live Active Tokens on Track:</span>
                <span className="text-xs font-bold text-cyan-300">
                  {tokens.filter(t => t.step >= 0 && t.step < 56).length} Tokens Marching
                </span>
              </div>

              {/* List of active tokens */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tokens.filter(t => t.step >= 0).map(t => {
                  const cfg = COLOR_CONFIG[t.color];
                  const isEligible = activeColor === t.color && hasRolled && (t.step + diceValue <= 56);
                  return (
                    <button
                      key={t.id}
                      onClick={() => moveToken(t.id)}
                      disabled={!isEligible}
                      className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                        isEligible
                          ? `${cfg.border} bg-white/10 ring-2 ring-cyan-400 animate-pulse`
                          : 'border-white/5 bg-surface-100 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full ${cfg.bg}`}></span>
                        <span className="text-xs font-bold text-white uppercase">{t.color[0]}{t.id % 4 + 1}</span>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400">
                        {t.step === 56 ? '🏆 HOME' : `Step ${t.step}/56`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row: Blue Yard & Yellow Yard */}
            <div className="flex justify-between items-center w-full">
              {/* Blue Base Yard */}
              <div className="w-40 sm:w-48 aspect-square rounded-xl bg-blue-950/40 border-2 border-blue-500/40 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">Blue Base</span>
                  <span className="text-[10px] text-gray-400 font-mono">Yard</span>
                </div>
                <div className="grid grid-cols-2 gap-2 place-items-center">
                  {tokens.filter(t => t.color === 'blue' && t.step === -1).map(t => (
                    <button
                      key={t.id}
                      onClick={() => moveToken(t.id)}
                      disabled={activeColor !== 'blue' || !hasRolled || diceValue !== 6}
                      className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 disabled:opacity-40 transition-all font-mono font-bold text-white text-xs"
                    >
                      B{t.id - 11}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-blue-300 text-center font-mono">Roll 6 to release</div>
              </div>

              {/* Status announcement */}
              <div className="text-center font-mono text-xs text-cyan-400 font-bold px-2 py-1 max-w-[140px]">
                {statusMessage}
              </div>

              {/* Yellow Base Yard */}
              <div className="w-40 sm:w-48 aspect-square rounded-xl bg-amber-950/40 border-2 border-amber-500/40 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Yellow Base</span>
                  <span className="text-[10px] text-gray-400 font-mono">Yard</span>
                </div>
                <div className="grid grid-cols-2 gap-2 place-items-center">
                  {tokens.filter(t => t.color === 'yellow' && t.step === -1).map(t => (
                    <button
                      key={t.id}
                      onClick={() => moveToken(t.id)}
                      disabled={activeColor !== 'yellow' || !hasRolled || diceValue !== 6}
                      className="w-10 h-10 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 disabled:opacity-40 transition-all font-mono font-bold text-white text-xs"
                    >
                      Y{t.id - 7}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-amber-300 text-center font-mono">Roll 6 to release</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dice Roller & Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 3D Dice Display Box */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 flex flex-col items-center text-center">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
              ACTIVE TURN: {COLOR_CONFIG[activeColor].name}
            </span>
            
            <div className={`p-6 rounded-2xl bg-gradient-to-br from-surface-100 to-[#0A0D16] border-2 ${COLOR_CONFIG[activeColor].border} ${COLOR_CONFIG[activeColor].glow} my-4 transition-transform duration-200 ${isRolling ? 'rotate-12 scale-110' : ''}`}>
              {renderDiceIcon()}
            </div>

            <button
              onClick={rollDice}
              disabled={isRolling || hasRolled || isCurrentBot || Boolean(winner)}
              className="w-full btn-cyber-primary py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isRolling ? 'ROLLING DICE...' : hasRolled ? 'SELECT TOKEN TO MOVE' : 'ROLL DICE NOW'}
            </button>
            
            {isCurrentBot && (
              <span className="text-xs text-purple-400 font-mono mt-3 animate-pulse flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> Bot calculating tactical move...
              </span>
            )}
          </div>

          {/* Players Roster */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Player Roster</h3>
            <div className="space-y-2">
              {players.map((p, idx) => {
                const cfg = COLOR_CONFIG[p.color];
                const isTurn = currentTurnIdx === idx;
                const homeCount = tokens.filter(t => t.color === p.color && t.step === 56).length;
                return (
                  <div
                    key={p.color}
                    className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                      isTurn ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'border-white/5 bg-surface-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full ${cfg.bg}`}></span>
                      <span className="text-xs font-bold text-white">{cfg.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                        {p.isBot ? 'AI Bot' : 'Human'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {homeCount}/4 Finished
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rules info */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-gray-300 space-y-2">
            <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Ludo Championship Rules:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-400 leading-relaxed">
              <li>Roll a <strong>6</strong> to launch a piece from your base yard into the battle track.</li>
              <li>Landing on an opponent’s token captures it and kicks it back to their yard!</li>
              <li>Rolling a 6 grants an immediate extra roll!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
