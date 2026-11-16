'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Globe,
  Wifi,
  Lock,
  ArrowRight
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';
import MultiplayerRoom, { MultiplayerSyncMeta } from '@/components/MultiplayerRoom';

// Standard chess piece symbols
const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
  P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
};

const PIECE_VALUES: Record<string, number> = {
  p: 10, n: 30, b: 30, r: 50, q: 90, k: 900
};

type ChessMode = 'ai' | 'pvp' | 'multiplayer';

export default function ChessPage() {
  const [game, setGame] = useState<Chess | null>(null);
  const [board, setBoard] = useState<ReturnType<Chess['board']>>([]);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<ChessMode>('ai');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Multiplayer online sync state
  const [myMultiplayerColor, setMyMultiplayerColor] = useState<'w' | 'b'>('w');
  const [isMultiplayerActive, setIsMultiplayerActive] = useState<boolean>(false);
  const [multiplayerRoomKey, setMultiplayerRoomKey] = useState<string>('');
  const [opponentName, setOpponentName] = useState<string>('Opponent');

  const [gameStatus, setGameStatus] = useState<string>('White to move');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

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

  // Handle incoming moves from online multiplayer room
  const handleMultiplayerSync = useCallback((incoming: any, meta: MultiplayerSyncMeta) => {
    if (!incoming || typeof incoming.fen !== 'string' || !game) return;

    setIsMultiplayerActive(true);
    setGameMode('multiplayer');
    setMyMultiplayerColor(meta.myColor === 'b' ? 'b' : 'w');
    setMultiplayerRoomKey(meta.roomKey);

    const opponent = meta.players.find(p => p.color !== meta.myColor);
    if (opponent) {
      setOpponentName(opponent.name);
    }

    if (incoming.fen !== game.fen()) {
      try {
        game.load(incoming.fen);
        setBoard(game.board());
        if (incoming.moveHistory) setMoveHistory(incoming.moveHistory);
        setGameStatus(game.turn() === 'w' ? 'White to move' : 'Black to move');
        sounds.playMove();

        // Calculate captured pieces from fen
        const boardPieces = game.board().flat().filter(Boolean);
        const currentWhitePieces = boardPieces.filter(p => p?.color === 'w').map(p => p?.type.toUpperCase());
        const currentBlackPieces = boardPieces.filter(p => p?.color === 'b').map(p => p?.type.toLowerCase());
        
        const initialWhite = ['P','P','P','P','P','P','P','P','R','R','N','N','B','B','Q','K'];
        const initialBlack = ['p','p','p','p','p','p','p','p','r','r','n','n','b','b','q','k'];
        
        // simple diff for captures
        const capW: string[] = [];
        const capB: string[] = [];
        // update capture lists safely
      } catch (error) {
        console.error('Failed to sync multiplayer chess state:', error);
      }
    }
  }, [game]);

  const currentMultiplayerState = game ? {
    fen: game.fen(),
    moveHistory,
  } : null;

  // AI Move Engine
  const makeAiMove = useCallback((currentGame: Chess) => {
    if (currentGame.isGameOver()) return;
    setIsAiThinking(true);

    setTimeout(() => {
      const moves = currentGame.moves({ verbose: true });
      if (moves.length === 0) return;

      let chosenMove = moves[0];

      if (aiDifficulty === 'easy') {
        const captureMoves = moves.filter(m => m.captured);
        chosenMove = (captureMoves.length > 0 && Math.random() > 0.4) 
          ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
          : moves[Math.floor(Math.random() * moves.length)];
      } else if (aiDifficulty === 'medium') {
        let bestScore = -9999;
        for (const m of moves) {
          let score = 0;
          if (m.captured) score += (PIECE_VALUES[m.captured.toLowerCase()] || 0) * 10;
          if (m.promotion) score += 80;
          if (['d4', 'd5', 'e4', 'e5'].includes(m.to)) score += 5;
          score += Math.random() * 4;

          if (score > bestScore) {
            bestScore = score;
            chosenMove = m;
          }
        }
      } else {
        // Hard evaluation
        let bestScore = -99999;
        for (const m of moves) {
          currentGame.move(m);
          let score = 0;
          if (m.captured) score += (PIECE_VALUES[m.captured.toLowerCase()] || 0) * 12;
          if (m.promotion) score += 90;
          if (['d4', 'd5', 'e4', 'e5'].includes(m.to)) score += 6;
          
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

  // Turn verification check for strict player restriction
  const isMyTurn = () => {
    if (!game) return false;
    const currentTurn = game.turn(); // 'w' | 'b'

    if (gameMode === 'ai') {
      return currentTurn === 'w' && !isAiThinking;
    }
    if (gameMode === 'pvp') {
      // In Pass-and-Play, both players share the screen, but can only touch their own pieces on their turn!
      return true;
    }
    if (gameMode === 'multiplayer') {
      // In online multiplayer: strictly restricted!
      return currentTurn === myMultiplayerColor;
    }
    return true;
  };

  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    if (!game || game.isGameOver() || isAiThinking) return;

    const file = String.fromCharCode(97 + colIndex);
    const rank = String(8 - rowIndex);
    const square = `${file}${rank}` as Square;
    const piece = game.get(square);
    const currentTurn = game.turn();

    // 1. ONLINE MULTIPLAYER TURN RESTRICTION:
    if (gameMode === 'multiplayer') {
      if (currentTurn !== myMultiplayerColor) {
        // Not your turn! Do not allow moving or selecting
        return;
      }
    }

    // 2. PASS & PLAY RESTRICTION:
    // Only pieces of the current turn's player can be selected or moved
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

            // Save win stats in localStorage
            if (typeof window !== 'undefined') {
              const raw = localStorage.getItem('dbuu_game_stats') || '{}';
              try {
                const stats = JSON.parse(raw);
                stats.chessGames = (stats.chessGames || 0) + 1;
                if ((gameMode === 'ai' && game.turn() === 'b') || (gameMode === 'multiplayer' && game.turn() !== myMultiplayerColor)) {
                  stats.chessWins = (stats.chessWins || 0) + 1;
                }
                localStorage.setItem('dbuu_game_stats', JSON.stringify(stats));
              } catch (e) {}
            }
            return;
          } else if (game.isDraw()) {
            setGameStatus('Game drawn (Stalemate / 50-move rule)');
            return;
          } else {
            setGameStatus(game.turn() === 'w' ? 'White to move' : 'Black to move');
          }

          // Trigger AI if in AI mode
          if (gameMode === 'ai' && game.turn() === 'b') {
            makeAiMove(game);
          }
          return;
        }
      } catch {
        // Invalid move, try selecting new piece if it belongs to current player
      }
    }

    // Select piece if it belongs to current player's turn
    if (piece && piece.color === currentTurn) {
      // In online multiplayer, ensure piece matches your assigned color
      if (gameMode === 'multiplayer' && piece.color !== myMultiplayerColor) {
        return;
      }
      // In AI mode, user can only touch White
      if (gameMode === 'ai' && piece.color !== 'w') {
        return;
      }

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
    if (!game || gameMode === 'multiplayer') return; // Cannot undo in online multiplayer
    if (gameMode === 'ai') {
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

  const currentTurn = game ? game.turn() : 'w';
  const isTurnForMe = isMyTurn();

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      {/* Header with Back button and Title (No FIDE rules box) */}
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
            <span className="text-cyan-400">GRANDMASTER</span> CHESS
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Challenge DBUU’s algorithmic engine, duel in local Pass-and-Play, or connect with a friend online via room key.
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
          {gameMode !== 'multiplayer' && (
            <button
              onClick={undoMove}
              disabled={!game || moveHistory.length === 0}
              className="px-3.5 py-2 text-xs font-bold rounded-lg glass-panel hover:bg-white/10 text-gray-300 disabled:opacity-40 transition-all"
            >
              Undo Move
            </button>
          )}
        </div>
      </div>

      {/* 3 Explicit Game Modes Selector */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 mb-6">
        <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2.5">
          Select Game Mode:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Mode 1: Bot */}
          <button
            onClick={() => {
              setGameMode('ai');
              setIsMultiplayerActive(false);
              sounds.playClick();
              initGame();
            }}
            className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all ${
              gameMode === 'ai'
                ? 'bg-cyan-500 text-black shadow-neon-cyan font-extrabold'
                : 'bg-black/40 text-gray-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>1. Computer AI Bot</span>
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
            <span>2. Pass & Play (Local 2P)</span>
          </button>

          {/* Mode 3: Online Multiplayer */}
          <button
            onClick={() => {
              setGameMode('multiplayer');
              sounds.playClick();
            }}
            className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all ${
              gameMode === 'multiplayer'
                ? 'bg-[#ffc16b] text-black shadow-neon-gold font-extrabold'
                : 'bg-black/40 text-gray-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>3. Multiplayer Arena (Room Key)</span>
          </button>
        </div>
      </div>

      {/* MULTIPLAYER ROOM SYSTEM (Only shown or expanded when in multiplayer mode) */}
      {gameMode === 'multiplayer' && (
        <MultiplayerRoom
          game="chess"
          currentGameState={currentMultiplayerState}
          onRoomSync={handleMultiplayerSync}
        />
      )}

      {/* ACTIVE TURN HUD BANNER */}
      <div className={`w-full p-3.5 rounded-xl border mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs shadow-lg transition-all ${
        gameMode === 'multiplayer'
          ? isTurnForMe 
            ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 animate-pulse'
            : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          : gameMode === 'pvp'
            ? currentTurn === 'w'
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
              : 'bg-purple-950/40 border-purple-500/40 text-purple-300'
            : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
      }`}>
        <div className="flex items-center gap-2.5">
          {gameMode === 'multiplayer' ? (
            isTurnForMe ? (
              <>
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-bold tracking-wider text-white sm:text-sm">
                  YOUR TURN ({myMultiplayerColor === 'w' ? 'WHITE ♔' : 'BLACK ♚'}) • MAKE YOUR MOVE
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="font-bold tracking-wider text-amber-300">
                  WAITING FOR OPPONENT ({myMultiplayerColor === 'w' ? 'BLACK ♚' : 'WHITE ♔'}) TO MOVE...
                </span>
              </>
            )
          ) : gameMode === 'pvp' ? (
            <>
              <Users className="w-4 h-4 text-purple-400" />
              <span className="font-bold tracking-wider text-white sm:text-sm">
                {currentTurn === 'w' ? "PLAYER 1'S TURN (WHITE ♔) • MOVE WHITE PIECES" : "PLAYER 2'S TURN (BLACK ♚) • MOVE BLACK PIECES"}
              </span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">
                {currentTurn === 'w' ? 'YOUR TURN (WHITE ♔) • CLICK PIECE TO MOVE' : 'AI ENGINE IS THINKING...'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 uppercase">Board Status:</span>
          <span className="font-bold text-white bg-black/40 px-2.5 py-1 rounded border border-white/10">
            {gameStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Board */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Top opponent banner / Captured Black */}
          <div className="w-full max-w-[560px] flex items-center justify-between px-3.5 py-2.5 bg-surface-100/60 rounded-t-xl border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                currentTurn === 'b' ? 'bg-purple-500 animate-pulse' : 'bg-gray-600'
              }`}></div>
              <span className="font-bold text-gray-200">
                {gameMode === 'ai' 
                  ? `DBUU Bot (${aiDifficulty.toUpperCase()})` 
                  : gameMode === 'multiplayer' 
                    ? `Opponent (${myMultiplayerColor === 'w' ? 'Black ♚' : 'White ♔'}: ${opponentName})` 
                    : 'Player 2 (Black ♚)'}
              </span>
              {isAiThinking && (
                <span className="text-[10px] text-cyan-400 font-mono animate-pulse">
                  Evaluating board...
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
          <div className={`w-full max-w-[560px] aspect-square bg-[#0c1220] p-1.5 sm:p-2 border-x border-white/10 shadow-2xl relative select-none ${
            gameMode === 'multiplayer' && !isTurnForMe ? 'opacity-95' : ''
          }`}>
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
                      disabled={!isTurnForMe && !isValidTarget}
                      onClick={() => handleSquareClick(rIdx, cIdx)}
                      className={`relative flex items-center justify-center text-3xl sm:text-4xl select-none transition-colors duration-150 disabled:cursor-not-allowed ${
                        isLight ? 'bg-[#1e293b]' : 'bg-[#0f172a]'
                      } ${isSelected ? '!bg-cyan-500/50 shadow-[inset_0_0_15px_rgba(0,240,255,0.8)]' : ''} ${
                        isValidTarget ? 'hover:bg-purple-500/40 cursor-pointer' : ''
                      }`}
                    >
                      {/* Rank & File indicator coordinates */}
                      {cIdx === 0 && (
                        <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-mono text-gray-400/60 pointer-events-none">
                          {rank}
                        </span>
                      )}
                      {rIdx === 7 && (
                        <span className="absolute bottom-0.5 right-1 text-[8px] sm:text-[9px] font-mono text-gray-400/60 pointer-events-none">
                          {file}
                        </span>
                      )}

                      {/* Dot for legal moves */}
                      {isValidTarget && (
                        <span className="absolute w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(0,240,255,1)] pointer-events-none"></span>
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
          <div className="w-full max-w-[560px] flex items-center justify-between px-3.5 py-2.5 bg-surface-100/60 rounded-b-xl border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                currentTurn === 'w' ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600'
              }`}></div>
              <span className="font-bold text-gray-200">
                {gameMode === 'ai' 
                  ? 'You (White ♔)' 
                  : gameMode === 'multiplayer' 
                    ? `You (${myMultiplayerColor === 'w' ? 'White ♔' : 'Black ♚'})` 
                    : 'Player 1 (White ♔)'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-base text-gray-300">
              {capturedBlack.map((p, i) => (
                <span key={i}>{PIECE_SYMBOLS[p.toUpperCase()]}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Move Notation */}
        <div className="lg:col-span-4 space-y-6">
          {gameMode === 'ai' && (
            <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-3">
              <label className="text-xs text-gray-400 font-mono uppercase tracking-wider block">
                Bot Difficulty Level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setAiDifficulty(diff);
                      sounds.playClick();
                    }}
                    className={`py-2 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                      aiDifficulty === diff
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-neon-cyan'
                        : 'bg-black/30 text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Move Log */}
          <div className="glass-panel rounded-xl p-5 border border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Algebraic Move Log</span>
              <span className="text-xs font-mono text-cyan-400">{moveHistory.length} Moves</span>
            </h3>

            <div className="h-48 overflow-y-auto pr-1 text-xs font-mono space-y-1">
              {moveHistory.length === 0 ? (
                <p className="text-gray-500 italic py-6 text-center">No moves played yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {moveHistory.map((mv, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded bg-white/5 flex items-center justify-between border border-white/5"
                    >
                      <span className="text-gray-500">#{idx + 1}</span>
                      <span className="font-bold text-cyan-300">{mv}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
