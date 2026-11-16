'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Globe,
  Lock,
  Star,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';
import MultiplayerRoom, { MultiplayerSyncMeta } from '@/components/MultiplayerRoom';

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';
type LudoMode = 'bot' | 'pvp' | 'multiplayer';

export interface Token {
  id: number;
  color: PlayerColor;
  step: number; // -1 = Yard, 0..50 = Main Track, 51..55 = Home Stretch, 56 = Home
}

// 52-cell outer common path [row, col] on a 15x15 board
const TRACK_COORDINATES: [number, number][] = [
  [6, 1],  // 0: Red start
  [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7],
  [0, 8], [1, 8], // 13: Green start
  [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14],
  [8, 14], [8, 13], // 26: Yellow start
  [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7],
  [14, 6], [13, 6], // 39: Blue start
  [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0],
  [6, 0]
];

const COLOR_START_OFFSETS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

const HOME_STRETCH_COORDS: Record<PlayerColor, [number, number][]> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]]
};

// Exact percentage centers for the 4 circles inside each corner base (6x6 = 40% area)
// Top-Left (Red): 0..40%
// Top-Right (Green): 60..100%
// Bottom-Left (Blue): 0..40% X, 60..100% Y
// Bottom-Right (Yellow): 60..100% X, 60..100% Y
const YARD_PERCENT_COORDS: Record<PlayerColor, { x: number; y: number }[]> = {
  red: [
    { x: 13.5, y: 13.5 },
    { x: 26.5, y: 13.5 },
    { x: 13.5, y: 26.5 },
    { x: 26.5, y: 26.5 }
  ],
  green: [
    { x: 73.5, y: 13.5 },
    { x: 86.5, y: 13.5 },
    { x: 73.5, y: 26.5 },
    { x: 86.5, y: 26.5 }
  ],
  blue: [
    { x: 13.5, y: 73.5 },
    { x: 26.5, y: 73.5 },
    { x: 13.5, y: 86.5 },
    { x: 26.5, y: 86.5 }
  ],
  yellow: [
    { x: 73.5, y: 73.5 },
    { x: 86.5, y: 73.5 },
    { x: 73.5, y: 86.5 },
    { x: 86.5, y: 86.5 }
  ]
};

