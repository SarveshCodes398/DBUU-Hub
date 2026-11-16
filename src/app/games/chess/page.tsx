'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Chess, Square } from 'chess.js';
import { 
  Trophy, 
  RotateCcw, 
  Bot, 
  Users, 
  ChevronLeft, 
  Award, 
  Sparkles, 
  Zap, 
  HelpCircle,
  Play
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';
import MultiplayerRoom from '@/components/MultiplayerRoom';

// Standard chess piece symbols
const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
  P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
};

const PIECE_VALUES: Record<string, number> = {
  p: 10, n: 30, b: 30, r: 50, q: 90, k: 900
};

export default function ChessPage() {
  const [game, setGame] = useState<Chess | null>(null);
  const [board, setBoard] = useState<(any)[][]>([]);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<'ai' | 'pvp'>('ai');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [gameStatus, setGameStatus] = useState<string>('Game in progress');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Sync with multiplayer room key
  const handleMultiplayerSync = useCallback((incoming: any, isHost: boolean) => {
    if (!incoming || !incoming.fen || !game) return;
    if (incoming.fen !== game.fen()) {
      try {
        game.load(incoming.fen);
        setBoard(game.board());
        if (incoming.moveHistory) setMoveHistory(incoming.moveHistory);
        setGameStatus(game.turn() === 'w' ? 'White to move' : 'Black to move');
        sounds.playMove();
      } catch (e) {}
    }
  }, [game]);

  const currentMultiplayerState = game ? {
    fen: game.fen(),
    moveHistory,
  } : null;

  // Initialize game
  const initGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setBoard(newGame.board());
    setSelectedSquare(null);
    setValidMoves([]);
    setMoveHistory([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setGameStatus('White to move');
    setIsAiThinking(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // AI Move Engine
  const makeAiMove = useCallback((currentGame: Chess) => {
    if (currentGame.isGameOver()) return;
    setIsAiThinking(true);

    setTimeout(() => {
      const moves = currentGame.moves({ verbose: true });
      if (moves.length === 0) return;

      let chosenMove = moves[0];

      if (aiDifficulty === 'easy') {
        // Random move with slight capture bias
        const captureMoves = moves.filter(m => m.captured);
        chosenMove = (captureMoves.length > 0 && Math.random() > 0.4) 
          ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
          : moves[Math.floor(Math.random() * moves.length)];
      } else if (aiDifficulty === 'medium') {
        // Material evaluation 1-ply
        let bestScore = -9999;
        for (const m of moves) {
          let score = 0;
          if (m.captured) score += (PIECE_VALUES[m.captured.toLowerCase()] || 0) * 10;
          if (m.promotion) score += 80;
          // Center control bonus
          if (['d4', 'd5', 'e4', 'e5'].includes(m.to)) score += 5;
          score += Math.random() * 4; // slight jitter

          if (score > bestScore) {
            bestScore = score;
            chosenMove = m;
          }
        }
      } else {
        // Hard: 2-ply Minimax evaluation
        let bestScore = -99999;
        for (const m of moves) {
          currentGame.move(m);
          let score = 0;
          if (m.captured) score += (PIECE_VALUES[m.captured.toLowerCase()] || 0) * 12;
          if (m.promotion) score += 90;
          if (['d4', 'd5', 'e4', 'e5'].includes(m.to)) score += 6;
          
          // Opponent replies evaluation
          const opponentMoves = currentGame.moves({ verbose: true });
          let oppMaxGain = 0;
          for (const oppM of opponentMoves) {
            if (oppM.captured) {
              const capVal = (PIECE_VALUES[oppM.captured.toLowerCase()] || 0) * 12;
              if (capVal > oppMaxGain) oppMaxGain = capVal;
            }
          }
          score -= oppMaxGain;
          currentGame.undo();

          if (score > bestScore) {
            bestScore = score;
            chosenMove = m;
          }
        }
      }

      currentGame.move(chosenMove);
      sounds.playMove();

      // Check captured
      if (chosenMove.captured) {
        if (chosenMove.color === 'w') {
          setCapturedBlack(prev => [...prev, chosenMove.captured!]);
        } else {
          setCapturedWhite(prev => [...prev, chosenMove.captured!]);
        }
      }

      setBoard(currentGame.board());
      setMoveHistory(prev => [...prev, chosenMove.san]);
      setIsAiThinking(false);

      // Status check
      if (currentGame.isCheckmate()) {
        setGameStatus('Checkmate! Black wins.');
        sounds.playError();
      } else if (currentGame.isDraw()) {
        setGameStatus('Game drawn (Stalemate / Insufficient material)');
      } else {
        setGameStatus(currentGame.turn() === 'w' ? 'White to move' : 'Black to move');
      }
    }, 450);
  }, [aiDifficulty]);

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    if (!game || game.isGameOver() || isAiThinking) return;

    const file = String.fromCharCode(97 + colIndex);
    const rank = String(8 - rowIndex);
    const square = `${file}${rank}` as Square;
    const piece = game.get(square);

    // If square is already selected and clicked another square
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // Try making move
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q',
        });

        if (move) {
          sounds.playMove();
          if (move.captured) {
            if (move.color === 'w') {
              setCapturedBlack(prev => [...prev, move.captured!]);
            } else {
              setCapturedWhite(prev => [...prev, move.captured!]);
            }
          }

          setBoard(game.board());
          setMoveHistory(prev => [...prev, move.san]);
          setSelectedSquare(null);
          setValidMoves([]);

          // Check win / status
          if (game.isCheckmate()) {
            setGameStatus(`Checkmate! ${game.turn() === 'b' ? 'White' : 'Black'} wins!`);
            sounds.playSuccess();
            triggerConfetti();
            return;
          } else if (game.isDraw()) {
            setGameStatus('Game drawn (Stalemate / 50-move rule)');
            return;
          } else {
            setGameStatus(game.turn() === 'w' ? 'White to move' : 'Black to move');
          }

          // Trigger AI if in AI mode and it's AI turn
          if (gameMode === 'ai' && game.turn() !== playerColor) {
            makeAiMove(game);
          }
          return;
        }
      } catch (err) {
        // Invalid move, ignore or re-select if clicking own piece
      }
    }

    // Select piece if it belongs to current player's turn
    if (piece && piece.color === game.turn()) {
      // In AI mode, prevent moving opponent pieces manually
      if (gameMode === 'ai' && piece.color !== playerColor) return;

      setSelectedSquare(square);
      const legalMoves = game.moves({ square, verbose: true });
      setValidMoves(legalMoves.map(m => m.to));
      sounds.playClick();
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  const undoMove = () => {
    if (!game) return;
    if (gameMode === 'ai') {
      // Undo both AI and player moves
      game.undo();
      game.undo();
    } else {
      game.undo();
    }
    setBoard(game.board());
    setMoveHistory(game.history());
    setSelectedSquare(null);
    setValidMoves([]);
    setGameStatus(game.turn() === 'w' ? 'White to move' : 'Black to move');
    sounds.playClick();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header breadcrumb & info */}
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
            <span className="text-cyan-400">GRANDMASTER</span> CHESS
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono">
              FIDE RULES
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Battle against DBUU’s algorithmic chess engine or duel locally with a fellow student.
          </p>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={initGame}
            className="btn-cyber-primary px-3.5 py-2 text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Match
          </button>
          <button
            onClick={undoMove}
            disabled={!game || moveHistory.length === 0}
            className="px-3.5 py-2 text-xs font-bold rounded-lg glass-panel hover:bg-white/10 text-gray-300 disabled:opacity-40 transition-all"
          >
            Undo Move
          </button>
        </div>
      </div>

      {/* MULTIPLAYER ROOM SYSTEM */}
      <MultiplayerRoom
        game="chess"
        currentGameState={currentMultiplayerState}
        onRoomSync={handleMultiplayerSync}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Board */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Top opponent banner / Captured Black */}
          <div className="w-full max-w-[560px] flex items-center justify-between px-3 py-2 bg-surface-100/60 rounded-t-xl border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="font-bold text-gray-200">
                {gameMode === 'ai' ? `Engine Bot (${aiDifficulty.toUpperCase()})` : 'Player 2 (Black)'}
              </span>
              {isAiThinking && (
                <span className="text-[10px] text-cyan-400 font-mono animate-pulse">
                  Analyzing moves...
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-base text-gray-300">
              {capturedWhite.map((p, i) => (
                <span key={i}>{PIECE_SYMBOLS[p.toLowerCase()]}</span>
              ))}
            </div>
          </div>

          {/* 8x8 Chessboard Grid */}
          <div className="w-full max-w-[560px] aspect-square bg-[#0c1220] p-2 border-x border-white/10 shadow-2xl relative">
            <div className="w-full h-full grid grid-cols-8 grid-rows-8 border border-cyan-500/30">
              {board.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const file = String.fromCharCode(97 + cIdx);
                  const rank = String(8 - rIdx);
                  const sqName = `${file}${rank}`;
                  const isLight = (rIdx + cIdx) % 2 === 0;
                  const isSelected = selectedSquare === sqName;
                  const isValidTarget = validMoves.includes(sqName);

                  return (
                    <button
                      key={sqName}
                      onClick={() => handleSquareClick(rIdx, cIdx)}
                      className={`relative flex items-center justify-center text-3xl sm:text-4xl select-none transition-colors duration-150 ${
                        isLight ? 'bg-[#1e293b]' : 'bg-[#0f172a]'
                      } ${isSelected ? '!bg-cyan-500/50 shadow-[inset_0_0_15px_rgba(0,240,255,0.8)]' : ''} ${
                        isValidTarget ? 'hover:bg-purple-500/40 cursor-pointer' : ''
                      }`}
                    >
                      {/* Rank & File indicator coordinates */}
                      {cIdx === 0 && (
                        <span className="absolute top-0.5 left-1 text-[9px] font-mono text-gray-400/60 pointer-events-none">
                          {rank}
                        </span>
                      )}
                      {rIdx === 7 && (
                        <span className="absolute bottom-0.5 right-1 text-[9px] font-mono text-gray-400/60 pointer-events-none">
                          {file}
                        </span>
                      )}

                      {/* Green dot for legal moves */}
                      {isValidTarget && (
                        <span className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(0,240,255,1)] pointer-events-none"></span>
                      )}

                      {/* Piece render */}
                      {cell && (
                        <span
                          className={`z-10 font-serif drop-shadow-md transition-transform active:scale-95 ${
                            cell.color === 'w' ? 'text-white' : 'text-cyan-300'
                          }`}
                        >
                          {PIECE_SYMBOLS[cell.color === 'w' ? cell.type.toUpperCase() : cell.type.toLowerCase()]}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom player banner / Captured White */}
          <div className="w-full max-w-[560px] flex items-center justify-between px-3 py-2 bg-surface-100/60 rounded-b-xl border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span className="font-bold text-gray-200">
                {gameMode === 'ai' ? 'You (White)' : 'Player 1 (White)'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-base text-gray-300">
              {capturedBlack.map((p, i) => (
                <span key={i}>{PIECE_SYMBOLS[p.toUpperCase()]}</span>
              ))}
            </div>
          </div>

          {/* Game status banner */}
          <div className="w-full max-w-[560px] mt-4 px-4 py-2.5 rounded-lg glass-panel flex items-center justify-between border-cyan-500/20">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
              CURRENT STATUS:
            </span>
            <span className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              {gameStatus}
            </span>
          </div>
        </div>

        {/* Right Column: Settings & History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mode Selector */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Game Configuration
            </h3>

            <div>
              <label className="text-xs text-gray-400 block mb-2">Select Opponent Mode:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setGameMode('ai');
                    sounds.playClick();
                    initGame();
                  }}
                  className={`p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    gameMode === 'ai'
                      ? 'bg-cyan-500 text-black shadow-neon-cyan'
                      : 'bg-surface-100 text-gray-300 hover:bg-surface-200 border border-white/5'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  Computer AI
                </button>
                <button
                  onClick={() => {
                    setGameMode('pvp');
                    sounds.playClick();
                    initGame();
                  }}
                  className={`p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    gameMode === 'pvp'
                      ? 'bg-purple-600 text-white shadow-neon-purple'
                      : 'bg-surface-100 text-gray-300 hover:bg-surface-200 border border-white/5'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Pass & Play
                </button>
              </div>
            </div>

            {gameMode === 'ai' && (
              <div>
                <label className="text-xs text-gray-400 block mb-2">AI Difficulty Level:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => {
                        setAiDifficulty(diff);
                        sounds.playClick();
                      }}
                      className={`py-1.5 rounded-md text-xs font-mono uppercase font-bold transition-all ${
                        aiDifficulty === diff
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-400'
                          : 'bg-surface-100 text-gray-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Move Log */}
          <div className="glass-panel rounded-xl p-5 border border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Live Algebraic Notation</span>
              <span className="text-xs font-mono text-cyan-400">{moveHistory.length} Moves</span>
            </h3>

            <div className="h-44 overflow-y-auto pr-1 text-xs font-mono space-y-1">
              {moveHistory.length === 0 ? (
                <p className="text-gray-500 italic py-4 text-center">No moves played yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {moveHistory.map((mv, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 rounded bg-surface-100/70 border border-white/5 flex items-center justify-between"
                    >
                      <span className="text-gray-500">#{idx + 1}</span>
                      <span className="text-cyan-300 font-bold">{mv}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Strategy Tip Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-purple-950/30 border border-cyan-500/20 text-xs text-gray-300 flex items-start gap-3">
            <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Grandmaster Tip:</strong> Control the center four squares (e4, d4, e5, d5) early. Castle your king to safety before initiating flank attacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
