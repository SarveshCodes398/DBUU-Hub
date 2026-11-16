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
  ShieldAlert,
  Play,
  Volume2,
  VolumeX,
  Star,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';
import MultiplayerRoom from '@/components/MultiplayerRoom';

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export interface Token {
  id: number;
  color: PlayerColor;
  step: number; // -1 = Yard, 0..50 = Main Track, 51..55 = Home Stretch, 56 = Home
}

// 52-cell outer common path [row, col] on a 15x15 board
// Red starts at step 0 = [6, 1]
const TRACK_COORDINATES: [number, number][] = [
  [6, 1],  // 0: Red start (Star/Arrow)
  [6, 2],  // 1
  [6, 3],  // 2
  [6, 4],  // 3
  [6, 5],  // 4
  [5, 6],  // 5
  [4, 6],  // 6
  [3, 6],  // 7
  [2, 6],  // 8: Safe Star
  [1, 6],  // 9
  [0, 6],  // 10
  [0, 7],  // 11
  [0, 8],  // 12
  [1, 8],  // 13: Green start (Star/Arrow)
  [2, 8],  // 14
  [3, 8],  // 15
  [4, 8],  // 16
  [5, 8],  // 17
  [6, 9],  // 18
  [6, 10], // 19
  [6, 11], // 20
  [6, 12], // 21: Safe Star
  [6, 13], // 22
  [6, 14], // 23
  [7, 14], // 24
  [8, 14], // 25
  [8, 13], // 26: Yellow start (Star/Arrow)
  [8, 12], // 27
  [8, 11], // 28
  [8, 10], // 29
  [8, 9],  // 30
  [9, 8],  // 31
  [10, 8], // 32
  [11, 8], // 33
  [12, 8], // 34: Safe Star
  [13, 8], // 35
  [14, 8], // 36
  [14, 7], // 37
  [14, 6], // 38
  [13, 6], // 39: Blue start (Star/Arrow)
  [12, 6], // 40
  [11, 6], // 41
  [10, 6], // 42
  [9, 6],  // 43
  [8, 5],  // 44
  [8, 4],  // 45
  [8, 3],  // 46
  [8, 2],  // 47: Safe Star
  [8, 1],  // 48
  [8, 0],  // 49
  [7, 0],  // 50
  [6, 0]   // 51: Before Red home column
];

// Start offsets on the outer 52-cell track
const COLOR_START_OFFSETS: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

// Safe spots indices on the track
const SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// Home stretch coordinates (steps 51 to 55) and Center Home (step 56)
const HOME_STRETCH_COORDS: Record<PlayerColor, [number, number][]> = {
  red: [
    [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]
  ],
  green: [
    [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]
  ],
  yellow: [
    [7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]
  ],
  blue: [
    [13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]
  ]
};

// Token yard positions in the 4 corners: 4 token slots per house
const YARD_COORDINATES: Record<PlayerColor, [number, number][]> = {
  red: [
    [1.6, 1.6], [1.6, 3.4],
    [3.4, 1.6], [3.4, 3.4]
  ],
  green: [
    [1.6, 10.6], [1.6, 12.4],
    [3.4, 10.6], [3.4, 12.4]
  ],
  blue: [
    [10.6, 1.6], [10.6, 3.4],
    [12.4, 1.6], [12.4, 3.4]
  ],
  yellow: [
    [10.6, 10.6], [10.6, 12.4],
    [12.4, 10.6], [12.4, 12.4]
  ]
};