const COLOR_THEMES: Record<PlayerColor, {
  name: string;
  bgHex: string;
  borderHex: string;
  badge: string;
  emoji: string;
}> = {
  red: { name: 'Red Squad', bgHex: '#DC2626', borderHex: '#991B1B', badge: 'bg-red-500/20 text-red-300 border-red-500/40', emoji: '🔴' },
  green: { name: 'Green Legion', bgHex: '#16A34A', borderHex: '#166534', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', emoji: '🟢' },
  yellow: { name: 'Yellow Sun', bgHex: '#CA8A04', borderHex: '#854D0E', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', emoji: '🟡' },
  blue: { name: 'Blue Cyber', bgHex: '#0284C7', borderHex: '#075985', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40', emoji: '🔵' }
};

export default function LudoPage() {
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

  const [gameMode, setGameMode] = useState<LudoMode>('bot');
  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number>(6);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [activeMovingTokenId, setActiveMovingTokenId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Red to roll the dice!');
  const [winner, setWinner] = useState<PlayerColor | null>(null);

  // Online Multiplayer State
  const [myMultiplayerColor, setMyMultiplayerColor] = useState<PlayerColor>('red');
  const [isMultiplayerActive, setIsMultiplayerActive] = useState<boolean>(false);
  const [roomPlayers, setRoomPlayers] = useState<any[]>([]);

  const turnColors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
  const activeColor = turnColors[currentTurnIdx];

  // In Bot mode, Green, Yellow, Blue are bots
  const isCurrentBot = gameMode === 'bot' && activeColor !== 'red';

  // Check if it's the current local client's turn to act
  const isMyTurn = () => {
    if (gameMode === 'bot') {
      return activeColor === 'red';
    }
    if (gameMode === 'pvp') {
      return true; // Pass & Play hotseat: current turn's player moves on shared device
    }
    if (gameMode === 'multiplayer') {
      return activeColor === myMultiplayerColor;
    }
    return true;
  };

  // Convert logical step to exact board percent [xPct, yPct]
  const getTokenCoordsPct = (token: Token): { x: number; y: number } => {
    if (token.step === -1) {
      const yardIndex = token.id % 4;
      return YARD_PERCENT_COORDS[token.color][yardIndex];
    }
    if (token.step >= 0 && token.step <= 50) {
      const trackIdx = (COLOR_START_OFFSETS[token.color] + token.step) % 52;
      const [r, c] = TRACK_COORDINATES[trackIdx];
      return {
        x: ((c + 0.5) / 15) * 100,
        y: ((r + 0.5) / 15) * 100
      };
    }
    // Home stretch 51..56
    const stretchIdx = Math.min(token.step - 51, 5);
    const [r, c] = HOME_STRETCH_COORDS[token.color][stretchIdx];
    return {
      x: ((c + 0.5) / 15) * 100,
      y: ((r + 0.5) / 15) * 100
    };
  };

  // Reset match
  const initGame = useCallback(() => {
    setTokens([
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
    setCurrentTurnIdx(0);
    setDiceValue(6);
    setHasRolled(false);
    setIsRolling(false);
    setIsMoving(false);
    setActiveMovingTokenId(null);
    setWinner(null);
    setStatusMessage('Red to roll the dice!');
  }, []);

  // Advance turn
  const nextTurn = useCallback((extraRoll: boolean = false) => {
    if (extraRoll) {
      setHasRolled(false);
      setIsRolling(false);
      setStatusMessage(`${COLOR_THEMES[activeColor].name} rolled a 6 and gets another roll!`);
      return;
    }

    const nextIdx = (currentTurnIdx + 1) % 4;
    setCurrentTurnIdx(nextIdx);
    setHasRolled(false);
    setIsRolling(false);
    setStatusMessage(`${COLOR_THEMES[turnColors[nextIdx]].name}'s turn to roll!`);
  }, [currentTurnIdx, activeColor, turnColors]);

  // Synchronize state with multiplayer room
  const handleMultiplayerSync = useCallback((incoming: any, meta: MultiplayerSyncMeta) => {
    if (!incoming) return;

    setIsMultiplayerActive(true);
    setGameMode('multiplayer');
    setMyMultiplayerColor((meta.myColor as PlayerColor) || 'red');
    setRoomPlayers(meta.players || []);

    if (incoming.tokens && Array.isArray(incoming.tokens)) {
      setTokens(incoming.tokens);
    }
    if (typeof incoming.currentTurnIdx === 'number') {
      setCurrentTurnIdx(incoming.currentTurnIdx);
    }
    if (typeof incoming.diceValue === 'number') {
      setDiceValue(incoming.diceValue);
    }
    if (typeof incoming.hasRolled === 'boolean') {
      setHasRolled(incoming.hasRolled);
    }
    if (incoming.winner) {
      setWinner(incoming.winner);
    }
  }, []);

  const currentMultiplayerState = {
    tokens,
    currentTurnIdx,
    diceValue,
    hasRolled,
    winner,
  };

  // Roll Dice Action
  const rollDice = useCallback(() => {
    if (isRolling || hasRolled || isMoving || winner) return;

    // Check strict turn restriction
    if (gameMode === 'multiplayer' && activeColor !== myMultiplayerColor) {
      return;
    }

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

        // Check if any token can make a legal move
        const playerTokens = tokens.filter(t => t.color === activeColor);
        const canMoveAny = playerTokens.some(t => {
          if (t.step === -1) return finalVal === 6;
          return t.step >= 0 && t.step + finalVal <= 56;
        });

        if (!canMoveAny) {
          setStatusMessage(`No legal moves for ${COLOR_THEMES[activeColor].name}. Passing turn...`);
          setTimeout(() => {
            nextTurn(false);
          }, 1100);
        } else {
          setStatusMessage(`${COLOR_THEMES[activeColor].name} rolled a ${finalVal}! Click a piece to move.`);
        }
      }
    }, 60);
  }, [isRolling, hasRolled, isMoving, winner, gameMode, activeColor, myMultiplayerColor, tokens, nextTurn]);

  // Animated Token Move Handler
  const moveTokenAnimated = useCallback(async (tokenId: number) => {
    if (isMoving || !hasRolled || winner) return;

    // Strict turn check
    if (gameMode === 'multiplayer' && activeColor !== myMultiplayerColor) return;

    const token = tokens.find(t => t.id === tokenId);
    if (!token || token.color !== activeColor) return;

    // Move legality check
    if (token.step === -1) {
      if (diceValue !== 6) return;
    } else {
      if (token.step + diceValue > 56) return;
    }

    setIsMoving(true);
    setActiveMovingTokenId(tokenId);
    sounds.playMove();

    // 1. Release from yard to Step 0
    if (token.step === -1) {
      setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, step: 0 } : t));
      await new Promise(r => setTimeout(r, 200));

      setIsMoving(false);
      setActiveMovingTokenId(null);
      // Rolling 6 earns bonus roll
      nextTurn(true);
      return;
    }

    // 2. Step one by one along the path
    const startStep = token.step;
    const targetStep = startStep + diceValue;

    for (let current = startStep + 1; current <= targetStep; current++) {
      setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, step: current } : t));
      sounds.playClick();
      await new Promise(r => setTimeout(r, 140));
    }

    // 3. Check for captures or victory
    const finalStep = targetStep;
    let didCapture = false;

    // Capture logic on 52-cell track
    if (finalStep >= 0 && finalStep <= 50) {
      const myTrackIdx = (COLOR_START_OFFSETS[token.color] + finalStep) % 52;
      const isSafe = [0, 8, 13, 21, 26, 34, 39, 47].includes(myTrackIdx);

      if (!isSafe) {
        setTokens(prev => prev.map(other => {
          if (other.color !== token.color && other.step >= 0 && other.step <= 50) {
            const otherTrackIdx = (COLOR_START_OFFSETS[other.color] + other.step) % 52;
            if (otherTrackIdx === myTrackIdx) {
              didCapture = true;
              sounds.playError();
              return { ...other, step: -1 }; // Send back to yard
            }
          }
          return other;
        }));
      }
    }

    // Check if player won
    const currentTokens = tokens.map(t => t.id === tokenId ? { ...t, step: finalStep } : t);
    const myPieces = currentTokens.filter(t => t.color === activeColor);
    const allInHome = myPieces.every(t => t.step === 56);

    setIsMoving(false);
    setActiveMovingTokenId(null);

    if (allInHome) {
      setWinner(activeColor);
      setStatusMessage(`🏆 ${COLOR_THEMES[activeColor].name} WINS THE MATCH!`);
      sounds.playSuccess();
      triggerConfetti();

      // Record win in stats
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('dbuu_game_stats') || '{}';
        try {
          const stats = JSON.parse(raw);
          stats.ludoGames = (stats.ludoGames || 0) + 1;
          if (activeColor === 'red' || activeColor === myMultiplayerColor) {
            stats.ludoWins = (stats.ludoWins || 0) + 1;
          }
          localStorage.setItem('dbuu_game_stats', JSON.stringify(stats));
        } catch (e) {}
      }
      return;
    }

    // Bonus roll on 6 or capture
    if (diceValue === 6 || didCapture) {
      nextTurn(true);
    } else {
      nextTurn(false);
    }
  }, [isMoving, hasRolled, winner, gameMode, activeColor, myMultiplayerColor, tokens, diceValue, nextTurn]);

  // Bot Turn Automation (in Bot mode)
  useEffect(() => {
    if (gameMode !== 'bot' || !isCurrentBot || winner || isMoving) return;

    if (!hasRolled && !isRolling) {
      const timer = setTimeout(() => {
        rollDice();
      }, 700);
      return () => clearTimeout(timer);
    }

    if (hasRolled && !isMoving) {
      const timer = setTimeout(() => {
        const botTokens = tokens.filter(t => t.color === activeColor);
        // Find best move
        const movable = botTokens.filter(t => {
          if (t.step === -1) return diceValue === 6;
          return t.step >= 0 && t.step + diceValue <= 56;
        });

        if (movable.length > 0) {
          // Prioritize entering track, or furthest piece
          const best = movable.sort((a, b) => b.step - a.step)[0];
          moveTokenAnimated(best.id);
        }
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [gameMode, isCurrentBot, activeColor, winner, isMoving, hasRolled, isRolling, rollDice, tokens, diceValue, moveTokenAnimated]);

  const canRollNow = isMyTurn() && !hasRolled && !isRolling && !isMoving && !winner;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/games"
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-1.5 text-xs text-[#ffc16b] hover:text-[#ffe2b8] font-mono uppercase tracking-wider mb-2"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Games Arcade
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-amber-400">CAMPUS LUDO</span> ROYALE
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            4-Player real-time room key battles, pass-and-play hotseat, or play against smart algorithmic bots.
          </p>
        </div>

        <button
          onClick={initGame}
          className="btn-cyber-primary px-3.5 py-2 text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Board
        </button>
      </div>

      {/* 3 Explicit Game Modes */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 mb-6">
        <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2.5">
          Select Game Mode:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Mode 1: Bot */}
          <button
            onClick={() => {
              setGameMode('bot');
              setIsMultiplayerActive(false);
              sounds.playClick();
              initGame();
            }}
            className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all ${
              gameMode === 'bot'
                ? 'bg-amber-500 text-black shadow-neon-gold font-extrabold'
                : 'bg-black/40 text-gray-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>1. Computer AI Bots</span>
          </button>

          {/* Mode 2: Pass & Play */}
          <button
            onClick={() => {
              setGameMode('pvp');
              setIsMultiplayerActive(false);
              sounds.playClick();
              initGame();
            }}
            className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all ${
              gameMode === 'pvp'
                ? 'bg-purple-600 text-white shadow-neon-purple font-extrabold'
                : 'bg-black/40 text-gray-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Pass & Play (Local 2-4P)</span>
          </button>

          {/* Mode 3: Online Multiplayer */}
          <button
            onClick={() => {
              setGameMode('multiplayer');
              sounds.playClick();
            }}
            className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all ${
              gameMode === 'multiplayer'
                ? 'bg-cyan-500 text-black shadow-neon-cyan font-extrabold'
                : 'bg-black/40 text-gray-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>3. Multiplayer Arena (Up to 4 Friends)</span>
          </button>
        </div>
      </div>

      {/* Online Room Section */}
      {gameMode === 'multiplayer' && (
        <MultiplayerRoom
          game="ludo"
          currentGameState={currentMultiplayerState}
          onRoomSync={handleMultiplayerSync}
        />
      )}

      {/* ACTIVE TURN HUD BANNER */}
      <div className={`w-full p-3.5 rounded-xl border mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs shadow-lg transition-all ${
        gameMode === 'multiplayer'
          ? activeColor === myMultiplayerColor
            ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 animate-pulse'
            : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          : 'bg-black/40 border-white/10 text-white'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{COLOR_THEMES[activeColor].emoji}</span>
          <span className="font-bold tracking-wider text-white sm:text-sm">
            {gameMode === 'multiplayer' ? (
              activeColor === myMultiplayerColor ? (
                `YOUR TURN (${COLOR_THEMES[activeColor].name.toUpperCase()}) • ROLL & MOVE`
              ) : (
                `WAITING FOR ${COLOR_THEMES[activeColor].name.toUpperCase()} TO MOVE...`
              )
            ) : gameMode === 'pvp' ? (
              `${COLOR_THEMES[activeColor].name.toUpperCase()}'S TURN • ROLL & MOVE`
            ) : (
              activeColor === 'red' ? 'YOUR TURN (RED SQUAD) • ROLL THE DICE' : `${COLOR_THEMES[activeColor].name.toUpperCase()} BOT IS THINKING...`
            )}
          </span>
        </div>

        <div className="text-xs text-gray-300">
          {statusMessage}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 15x15 Master Ludo Board */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div className="w-full max-w-[min(94vw,560px)] aspect-square rounded-2xl overflow-hidden relative border-2 border-black/80 bg-white shadow-2xl select-none">
            
            {/* Corner 1: Red Base (Top-Left 40% x 40%) */}
            <div 
              className="absolute top-0 left-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center"
              style={{ backgroundColor: '#DC2626' }}
            >
              <div className="w-full h-full bg-white rounded-xl shadow-inner relative">
                {/* 4 Center circles inside base */}
                {YARD_PERCENT_COORDS.red.map((coord, idx) => (
                  <div
                    key={`slot-red-${idx}`}
                    style={{
                      left: `${(coord.x / 40) * 100}%`,
                      top: `${(coord.y / 40) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="absolute w-[28%] aspect-square rounded-full border-4 border-[#991B1B] bg-[#FEE2E2]"
                  />
                ))}
              </div>
            </div>

            {/* Corner 2: Green Base (Top-Right 40% x 40%) */}
            <div 
              className="absolute top-0 right-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center"
              style={{ backgroundColor: '#16A34A' }}
            >
              <div className="w-full h-full bg-white rounded-xl shadow-inner relative">
                {YARD_PERCENT_COORDS.green.map((coord, idx) => (
                  <div
                    key={`slot-green-${idx}`}
                    style={{
                      left: `${((coord.x - 60) / 40) * 100}%`,
                      top: `${(coord.y / 40) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="absolute w-[28%] aspect-square rounded-full border-4 border-[#166534] bg-[#DCFCE7]"
                  />
                ))}
              </div>
            </div>

            {/* Corner 3: Blue Base (Bottom-Left 40% x 40%) */}
            <div 
              className="absolute bottom-0 left-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center"
              style={{ backgroundColor: '#0284C7' }}
            >
              <div className="w-full h-full bg-white rounded-xl shadow-inner relative">
                {YARD_PERCENT_COORDS.blue.map((coord, idx) => (
                  <div
                    key={`slot-blue-${idx}`}
                    style={{
                      left: `${(coord.x / 40) * 100}%`,
                      top: `${((coord.y - 60) / 40) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="absolute w-[28%] aspect-square rounded-full border-4 border-[#075985] bg-[#E0F2FE]"
                  />
                ))}
              </div>
            </div>

            {/* Corner 4: Yellow Base (Bottom-Right 40% x 40%) */}
            <div 
              className="absolute bottom-0 right-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center"
              style={{ backgroundColor: '#CA8A04' }}
            >
              <div className="w-full h-full bg-white rounded-xl shadow-inner relative">
                {YARD_PERCENT_COORDS.yellow.map((coord, idx) => (
                  <div
                    key={`slot-yellow-${idx}`}
                    style={{
                      left: `${((coord.x - 60) / 40) * 100}%`,
                      top: `${((coord.y - 60) / 40) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="absolute w-[28%] aspect-square rounded-full border-4 border-[#854D0E] bg-[#FEF9C3]"
                  />
                ))}
              </div>
            </div>

            {/* Center 4 Triangles (Rows 6..8, Cols 6..8 = 20% x 20% at 40%, 40%) */}
            <svg 
              className="absolute top-[40%] left-[40%] w-[20%] h-[20%] pointer-events-none z-10"
              viewBox="0 0 100 100"
            >
              <polygon points="0,0 50,50 0,100" fill="#DC2626" />
              <polygon points="0,0 50,50 100,0" fill="#16A34A" />
              <polygon points="100,0 50,50 100,100" fill="#CA8A04" />
              <polygon points="0,100 50,50 100,100" fill="#0284C7" />
              <line x1="0" y1="0" x2="100" y2="100" stroke="#000" strokeWidth="1.5" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#000" strokeWidth="1.5" />
            </svg>

            {/* 15x15 Track Grid Cells */}
            <div 
              className="absolute inset-0 grid grid-cols-15 grid-rows-15 w-full h-full pointer-events-none"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(15, minmax(0, 1fr))'
              }}
            >
              {Array.from({ length: 225 }).map((_, idx) => {
                const row = Math.floor(idx / 15);
                const col = idx % 15;

                const isTopLeft = row < 6 && col < 6;
                const isTopRight = row < 6 && col >= 9;
                const isBottomLeft = row >= 9 && col < 6;
                const isBottomRight = row >= 9 && col >= 9;
                const isCenter = row >= 6 && row <= 8 && col >= 6 && col <= 8;

                if (isTopLeft || isTopRight || isBottomLeft || isBottomRight || isCenter) {
                  return <div key={idx} />;
                }

                let bg = 'bg-white';
                let border = 'border-[0.5px] border-gray-400';
                let icon = null;

                // Green Home Run & Start
                if (col === 7 && row >= 1 && row <= 5) bg = 'bg-emerald-600';
                if (row === 1 && col === 8) {
                  bg = 'bg-emerald-600';
                  icon = <ArrowDown className="w-3 h-3 text-white stroke-[3]" />;
                }

                // Red Home Run & Start
                if (row === 7 && col >= 1 && col <= 5) bg = 'bg-red-600';
                if (row === 6 && col === 1) {
                  bg = 'bg-red-600';
                  icon = <ArrowRight className="w-3 h-3 text-white stroke-[3]" />;
                }

                // Yellow Home Run & Start
                if (row === 7 && col >= 9 && col <= 13) bg = 'bg-amber-500';
                if (row === 8 && col === 13) {
                  bg = 'bg-amber-500';
                  icon = <ArrowLeft className="w-3 h-3 text-black stroke-[3]" />;
                }

                // Blue Home Run & Start
                if (col === 7 && row >= 9 && row <= 13) bg = 'bg-sky-600';
                if (row === 13 && col === 6) {
                  bg = 'bg-sky-600';
                  icon = <ArrowUp className="w-3 h-3 text-white stroke-[3]" />;
                }

                // Safe Stars
                if ((row === 2 && col === 6) || (row === 6 && col === 12) || (row === 8 && col === 2) || (row === 12 && col === 8)) {
                  icon = <Star className="w-3.5 h-3.5 text-gray-700 fill-white" />;
                }

                return (
                  <div 
                    key={idx}
                    className={`w-full h-full flex items-center justify-center ${bg} ${border}`}
                  >
                    {icon}
                  </div>
                );
              })}
            </div>

            {/* TOKENS - PRECISELY DEAD CENTERED IN CIRCLES AND CELLS */}
            {tokens.map(token => {
              const coords = getTokenCoordsPct(token);
              const theme = COLOR_THEMES[token.color];
              const isCurrentTurnToken = token.color === activeColor;
              const canMove = hasRolled && !isMoving && !winner && isMyTurn() && (
                (token.step === -1 && diceValue === 6) ||
                (token.step >= 0 && token.step + diceValue <= 56)
              );
              const isThisMoving = activeMovingTokenId === token.id;

              return (
                <div
                  key={token.id}
                  onClick={() => {
                    if (isCurrentTurnToken && canMove && (!isCurrentBot || gameMode !== 'bot')) {
                      moveTokenAnimated(token.id);
                    }
                  }}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: isThisMoving 
                      ? 'translate(-50%, -65%) scale(1.3)' 
                      : 'translate(-50%, -50%)',
                    width: '6.2%',
                    height: '6.2%',
                    transition: isThisMoving 
                      ? 'all 120ms cubic-bezier(0.34, 1.56, 0.64, 1)' 
                      : 'all 200ms ease-out'
                  }}
                  className={`absolute z-30 cursor-pointer flex items-center justify-center ${
                    canMove && isCurrentTurnToken ? 'animate-bounce' : ''
                  }`}
                >
                  {/* Circular 3D Metallic Droplet Goti */}
                  <div 
                    className={`w-full h-full rounded-full bg-white border-2 border-gray-400 shadow-[0_3px_8px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform ${
                      canMove && isCurrentTurnToken ? 'ring-2 ring-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.9)]' : ''
                    }`}
                  >
                    {/* Inner Colored Gem */}
                    <div 
                      className="w-[70%] h-[70%] rounded-full shadow-inner border border-white/60"
                      style={{ backgroundColor: theme.bgHex }}
                    />
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Right Column: Dice Roller, HUD & Scores */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Dice Roller Card */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 text-center relative overflow-hidden">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-4">
              Current Roller HUD:
            </h3>

            <div className="flex flex-col items-center justify-center gap-4 py-2">
              <div 
                className={`w-20 h-20 rounded-2xl bg-white border-4 flex items-center justify-center text-4xl shadow-2xl transition-transform ${
                  isRolling ? 'animate-spin scale-110' : 'scale-100'
                }`}
                style={{ borderColor: COLOR_THEMES[activeColor].bgHex }}
              >
                {diceValue === 1 && <Dice1 className="w-12 h-12" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 2 && <Dice2 className="w-12 h-12" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 3 && <Dice3 className="w-12 h-12" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 4 && <Dice4 className="w-12 h-12" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 5 && <Dice5 className="w-12 h-12" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 6 && <Dice6 className="w-12 h-12" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
              </div>

              {canRollNow ? (
                <button
                  onClick={rollDice}
                  disabled={isRolling}
                  className="btn-cyber-primary w-full py-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-gold"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ROLL THE DICE</span>
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-gray-400 flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {hasRolled 
                      ? 'SELECT A PIECE ON BOARD' 
                      : isRolling 
                        ? 'ROLLING...' 
                        : isCurrentBot 
                          ? 'BOT IS ROLLING...' 
                          : `WAITING FOR ${COLOR_THEMES[activeColor].name.toUpperCase()}...`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4 Squads Live Status Card */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white flex items-center justify-between">
              <span>Squad Match Status</span>
              <span className="text-[10px] text-gray-400">4 TOKENS EACH</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {turnColors.map((color, idx) => {
                const theme = COLOR_THEMES[color];
                const squadTokens = tokens.filter(t => t.color === color);
                const inYard = squadTokens.filter(t => t.step === -1).length;
                const onTrack = squadTokens.filter(t => t.step >= 0 && t.step < 56).length;
                const home = squadTokens.filter(t => t.step === 56).length;
                const isActive = currentTurnIdx === idx;

                return (
                  <div
                    key={color}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-white/10 border-white/30 shadow-sm' 
                        : 'bg-black/30 border-white/5 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{theme.emoji}</span>
                      <span className="font-bold text-white">{theme.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span>Yard: {inYard}</span>
                      <span>Track: {onTrack}</span>
                      <span className="text-emerald-400 font-bold">Home: {home}/4</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
