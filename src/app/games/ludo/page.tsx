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
  Play
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

// Exact percentage centers for the 4 circular target pedestals inside each base
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
  red: { name: 'Red Squad', bgHex: '#E11D48', borderHex: '#9F1239', badge: 'bg-red-500/20 text-red-300 border-red-500/40', emoji: '🔴' },
  green: { name: 'Green Legion', bgHex: '#16A34A', borderHex: '#14532D', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', emoji: '🟢' },
  yellow: { name: 'Yellow Sun', bgHex: '#EAB308', borderHex: '#A16207', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', emoji: '🟡' },
  blue: { name: 'Blue Cyber', bgHex: '#2563EB', borderHex: '#1E3A8A', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40', emoji: '🔵' }
};

// 3D Teardrop Map-Pin Component (Large, crisp, sitting steadily with active dance when selectable)
function LudoPinGoti({ 
  color, 
  canMove, 
  isMoving 
}: { 
  color: PlayerColor; 
  canMove: boolean; 
  isMoving: boolean; 
}) {
  const theme = COLOR_THEMES[color];

  return (
    <div className={`w-full h-full relative select-none flex items-center justify-center transition-all duration-150 ${
      canMove ? 'animate-goti-dance drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]' : ''
    }`}>
      <svg 
        viewBox="0 0 38 48" 
        className="w-full h-full drop-shadow-[0_5px_7px_rgba(0,0,0,0.65)] overflow-visible"
      >
        <defs>
          <linearGradient id={`silver-shell-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#F3F4F6" />
            <stop offset="70%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>

          <radialGradient id={`gem-fill-${color}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="30%" stopColor={theme.bgHex} />
            <stop offset="100%" stopColor={theme.borderHex} />
          </radialGradient>
        </defs>

        {/* 3D Teardrop Pin Body */}
        <path
          d="M19 2 C9.6 2 2 9.6 2 19 C2 29.5 16 43.5 18.2 45.6 C18.7 46.1 19.3 46.1 19.8 45.6 C22 43.5 36 29.5 36 19 C36 9.6 28.4 2 19 2 Z"
          fill={`url(#silver-shell-${color})`}
          stroke="#374151"
          strokeWidth="1.2"
        />

        {/* Inner Gem */}
        <circle 
          cx="19" 
          cy="19" 
          r="10.5" 
          fill={`url(#gem-fill-${color})`} 
          stroke="#FFFFFF" 
          strokeWidth="1.2" 
        />

        {/* Specular Highlight Reflection */}
        <ellipse 
          cx="16" 
          cy="15" 
          rx="4" 
          ry="2.5" 
          fill="#FFFFFF" 
          opacity="0.65" 
          transform="rotate(-25 16 15)" 
        />

        {/* Active Dancing Selection Aura Ring */}
        {canMove && (
          <>
            <circle 
              cx="19" 
              cy="19" 
              r="14" 
              fill="none" 
              stroke="#FBBF24" 
              strokeWidth="3" 
              opacity="0.95"
              className="animate-pulse" 
            />
            {/* Sparkle golden crown atop the pin */}
            <circle 
              cx="19" 
              cy="2" 
              r="3.5" 
              fill="#FDE047" 
              stroke="#B45309"
              strokeWidth="1"
              className="animate-ping"
            />
          </>
        )}
      </svg>
    </div>
  );
}

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
  const [pvpPlayerCount, setPvpPlayerCount] = useState<2 | 3 | 4>(2);
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
  const [multiplayerMaxPlayers, setMultiplayerMaxPlayers] = useState<number>(2);
  const [roomPlayers, setRoomPlayers] = useState<any[]>([]);

  // Direct move sender ref for 0-lag multiplayer broadcast
  const directMoveSenderRef = useRef<((state: any) => Promise<void>) | null>(null);
  // Always-current tokens ref to avoid stale closures in async handlers
  const tokensRef = useRef<Token[]>([]);

  // Dynamic active turn colors based on chosen capacity
  const getActiveColors = useCallback((): PlayerColor[] => {
    if (gameMode === 'multiplayer') {
      const capacity = multiplayerMaxPlayers;
      if (capacity === 2) return ['red', 'green'];
      if (capacity === 3) return ['red', 'green', 'yellow'];
      return ['red', 'green', 'yellow', 'blue'];
    }
    if (gameMode === 'pvp') {
      if (pvpPlayerCount === 2) return ['red', 'green'];
      if (pvpPlayerCount === 3) return ['red', 'green', 'yellow'];
      return ['red', 'green', 'yellow', 'blue'];
    }
    // Bot mode: all 4 play
    return ['red', 'green', 'yellow', 'blue'];
  }, [gameMode, multiplayerMaxPlayers, pvpPlayerCount]);

  const activeColors = getActiveColors();
  const safeTurnIdx = currentTurnIdx % activeColors.length;
  const activeColor = activeColors[safeTurnIdx] || 'red';

  // Keep tokensRef always up-to-date so async handlers don't get stale data
  tokensRef.current = tokens;

  const isCurrentBot = gameMode === 'bot' && activeColor !== 'red';

  const isMyTurn = () => {
    if (gameMode === 'bot') {
      return activeColor === 'red';
    }
    if (gameMode === 'pvp') {
      return true;
    }
    if (gameMode === 'multiplayer') {
      return activeColor === myMultiplayerColor;
    }
    return true;
  };

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
    const stretchIdx = Math.min(token.step - 51, 5);
    const [r, c] = HOME_STRETCH_COORDS[token.color][stretchIdx];
    return {
      x: ((c + 0.5) / 15) * 100,
      y: ((r + 0.5) / 15) * 100
    };
  };

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

  // Advance turn cleanly between active players
  const nextTurn = useCallback((extraRoll: boolean = false, overrideActiveColors?: PlayerColor[]) => {
    const colorList = overrideActiveColors || activeColors;

    if (extraRoll) {
      setHasRolled(false);
      setIsRolling(false);
      setIsMoving(false);
      setStatusMessage(`${COLOR_THEMES[activeColor].name} rolled a 6 and gets another roll!`);
      return;
    }

    const nextIdx = (safeTurnIdx + 1) % colorList.length;
    setCurrentTurnIdx(nextIdx);
    setHasRolled(false);
    setIsRolling(false);
    setIsMoving(false);
    setStatusMessage(`${COLOR_THEMES[colorList[nextIdx]].name}'s turn to roll!`);
  }, [activeColors, activeColor, safeTurnIdx]);

  // Handle incoming moves from online multiplayer room
  const handleMultiplayerSync = useCallback((incoming: any, meta: MultiplayerSyncMeta) => {
    if (!incoming) return;

    setIsMultiplayerActive(true);
    setGameMode('multiplayer');
    setMyMultiplayerColor((meta.myColor as PlayerColor) || 'red');
    setRoomPlayers(meta.players || []);
    if (meta.maxPlayers) {
      setMultiplayerMaxPlayers(meta.maxPlayers);
    }

    // Always clear local locks when receiving sync so turns never stall
    setIsMoving(false);
    setIsRolling(false);

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
    currentTurnIdx: safeTurnIdx,
    diceValue,
    hasRolled,
    winner,
  };

  // Roll Dice Action
  const rollDice = useCallback(() => {
    if (isRolling || hasRolled || isMoving || winner) return;

    if (gameMode === 'multiplayer' && activeColor !== myMultiplayerColor) {
      return;
    }

    setIsRolling(true);
    sounds.playDice();

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 6) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalVal);
        setIsRolling(false);
        setHasRolled(true);

        const playerTokens = tokensRef.current.filter(t => t.color === activeColor);
        const canMoveAny = playerTokens.some(t => {
          if (t.step === -1) return finalVal === 6;
          return t.step >= 0 && t.step + finalVal <= 56;
        });

        if (!canMoveAny) {
          setStatusMessage(`No moves for ${COLOR_THEMES[activeColor].name}. Next turn...`);
          setTimeout(() => {
            const nextIdx = (safeTurnIdx + 1) % activeColors.length;
            nextTurn(false);

            if (gameMode === 'multiplayer' && directMoveSenderRef.current) {
              directMoveSenderRef.current({
                tokens: tokensRef.current,
                currentTurnIdx: nextIdx,
                diceValue: finalVal,
                hasRolled: false,
                winner: null
              });
            }
          }, 800);
        } else {
          setStatusMessage(`${COLOR_THEMES[activeColor].name} rolled ${finalVal}! Choose a piece.`);

          if (gameMode === 'multiplayer' && directMoveSenderRef.current) {
            directMoveSenderRef.current({
              tokens: tokensRef.current,
              currentTurnIdx: safeTurnIdx,
              diceValue: finalVal,
              hasRolled: true,
              winner: null
            });
          }
        }
      }
    }, 45);
  }, [isRolling, hasRolled, isMoving, winner, gameMode, activeColor, myMultiplayerColor, activeColors, safeTurnIdx, nextTurn]);

  // Animated Token Move Handler — uses tokensRef to avoid stale closures
  const moveTokenAnimated = useCallback(async (tokenId: number) => {
    if (isMoving || !hasRolled || winner) return;
    if (gameMode === 'multiplayer' && activeColor !== myMultiplayerColor) return;

    const currentTokens = tokensRef.current;
    const token = currentTokens.find(t => t.id === tokenId);
    if (!token || token.color !== activeColor) return;

    if (token.step === -1) {
      if (diceValue !== 6) return;
    } else {
      if (token.step + diceValue > 56) return;
    }

    setIsMoving(true);
    setActiveMovingTokenId(tokenId);
    sounds.playMove();

    try {
      // 1. Release from yard to Step 0
      if (token.step === -1) {
        const updated = tokensRef.current.map(t => t.id === tokenId ? { ...t, step: 0 } : t);
        tokensRef.current = updated;
        setTokens(updated);
        await new Promise(r => setTimeout(r, 140));
        nextTurn(true);
        if (gameMode === 'multiplayer' && directMoveSenderRef.current) {
          directMoveSenderRef.current({ tokens: updated, currentTurnIdx: safeTurnIdx, diceValue, hasRolled: false, winner: null });
        }
        return;
      }

      // 2. Step one by one along the path
      const startStep = token.step;
      const targetStep = Math.min(startStep + diceValue, 56);

      for (let current = startStep + 1; current <= targetStep; current++) {
        const stepped = tokensRef.current.map(t => t.id === tokenId ? { ...t, step: current } : t);
        tokensRef.current = stepped;
        setTokens(stepped);
        sounds.playClick();
        await new Promise(r => setTimeout(r, 110));
      }

      // 3. Captures & Win check using fresh ref
      let didCapture = false;
      let finalTokens = tokensRef.current;

      if (targetStep >= 0 && targetStep <= 50) {
        const myTrackIdx = (COLOR_START_OFFSETS[token.color] + targetStep) % 52;
        const isSafe = [0, 8, 13, 21, 26, 34, 39, 47].includes(myTrackIdx);
        if (!isSafe) {
          finalTokens = finalTokens.map(other => {
            if (other.color !== token.color && other.step >= 0 && other.step <= 50) {
              const otherTrackIdx = (COLOR_START_OFFSETS[other.color] + other.step) % 52;
              if (otherTrackIdx === myTrackIdx) {
                didCapture = true;
                sounds.playError();
                return { ...other, step: -1 };
              }
            }
            return other;
          });
          tokensRef.current = finalTokens;
          setTokens(finalTokens);
        }
      }

      // 4. Win check
      const myPieces = finalTokens.filter(t => t.color === activeColor);
      const allInHome = myPieces.length > 0 && myPieces.every(t => t.step === 56);

      if (allInHome) {
        setWinner(activeColor);
        setStatusMessage(`🏆 ${COLOR_THEMES[activeColor].name} WINS THE MATCH!`);
        sounds.playSuccess();
        triggerConfetti();
        try {
          const raw = localStorage.getItem('dbuu_game_stats') || '{}';
          const stats = JSON.parse(raw);
          stats.ludoGames = (stats.ludoGames || 0) + 1;
          if (activeColor === 'red' || activeColor === myMultiplayerColor) stats.ludoWins = (stats.ludoWins || 0) + 1;
          localStorage.setItem('dbuu_game_stats', JSON.stringify(stats));
        } catch (e) {}
        if (gameMode === 'multiplayer' && directMoveSenderRef.current) {
          directMoveSenderRef.current({ tokens: finalTokens, currentTurnIdx: safeTurnIdx, diceValue, hasRolled: false, winner: activeColor });
        }
        return;
      }

      // 5. Advance turn
      const earnsBonus = diceValue === 6 || didCapture;
      const nextIdx = earnsBonus ? safeTurnIdx : (safeTurnIdx + 1) % activeColors.length;
      nextTurn(earnsBonus);
      if (gameMode === 'multiplayer' && directMoveSenderRef.current) {
        directMoveSenderRef.current({ tokens: finalTokens, currentTurnIdx: nextIdx, diceValue, hasRolled: false, winner: null });
      }
    } finally {
      setIsMoving(false);
      setActiveMovingTokenId(null);
    }
  }, [isMoving, hasRolled, winner, gameMode, activeColor, myMultiplayerColor, diceValue, activeColors, safeTurnIdx, nextTurn]);

  // Bot Automation
  useEffect(() => {
    if (gameMode !== 'bot' || !isCurrentBot || winner || isMoving) return;

    if (!hasRolled && !isRolling) {
      const timer = setTimeout(() => {
        rollDice();
      }, 450);
      return () => clearTimeout(timer);
    }

    if (hasRolled && !isMoving) {
      const timer = setTimeout(() => {
        const botTokens = tokens.filter(t => t.color === activeColor);
        const movable = botTokens.filter(t => {
          if (t.step === -1) return diceValue === 6;
          return t.step >= 0 && t.step + diceValue <= 56;
        });

        if (movable.length > 0) {
          const best = movable.sort((a, b) => b.step - a.step)[0];
          moveTokenAnimated(best.id);
        }
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [gameMode, isCurrentBot, activeColor, winner, isMoving, hasRolled, isRolling, rollDice, tokens, diceValue, moveTokenAnimated]);

  const canRollNow = isMyTurn() && !hasRolled && !isRolling && !isMoving && !winner;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <Link
            href="/games"
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-1.5 text-xs text-[#ffc16b] hover:text-[#ffe2b8] font-mono uppercase tracking-wider mb-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Games Arcade
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-amber-400">CAMPUS LUDO</span> ROYALE
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Play with 2, 3 or 4 players online via room key, pass-and-play hotseat, or AI bots.
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
      <div className="glass-panel rounded-2xl p-4 border border-white/10 mb-5 space-y-3 min-w-0">
        <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block">
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
            <span>1. Computer AI Bots (4P)</span>
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
            <span>2. Pass & Play (Local)</span>
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
            <span>3. Multiplayer Arena (2, 3 or 4P)</span>
          </button>
        </div>

        {/* Pass & Play Player Count Selector */}
        {gameMode === 'pvp' && (
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-gray-400">Players Count:</span>
            <div className="flex items-center gap-2">
              {([2, 3, 4] as const).map(count => (
                <button
                  key={count}
                  onClick={() => {
                    setPvpPlayerCount(count);
                    sounds.playClick();
                    initGame();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                    pvpPlayerCount === count
                      ? 'bg-purple-500 text-white border border-purple-400 shadow-sm'
                      : 'bg-black/30 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {count} Players {count === 2 ? '(Red & Green)' : count === 3 ? '(Red, Green, Yellow)' : '(All 4)'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Online Room Section */}
      {gameMode === 'multiplayer' && (
        <MultiplayerRoom
          game="ludo"
          currentGameState={currentMultiplayerState}
          onRoomSync={handleMultiplayerSync}
          onRegisterMoveSender={(sender) => {
            directMoveSenderRef.current = sender;
          }}
          onCapacityChange={(capacity) => {
            setMultiplayerMaxPlayers(capacity);
          }}
          initialCapacity={multiplayerMaxPlayers as (2 | 3 | 4)}
        />
      )}

      {/* ACTIVE TURN HUD BANNER */}
      <div className={`w-full p-3 sm:p-3.5 rounded-xl border mb-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 font-mono text-xs shadow-lg transition-all min-w-0 ${
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

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-300">{statusMessage}</span>
          <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10 text-[10px] text-cyan-400">
            {activeColors.length} Players Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full min-w-0">
        {/* Left: 15x15 Master Ludo Board (Guaranteed 100% responsive, never overflows screen) */}
        <div className="lg:col-span-8 flex flex-col items-center w-full min-w-0">
          
          <div className="w-full max-w-[min(100%,480px)] sm:max-w-[520px] aspect-square rounded-2xl overflow-hidden relative border-2 border-black/90 bg-white shadow-2xl select-none mx-auto">
            
            {/* Corner 1: Red Base (Top-Left 40% x 40%) */}
            <div 
              className="absolute top-0 left-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center"
              style={{ backgroundColor: '#DC2626' }}
            >
              <div className="w-full h-full bg-white rounded-xl shadow-inner relative">
                {YARD_PERCENT_COORDS.red.map((coord, idx) => (
                  <div
                    key={`slot-red-${idx}`}
                    style={{
                      left: `${(coord.x / 40) * 100}%`,
                      top: `${(coord.y / 40) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="absolute w-[30%] aspect-square rounded-full border-4 border-[#991B1B] bg-white flex items-center justify-center shadow-md"
                  >
                    <div className="w-[58%] aspect-square rounded-full border-2 border-[#991B1B] bg-red-100" />
                  </div>
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
                    className="absolute w-[30%] aspect-square rounded-full border-4 border-[#166534] bg-white flex items-center justify-center shadow-md"
                  >
                    <div className="w-[58%] aspect-square rounded-full border-2 border-[#166534] bg-emerald-100" />
                  </div>
                ))}
              </div>
            </div>

            {/* Corner 3: Blue Base (Bottom-Left 40% x 40%) */}
            <div 
              className={`absolute bottom-0 left-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center transition-opacity ${
                !activeColors.includes('blue') ? 'opacity-30' : 'opacity-100'
              }`}
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
                    className="absolute w-[30%] aspect-square rounded-full border-4 border-[#075985] bg-white flex items-center justify-center shadow-md"
                  >
                    <div className="w-[58%] aspect-square rounded-full border-2 border-[#075985] bg-sky-100" />
                  </div>
                ))}
                {!activeColors.includes('blue') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded bg-black/70">
                      Empty Slot
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Corner 4: Yellow Base (Bottom-Right 40% x 40%) */}
            <div 
              className={`absolute bottom-0 right-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center transition-opacity ${
                !activeColors.includes('yellow') ? 'opacity-30' : 'opacity-100'
              }`}
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
                    className="absolute w-[30%] aspect-square rounded-full border-4 border-[#854D0E] bg-white flex items-center justify-center shadow-md"
                  >
                    <div className="w-[58%] aspect-square rounded-full border-2 border-[#854D0E] bg-amber-100" />
                  </div>
                ))}
                {!activeColors.includes('yellow') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded bg-black/70">
                      Empty Slot
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Center 4 Triangles */}
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

            {/* TOKENS - LARGE 3D TEARDROP MAP-PINS WITH ACTIVE CELL OVERLAP RESOLUTION & DANCING SELECTION */}
            {(() => {
              // Pre-calculate token positions on board to fan out overlapping pieces
              const cellMap: Record<string, Token[]> = {};
              tokens.forEach(t => {
                if (!activeColors.includes(t.color)) return;
                if (t.step === -1) {
                  cellMap[`yard_${t.color}_${t.id % 4}`] = [t];
                } else {
                  const c = getTokenCoordsPct(t);
                  const key = `cell_${c.x.toFixed(1)}_${c.y.toFixed(1)}`;
                  if (!cellMap[key]) cellMap[key] = [];
                  cellMap[key].push(t);
                }
              });

              return tokens.map(token => {
                if (!activeColors.includes(token.color)) return null;

                const coords = getTokenCoordsPct(token);
                const isCurrentTurnToken = token.color === activeColor;
                const canMove = hasRolled && !isMoving && !winner && isMyTurn() && (
                  (token.step === -1 && diceValue === 6) ||
                  (token.step >= 0 && token.step + diceValue <= 56)
                );
                const isThisMoving = activeMovingTokenId === token.id;

                // Overlap calculation: when two different gotis are at the same place, stagger them
                const cellKey = token.step === -1 
                  ? `yard_${token.color}_${token.id % 4}`
                  : `cell_${coords.x.toFixed(1)}_${coords.y.toFixed(1)}`;
                const occupants = cellMap[cellKey] || [token];
                const occupantIndex = occupants.findIndex(t => t.id === token.id);
                const count = occupants.length;

                let dx = 0;
                let dy = 0;
                if (count > 1 && token.step >= 0) {
                  if (count === 2) {
                    dx = occupantIndex === 0 ? -1.6 : 1.6;
                    dy = occupantIndex === 0 ? -1.2 : 1.2;
                  } else if (count === 3) {
                    if (occupantIndex === 0) { dx = -1.8; dy = -1.2; }
                    else if (occupantIndex === 1) { dx = 1.8; dy = -1.2; }
                    else { dx = 0; dy = 1.6; }
                  } else {
                    dx = (occupantIndex % 2 === 0 ? -1.8 : 1.8);
                    dy = occupantIndex < 2 ? -1.5 : 1.5;
                  }
                }

                // If this piece is movable, bring to FRONT z-50 with active dancing aura
                // Non-movable opponent tokens have pointer-events-none so they never steal the active player's click!
                const zIndexClass = isThisMoving 
                  ? 'z-50' 
                  : canMove 
                    ? 'z-40' 
                    : isCurrentTurnToken 
                      ? 'z-30' 
                      : 'z-20 pointer-events-none opacity-80';

                return (
                  <div
                    key={token.id}
                    onClick={() => {
                      if (isCurrentTurnToken && canMove && (!isCurrentBot || gameMode !== 'bot')) {
                        moveTokenAnimated(token.id);
                      }
                    }}
                    style={{
                      left: `${coords.x + dx}%`,
                      top: `${coords.y + dy}%`,
                      transform: isThisMoving 
                        ? 'translate(-50%, -90%) scale(1.18)' 
                        : canMove
                          ? 'translate(-50%, -80%) scale(1.12)'
                          : 'translate(-50%, -75%)',
                      width: '8.4%',
                      height: '11.5%',
                      transition: isThisMoving 
                        ? 'all 100ms cubic-bezier(0.34, 1.56, 0.64, 1)' 
                        : 'all 160ms ease-out'
                    }}
                    className={`absolute ${zIndexClass} ${canMove ? 'cursor-pointer' : 'cursor-default'} flex items-center justify-center`}
                  >
                    <LudoPinGoti 
                      color={token.color} 
                      canMove={canMove} 
                      isMoving={isThisMoving} 
                    />
                  </div>
                );
              });
            })()}

          </div>
        </div>

        {/* Right Column: Dice Roller, HUD & Scores */}
        <div className="lg:col-span-4 space-y-5 w-full min-w-0">
          
          {/* Dice Roller Card */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 text-center relative overflow-hidden">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">
              Current Turn Roller:
            </h3>

            <div className="flex flex-col items-center justify-center gap-3.5 py-1">
              <div 
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white border-4 flex items-center justify-center text-4xl shadow-2xl transition-transform ${
                  isRolling ? 'animate-spin scale-105' : 'scale-100'
                }`}
                style={{ borderColor: COLOR_THEMES[activeColor].bgHex }}
              >
                {diceValue === 1 && <Dice1 className="w-11 h-11" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 2 && <Dice2 className="w-11 h-11" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 3 && <Dice3 className="w-11 h-11" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 4 && <Dice4 className="w-11 h-11" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 5 && <Dice5 className="w-11 h-11" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
                {diceValue === 6 && <Dice6 className="w-11 h-11" style={{ color: COLOR_THEMES[activeColor].bgHex }} />}
              </div>

              {canRollNow ? (
                <button
                  onClick={rollDice}
                  disabled={isRolling}
                  className="btn-cyber-primary w-full py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-gold"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ROLL THE DICE</span>
                </button>
              ) : (
                <div className="w-full py-2.5 sm:py-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-gray-400 flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {hasRolled 
                      ? 'SELECT A PIN ON BOARD' 
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

          {/* Active Squads Status Card */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white flex items-center justify-between">
              <span>Active Squad Status</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {activeColors.length} SLOTS LIVE
              </span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {activeColors.map((color) => {
                const theme = COLOR_THEMES[color];
                const squadTokens = tokens.filter(t => t.color === color);
                const inYard = squadTokens.filter(t => t.step === -1).length;
                const onTrack = squadTokens.filter(t => t.step >= 0 && t.step < 56).length;
                const home = squadTokens.filter(t => t.step === 56).length;
                const isActive = activeColor === color;

                return (
                  <div
                    key={color}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-white/10 border-white/40 shadow-md' 
                        : 'bg-black/30 border-white/5 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{theme.emoji}</span>
                      <span className="font-bold text-white">{theme.name}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
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