const COLOR_THEMES: Record<PlayerColor, {
  name: string;
  bgHex: string;
  borderHex: string;
  pinClass: string;
  tailClass: string;
}> = {
  red: {
    name: 'Red Squad',
    bgHex: '#E11D48',
    borderHex: '#BE123C',
    pinClass: 'bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-rose-900/60',
    tailClass: 'border-t-rose-700'
  },
  green: {
    name: 'Green Legion',
    bgHex: '#16A34A',
    borderHex: '#15803D',
    pinClass: 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-900/60',
    tailClass: 'border-t-emerald-700'
  },
  yellow: {
    name: 'Yellow Sun',
    bgHex: '#EAB308',
    borderHex: '#CA8A04',
    pinClass: 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-amber-900/60',
    tailClass: 'border-t-amber-600'
  },
  blue: {
    name: 'Blue Cyber',
    bgHex: '#2563EB',
    borderHex: '#1D4ED8',
    pinClass: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-900/60',
    tailClass: 'border-t-blue-700'
  }
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

  const [players, setPlayers] = useState<{ color: PlayerColor; isBot: boolean }[]>([
    { color: 'red', isBot: false },
    { color: 'green', isBot: true },
    { color: 'yellow', isBot: true },
    { color: 'blue', isBot: true },
  ]);

  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number>(6);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [activeMovingTokenId, setActiveMovingTokenId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Red to roll the dice!');
  const [winner, setWinner] = useState<PlayerColor | null>(null);

  const activeColor = players[currentTurnIdx].color;
  const isCurrentBot = players[currentTurnIdx].isBot;

  // Convert logical step to board coordinate [row, col]
  const getTokenCoords = (token: Token): [number, number] => {
    if (token.step === -1) {
      // Inside Yard
      const yardIndex = token.id % 4;
      return YARD_COORDINATES[token.color][yardIndex];
    }
    if (token.step >= 0 && token.step <= 50) {
      // Main 52-cell track
      const trackIdx = (COLOR_START_OFFSETS[token.color] + token.step) % 52;
      return TRACK_COORDINATES[trackIdx];
    }
    // Home stretch 51..56
    const stretchIdx = Math.min(token.step - 51, 5);
    return HOME_STRETCH_COORDS[token.color][stretchIdx];
  };

  // Switch Turn
  const nextTurn = useCallback((extraRoll: boolean = false) => {
    if (extraRoll) {
      setHasRolled(false);
      setIsRolling(false);
      setStatusMessage(`${COLOR_THEMES[activeColor].name} earned another roll!`);
      return;
    }

    const nextIdx = (currentTurnIdx + 1) % players.length;
    setCurrentTurnIdx(nextIdx);
    setHasRolled(false);
    setIsRolling(false);
    setStatusMessage(`${COLOR_THEMES[players[nextIdx].color].name}'s turn to roll!`);
  }, [currentTurnIdx, players, activeColor]);

  // Check victory
  const checkVictory = useCallback((newTokens: Token[]): boolean => {
    const playerTokens = newTokens.filter(t => t.color === activeColor);
    const allHome = playerTokens.every(t => t.step === 56);
    if (allHome) {
      setWinner(activeColor);
      setStatusMessage(`🎉 🏆 ${COLOR_THEMES[activeColor].name} WINS THE ROYALE!`);
      triggerConfetti();
      return true;
    }
    return false;
  }, [activeColor]);

  // ONE-BY-ONE STEP ANIMATION HANDLER
  const moveTokenAnimated = useCallback(async (tokenId: number) => {
    if (isMoving || !hasRolled) return;

    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;

    // Validation
    if (token.step === -1) {
      if (diceValue !== 6) return;
    } else {
      if (token.step + diceValue > 56) return;
    }

    setIsMoving(true);
    setActiveMovingTokenId(tokenId);
    sounds.playClick();

    // 1. If releasing from yard to track (Step 0)
    if (token.step === -1) {
      // Hop from yard directly to track step 0
      setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, step: 0 } : t));
      await new Promise(r => setTimeout(r, 220));

      // Extra roll on 6
      setIsMoving(false);
      setActiveMovingTokenId(null);
      nextTurn(true);
      return;
    }

    // 2. Animate stepping ONE-BY-ONE along the path
    const startStep = token.step;
    const targetStep = startStep + diceValue;

    for (let current = startStep + 1; current <= targetStep; current++) {
      setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, step: current } : t));
      sounds.playClick();
      // Step animation delay (creates visual hopping feel)
      await new Promise(r => setTimeout(r, 160));
    }

    // 3. Post-move checks (Captures & Home)
    let extraRoll = diceValue === 6;

    // Check if token reached Home (Step 56)
    if (targetStep === 56) {
      extraRoll = true;
      triggerConfetti();
      setStatusMessage(`✨ Token reached Home! +1 Extra Roll`);
    }

    // Check for Knockout / Capture if on outer track (0..50)
    if (targetStep >= 0 && targetStep <= 50) {
      const landedTrackIdx = (COLOR_START_OFFSETS[token.color] + targetStep) % 52;
      const isSafeSpot = SAFE_TRACK_INDICES.includes(landedTrackIdx);

      if (!isSafeSpot) {
        // Find if any opponent token is on this exact track spot
        const capturedOpponents: Token[] = [];

        setTokens(prev => {
          return prev.map(t => {
            if (t.color !== token.color && t.step >= 0 && t.step <= 50) {
              const oppTrackIdx = (COLOR_START_OFFSETS[t.color] + t.step) % 52;
              if (oppTrackIdx === landedTrackIdx) {
                capturedOpponents.push(t);
                return { ...t, step: -1 }; // Send back to yard!
              }
            }
            return t;
          });
        });

        if (capturedOpponents.length > 0) {
          extraRoll = true;
          setStatusMessage(`💥 Knockout! Captured ${capturedOpponents.length} opponent piece! Extra roll.`);
          triggerConfetti();
        }
      }
    }

    setIsMoving(false);
    setActiveMovingTokenId(null);

    // Check if won
    setTokens(latestTokens => {
      const isWin = checkVictory(latestTokens);
      if (!isWin) {
        nextTurn(extraRoll);
      }
      return latestTokens;
    });
  }, [tokens, diceValue, hasRolled, isMoving, checkVictory, nextTurn]);

  // Roll Dice
  const rollDice = useCallback(() => {
    if (isRolling || hasRolled || winner || isMoving) return;

    setIsRolling(true);
    sounds.playClick();

    let counter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 8) {
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
          setStatusMessage(`${COLOR_THEMES[activeColor].name} rolled ${finalVal}! Select a piece to advance.`);
        }
      }
    }, 60);
  }, [isRolling, hasRolled, winner, isMoving, tokens, activeColor, nextTurn]);

  // Bot Turn Automation
  useEffect(() => {
    if (isCurrentBot && !hasRolled && !isRolling && !isMoving && !winner) {
      const timer = setTimeout(() => {
        rollDice();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isCurrentBot, hasRolled, isRolling, isMoving, winner, rollDice]);

  // Bot Piece Move Automation
  useEffect(() => {
    if (isCurrentBot && hasRolled && !isMoving && !winner) {
      const timer = setTimeout(() => {
        const playerTokens = tokens.filter(t => t.color === activeColor);
        const validTokens = playerTokens.filter(t => {
          if (t.step === -1) return diceValue === 6;
          return t.step + diceValue <= 56;
        });

        if (validTokens.length > 0) {
          // Priority: release from yard if 6, else furthest token
          const yardToken = validTokens.find(t => t.step === -1);
          if (yardToken && diceValue === 6 && Math.random() > 0.3) {
            moveTokenAnimated(yardToken.id);
          } else {
            validTokens.sort((a, b) => b.step - a.step);
            moveTokenAnimated(validTokens[0].id);
          }
        }
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isCurrentBot, hasRolled, isMoving, winner, tokens, activeColor, diceValue, moveTokenAnimated]);

  // Reset Game
  const resetGame = () => {
    setTokens(tokens.map(t => ({ ...t, step: -1 })));
    setCurrentTurnIdx(0);
    setDiceValue(6);
    setHasRolled(false);
    setIsRolling(false);
    setIsMoving(false);
    setWinner(null);
    setStatusMessage('Game reset! Red rolls first.');
    sounds.playClick();
  };

  // Sync with multiplayer room key
  const handleMultiplayerSync = (incomingState: any, isHost: boolean) => {
    if (!incomingState) return;
    if (incomingState.tokens) setTokens(incomingState.tokens);
    if (typeof incomingState.currentTurnIdx === 'number') setCurrentTurnIdx(incomingState.currentTurnIdx);
    if (typeof incomingState.diceValue === 'number') setDiceValue(incomingState.diceValue);
  };

  const currentMultiplayerState = {
    tokens,
    currentTurnIdx,
    diceValue
  };

  const renderDiceIcon = () => {
    switch (diceValue) {
      case 1: return <Dice1 className="w-12 h-12 text-white" />;
      case 2: return <Dice2 className="w-12 h-12 text-white" />;
      case 3: return <Dice3 className="w-12 h-12 text-white" />;
      case 4: return <Dice4 className="w-12 h-12 text-white" />;
      case 5: return <Dice5 className="w-12 h-12 text-white" />;
      case 6: return <Dice6 className="w-12 h-12 text-[#ffc16b] animate-pulse" />;
      default: return <Dice6 className="w-12 h-12 text-white" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/games"
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ffc16b] hover:text-white mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            BACK TO GAMES ARCADE
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>CAMPUS LUDO</span>
            <span className="text-[#ffc16b]">ROYALE</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#ffc16b]/10 border border-[#ffc16b]/30 text-[#ffc16b] font-mono">
              OFFICIAL 15x15 BOARD
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Standard board, authentic path animation, knockout captures, and key-based multiplayer duels!
          </p>
        </div>

        <button
          onClick={resetGame}
          className="btn-cyber-primary px-4 py-2 text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Board
        </button>
      </div>

      {/* MULTIPLAYER ROOM SECTION */}
      <MultiplayerRoom
        game="ludo"
        currentGameState={currentMultiplayerState}
        onRoomSync={handleMultiplayerSync}
      />

      {/* Main Game Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Authentic 15x15 Ludo Board (Matching Image) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div className="w-full max-w-[580px] aspect-square bg-[#0b0710] p-3 sm:p-4 rounded-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative flex items-center justify-center">
            
            {/* The 15x15 Master Board SVG & CSS Grid */}
            <div className="w-full h-full aspect-square rounded-2xl overflow-hidden relative border-2 border-black/80 bg-white shadow-2xl select-none">
              
              {/* Corner 1: Red Home Base (Top-Left 6x6) */}
              <div 
                className="absolute top-0 left-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center"
                style={{ backgroundColor: '#DC2626' }}
              >
                <div className="w-full h-full bg-white rounded-xl p-[6%] grid grid-cols-2 gap-[8%] items-center justify-items-center shadow-inner">
                  {[0, 1, 2, 3].map(slotIdx => (
                    <div 
                      key={slotIdx}
                      className="w-[70%] aspect-square rounded-full flex items-center justify-center border-4"
                      style={{ borderColor: '#991B1B', backgroundColor: '#FEE2E2' }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner 2: Green Home Base (Top-Right 6x6) */}
              <div 
                className="absolute top-0 right-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center"
                style={{ backgroundColor: '#16A34A' }}
              >
                <div className="w-full h-full bg-white rounded-xl p-[6%] grid grid-cols-2 gap-[8%] items-center justify-items-center shadow-inner">
                  {[0, 1, 2, 3].map(slotIdx => (
                    <div 
                      key={slotIdx}
                      className="w-[70%] aspect-square rounded-full flex items-center justify-center border-4"
                      style={{ borderColor: '#166534', backgroundColor: '#DCFCE7' }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner 3: Blue Home Base (Bottom-Left 6x6) */}
              <div 
                className="absolute bottom-0 left-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center"
                style={{ backgroundColor: '#0284C7' }}
              >
                <div className="w-full h-full bg-white rounded-xl p-[6%] grid grid-cols-2 gap-[8%] items-center justify-items-center shadow-inner">
                  {[0, 1, 2, 3].map(slotIdx => (
                    <div 
                      key={slotIdx}
                      className="w-[70%] aspect-square rounded-full flex items-center justify-center border-4"
                      style={{ borderColor: '#075985', backgroundColor: '#E0F2FE' }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner 4: Yellow Home Base (Bottom-Right 6x6) */}
              <div 
                className="absolute bottom-0 right-0 w-[40%] h-[40%] p-[3%] flex items-center justify-center"
                style={{ backgroundColor: '#CA8A04' }}
              >
                <div className="w-full h-full bg-white rounded-xl p-[6%] grid grid-cols-2 gap-[8%] items-center justify-items-center shadow-inner">
                  {[0, 1, 2, 3].map(slotIdx => (
                    <div 
                      key={slotIdx}
                      className="w-[70%] aspect-square rounded-full flex items-center justify-center border-4"
                      style={{ borderColor: '#854D0E', backgroundColor: '#FEF9C3' }}
                    />
                  ))}
                </div>
              </div>

              {/* Center 4 Triangles (Rows 6..8, Cols 6..8 -> 20% x 20% at 40%, 40%) */}
              <svg 
                className="absolute top-[40%] left-[40%] w-[20%] h-[20%] pointer-events-none"
                viewBox="0 0 100 100"
              >
                {/* Red Left Triangle */}
                <polygon points="0,0 50,50 0,100" fill="#DC2626" />
                {/* Green Top Triangle */}
                <polygon points="0,0 50,50 100,0" fill="#16A34A" />
                {/* Yellow Right Triangle */}
                <polygon points="100,0 50,50 100,100" fill="#CA8A04" />
                {/* Blue Bottom Triangle */}
                <polygon points="0,100 50,50 100,100" fill="#0284C7" />
                {/* Center boundary cross */}
                <line x1="0" y1="0" x2="100" y2="100" stroke="#000" strokeWidth="1.5" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="#000" strokeWidth="1.5" />
              </svg>

              {/* 15x15 Track Cells Grid Overlay */}
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

                  // Corner areas (6x6 each) are covered by bases
                  const isTopLeft = row < 6 && col < 6;
                  const isTopRight = row < 6 && col >= 9;
                  const isBottomLeft = row >= 9 && col < 6;
                  const isBottomRight = row >= 9 && col >= 9;
                  const isCenter = row >= 6 && row <= 8 && col >= 6 && col <= 8;

                  if (isTopLeft || isTopRight || isBottomLeft || isBottomRight || isCenter) {
                    return <div key={idx} />;
                  }

                  // Determine cell coloring matching official board
                  let bg = 'bg-white';
                  let border = 'border-[0.5px] border-gray-400';
                  let icon = null;

                  // Green Home Run column (col 7, rows 1..5) & Start cell [1, 8]
                  if (col === 7 && row >= 1 && row <= 5) bg = 'bg-emerald-600';
                  if (row === 1 && col === 8) {
                    bg = 'bg-emerald-600';
                    icon = <ArrowDown className="w-3 h-3 text-white stroke-[3]" />;
                  }

                  // Red Home Run row (row 7, cols 1..5) & Start cell [6, 1]
                  if (row === 7 && col >= 1 && col <= 5) bg = 'bg-red-600';
                  if (row === 6 && col === 1) {
                    bg = 'bg-red-600';
                    icon = <ArrowRight className="w-3 h-3 text-white stroke-[3]" />;
                  }

                  // Yellow Home Run row (row 7, cols 9..13) & Start cell [8, 13]
                  if (row === 7 && col >= 9 && col <= 13) bg = 'bg-amber-500';
                  if (row === 8 && col === 13) {
                    bg = 'bg-amber-500';
                    icon = <ArrowLeft className="w-3 h-3 text-black stroke-[3]" />;
                  }

                  // Blue Home Run column (col 7, rows 9..13) & Start cell [13, 6]
                  if (col === 7 && row >= 9 && row <= 13) bg = 'bg-sky-600';
                  if (row === 13 && col === 6) {
                    bg = 'bg-sky-600';
                    icon = <ArrowUp className="w-3 h-3 text-white stroke-[3]" />;
                  }

                  // Safe spot stars (matching the image)
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

              {/* TOKENS RENDERED AS MAP-PIN DROPLETS (Exactly Matching Image) */}
              {tokens.map(token => {
                const [r, c] = getTokenCoords(token);
                const theme = COLOR_THEMES[token.color];
                const isCurrentTurnToken = token.color === activeColor;
                const canMove = hasRolled && !isMoving && (
                  (token.step === -1 && diceValue === 6) ||
                  (token.step >= 0 && token.step + diceValue <= 56)
                );
                const isThisMoving = activeMovingTokenId === token.id;

                // Position token via percentage
                const leftPct = (c / 15) * 100;
                const topPct = (r / 15) * 100;

                return (
                  <div
                    key={token.id}
                    onClick={() => {
                      if (isCurrentTurnToken && canMove && !isCurrentBot) {
                        moveTokenAnimated(token.id);
                      }
                    }}
                    style={{
                      left: `${leftPct + 0.6}%`,
                      top: `${topPct - 0.8}%`,
                      width: '5.6%',
                      height: '7.8%',
                      transform: isThisMoving ? 'scale(1.28) translateY(-4px)' : 'none',
                      transition: isThisMoving 
                        ? 'all 140ms cubic-bezier(0.34, 1.56, 0.64, 1)' 
                        : 'all 200ms ease-out'
                    }}
                    className={`absolute z-30 cursor-pointer flex flex-col items-center justify-center ${
                      canMove && isCurrentTurnToken && !isCurrentBot ? 'animate-bounce' : ''
                    }`}
                  >
                    {/* Droplet / Pin Token Body (3D metallic silver rim with colored center) */}
                    <div 
                      className={`w-full aspect-square rounded-full bg-white border-2 border-gray-300 shadow-[0_4px_8px_rgba(0,0,0,0.45)] flex items-center justify-center transition-transform ${
                        canMove && isCurrentTurnToken ? 'ring-2 ring-yellow-400' : ''
                      }`}
                    >
                      {/* Inner colored gem */}
                      <div 
                        className="w-[68%] aspect-square rounded-full shadow-inner border border-white/40"
                        style={{ backgroundColor: theme.bgHex }}
                      />
                    </div>
                    {/* Downward pointer triangle */}
                    <div 
                      className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] -mt-[1px]"
                      style={{ borderTopColor: '#FFFFFF' }}
                    />
                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* Right: Dice Roller, Turn HUD & Live Scoreboard */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Turn HUD Card */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 text-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Current Turn:</span>
              <span 
                className="text-xs font-bold font-mono px-2.5 py-1 rounded-full uppercase"
                style={{ 
                  backgroundColor: `${COLOR_THEMES[activeColor].bgHex}25`,
                  color: COLOR_THEMES[activeColor].bgHex,
                  border: `1px solid ${COLOR_THEMES[activeColor].bgHex}50`
                }}
              >
                {isCurrentBot ? '🤖 BOT' : '👤 PLAYER'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div 
                className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: COLOR_THEMES[activeColor].bgHex }}
              />
              <span className="text-xl font-bold text-white tracking-wide">
                {COLOR_THEMES[activeColor].name}
              </span>
            </div>

            {/* 3D Dice Display Box */}
            <div className="my-5 flex flex-col items-center">
              <button
                onClick={rollDice}
                disabled={isRolling || hasRolled || isCurrentBot || Boolean(winner) || isMoving}
                className={`w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-900 to-black border-2 border-white/20 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
                  !hasRolled && !isCurrentBot && !isMoving
                    ? 'hover:scale-105 active:scale-95 border-[#ffc16b] shadow-[0_0_25px_rgba(255,193,107,0.35)] cursor-pointer'
                    : 'opacity-80 cursor-not-allowed'
                } ${isRolling ? 'animate-spin' : ''}`}
              >
                {renderDiceIcon()}
                <span className="text-[10px] font-mono uppercase mt-2 text-gray-400 font-bold">
                  {isRolling ? 'ROLLING...' : hasRolled ? `ROLLED ${diceValue}` : 'TAP TO ROLL'}
                </span>
              </button>
            </div>

            {/* Status Announcement Message */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono font-medium text-[#ffd9a4]">
              {statusMessage}
            </div>

            {/* Turn action button */}
            {!hasRolled && !isCurrentBot && (
              <button
                onClick={rollDice}
                disabled={isRolling || isMoving}
                className="btn-cyber-primary w-full mt-4 py-2.5 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Roll Dice Now</span>
              </button>
            )}
          </div>

          {/* Squad Progress Tracker */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-300 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>Squad Base Status</span>
              <span className="text-[10px] text-gray-500">Home Goal: 4/4</span>
            </h4>

            {(['red', 'green', 'yellow', 'blue'] as PlayerColor[]).map(c => {
              const theme = COLOR_THEMES[c];
              const cTokens = tokens.filter(t => t.color === c);
              const homeCount = cTokens.filter(t => t.step === 56).length;
              const yardCount = cTokens.filter(t => t.step === -1).length;
              const activeCount = 4 - homeCount - yardCount;

              return (
                <div 
                  key={c}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    activeColor === c ? 'bg-white/10 border-white/30' : 'bg-black/30 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-white"
                      style={{ backgroundColor: theme.bgHex }}
                    />
                    <span className="text-xs font-bold text-white">{theme.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-gray-400">Yard: <b className="text-white">{yardCount}</b></span>
                    <span className="text-gray-400">Track: <b className="text-cyan-400">{activeCount}</b></span>
                    <span className="text-emerald-400 font-bold">🏆 {homeCount}/4</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
