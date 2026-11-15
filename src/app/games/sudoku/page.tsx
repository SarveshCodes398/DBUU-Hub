'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  RotateCcw, 
  Lightbulb, 
  Pencil, 
  Eraser, 
  Timer, 
  AlertCircle, 
  CheckCircle2, 
  Trophy,
  Sparkles
} from 'lucide-react';
import { sounds, triggerConfetti } from '@/lib/utils';

// Sample verified Sudoku boards with solutions
const SUDOKU_DATA = {
  easy: {
    initial: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ]
  },
  medium: {
    initial: [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0]
    ],
    solution: [
      [4, 3, 5, 2, 6, 9, 7, 8, 1],
      [6, 8, 2, 5, 7, 1, 4, 9, 3],
      [1, 9, 7, 8, 3, 4, 5, 6, 2],
      [8, 2, 6, 1, 9, 5, 3, 4, 7],
      [3, 7, 4, 6, 8, 2, 9, 1, 5],
      [9, 5, 1, 7, 4, 3, 6, 2, 8],
      [5, 1, 9, 3, 2, 6, 8, 7, 4],
      [2, 4, 8, 9, 5, 7, 1, 3, 6],
      [7, 6, 3, 4, 1, 8, 2, 5, 9]
    ]
  },
  hard: {
    initial: [
      [0, 0, 0, 6, 0, 0, 4, 0, 0],
      [7, 0, 0, 0, 0, 3, 6, 0, 0],
      [0, 0, 0, 0, 9, 1, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 1, 8, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 6, 0, 4, 5],
      [0, 4, 0, 2, 0, 0, 0, 6, 0],
      [9, 0, 3, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 1, 0, 0]
    ],
    solution: [
      [5, 8, 1, 6, 7, 2, 4, 3, 9],
      [7, 9, 2, 8, 4, 3, 6, 5, 1],
      [3, 6, 4, 5, 9, 1, 7, 8, 2],
      [4, 3, 8, 9, 5, 7, 2, 1, 6],
      [2, 5, 6, 1, 8, 4, 9, 7, 3],
      [1, 7, 9, 3, 2, 6, 8, 4, 5],
      [8, 4, 5, 2, 1, 9, 3, 6, 7],
      [9, 1, 3, 7, 6, 8, 5, 2, 4],
      [6, 2, 7, 4, 3, 5, 1, 9, 8]
    ]
  }
};

type Difficulty = 'easy' | 'medium' | 'hard';

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [grid, setGrid] = useState<number[][]>([]);
  const [initialMask, setInitialMask] = useState<boolean[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState<Record<string, number[]>>({});
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);

  // Initialize board
  const startNewGame = useCallback((diff: Difficulty) => {
    const data = SUDOKU_DATA[diff];
    const initialCopy = data.initial.map(row => [...row]);
    const mask = data.initial.map(row => row.map(cell => cell !== 0));
    setGrid(initialCopy);
    setInitialMask(mask);
    setSelectedCell(null);
    setNotes({});
    setMistakes(0);
    setSeconds(0);
    setIsCompleted(false);
    setHintsRemaining(3);
    sounds.playClick();
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell([r, c]);
    sounds.playClick();
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isCompleted) return;
    const [r, c] = selectedCell;

    // Cannot edit pre-filled cells
    if (initialMask[r]?.[c]) return;

    if (notesMode) {
      // Toggle pencil note
      const key = `${r}-${c}`;
      const curNotes = notes[key] || [];
      const updated = curNotes.includes(num)
        ? curNotes.filter(n => n !== num)
        : [...curNotes, num].sort();
      setNotes({ ...notes, [key]: updated });
      sounds.playClick();
      return;
    }

    // Direct value entry
    const solution = SUDOKU_DATA[difficulty].solution;
    const isCorrect = solution[r][c] === num;

    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);

    if (isCorrect) {
      sounds.playMove();
      // Remove notes for this cell
      const newNotes = { ...notes };
      delete newNotes[`${r}-${c}`];
      setNotes(newNotes);

      // Check complete
      const allFilled = newGrid.every((row, ri) =>
        row.every((val, ci) => val === solution[ri][ci])
      );

      if (allFilled) {
        setIsCompleted(true);
        sounds.playSuccess();
        triggerConfetti();
      }
    } else {
      sounds.playError();
      setMistakes(m => m + 1);
    }
  };

  const handleErase = () => {
    if (!selectedCell || isCompleted) return;
    const [r, c] = selectedCell;
    if (initialMask[r]?.[c]) return;

    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = 0;
    setGrid(newGrid);

    const newNotes = { ...notes };
    delete newNotes[`${r}-${c}`];
    setNotes(newNotes);
    sounds.playClick();
  };

  const handleHint = () => {
    if (!selectedCell || hintsRemaining <= 0 || isCompleted) return;
    const [r, c] = selectedCell;
    if (initialMask[r]?.[c]) return;

    const solution = SUDOKU_DATA[difficulty].solution;
    const correctVal = solution[r][c];

    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = correctVal;
    setGrid(newGrid);
    setHintsRemaining(h => h - 1);
    sounds.playSuccess();
  };

  const selectedVal = selectedCell ? grid[selectedCell[0]][selectedCell[1]] : 0;

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
            <span className="text-cyan-400">QUANTUM</span> SUDOKU
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono uppercase">
              {difficulty}
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Challenge your logical deduction matrix. Fill every row, column and 3x3 box with digits 1-9.
          </p>
        </div>

        {/* Difficulties */}
        <div className="flex items-center gap-2">
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
                startNewGame(d);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                difficulty === d
                  ? 'bg-cyan-500 text-black shadow-neon-cyan'
                  : 'glass-panel text-gray-300 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 9x9 Sudoku Grid */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Status bar: Timer & Mistakes */}
          <div className="w-full max-w-[500px] flex items-center justify-between px-4 py-2.5 bg-surface-100 rounded-t-xl border border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Timer className="w-4 h-4" />
              <span>{formatTime(seconds)}</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <AlertCircle className="w-4 h-4" />
              <span>Mistakes: {mistakes}/3</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hints: {hintsRemaining}</span>
            </div>
          </div>

          {/* 9x9 Grid */}
          <div className="w-full max-w-[500px] aspect-square bg-[#080D1A] p-2 border-x border-b border-white/10 shadow-2xl rounded-b-xl">
            <div className="w-full h-full grid grid-cols-9 grid-rows-9 border-2 border-cyan-500/50">
              {grid.map((row, r) =>
                row.map((val, c) => {
                  const isPreFilled = initialMask[r]?.[c];
                  const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                  const isSameValue = selectedVal > 0 && val === selectedVal;
                  const isSameRowCol = selectedCell && (selectedCell[0] === r || selectedCell[1] === c);
                  
                  const borderRight = (c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 border-r-cyan-500/40' : 'border-r border-r-white/10';
                  const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 border-b-cyan-500/40' : 'border-b border-b-white/10';

                  const cellNotes = notes[`${r}-${c}`] || [];

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`relative flex items-center justify-center font-bold text-lg sm:text-xl transition-colors duration-100 ${borderRight} ${borderBottom} ${
                        isSelected
                          ? 'bg-cyan-500/40 text-white shadow-[inset_0_0_12px_rgba(0,240,255,0.8)]'
                          : isSameValue
                          ? 'bg-cyan-950/40 text-cyan-300'
                          : isSameRowCol
                          ? 'bg-surface-100/50'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {val > 0 ? (
                        <span className={isPreFilled ? 'text-white font-extrabold' : 'text-cyan-400'}>
                          {val}
                        </span>
                      ) : cellNotes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-0.5 text-[8px] sm:text-[9px] font-mono text-gray-400 leading-none">
                          {[1,2,3,4,5,6,7,8,9].map(n => (
                            <span key={n} className="w-2.5 h-2.5 flex items-center justify-center">
                              {cellNotes.includes(n) ? n : ''}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Victory Modal Overlay */}
          {isCompleted && (
            <div className="w-full max-w-[500px] mt-4 p-5 rounded-xl bg-gradient-to-r from-cyan-950 via-emerald-950 to-purple-950 border border-emerald-500/50 text-center space-y-2 animate-bounce">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-lg">
                <Trophy className="w-6 h-6" />
                CONGRATULATIONS! MATRIX SOLVED!
              </div>
              <p className="text-xs text-gray-300">
                You conquered the {difficulty} puzzle in <strong>{formatTime(seconds)}</strong> with {mistakes} mistakes!
              </p>
              <button
                onClick={() => startNewGame(difficulty)}
                className="btn-cyber-primary px-4 py-2 text-xs font-bold mt-2"
              >
                Play Another Matrix
              </button>
            </div>
          )}
        </div>

        {/* Right: Keypad & Action Tools */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Toolbar */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Sudoku Toolkit</h3>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setNotesMode(!notesMode);
                  sounds.playClick();
                }}
                className={`p-3 rounded-lg flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                  notesMode
                    ? 'bg-purple-600 text-white shadow-neon-purple'
                    : 'bg-surface-100 text-gray-300 hover:bg-surface-200 border border-white/5'
                }`}
              >
                <Pencil className="w-4 h-4" />
                <span>Notes {notesMode ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={handleErase}
                className="p-3 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/5 text-gray-300 hover:text-white flex flex-col items-center gap-1.5 transition-all text-xs font-bold"
              >
                <Eraser className="w-4 h-4" />
                <span>Erase</span>
              </button>

              <button
                onClick={handleHint}
                disabled={hintsRemaining <= 0 || !selectedCell}
                className="p-3 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/5 text-amber-300 disabled:opacity-40 flex flex-col items-center gap-1.5 transition-all text-xs font-bold"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Hint ({hintsRemaining})</span>
              </button>
            </div>
          </div>

          {/* 1-9 Number Keypad */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-3">
            <span className="text-xs font-mono uppercase text-gray-400 block">Digit Input:</span>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="h-14 rounded-xl bg-surface-100 hover:bg-cyan-500/20 active:scale-95 border border-white/10 text-xl font-bold font-mono text-cyan-300 hover:text-white hover:border-cyan-400 transition-all shadow-md"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Quick tips */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-gray-300 space-y-1">
            <span className="font-bold text-cyan-400 block">Pro Technique: Naked Singles</span>
            <p className="text-gray-400 leading-relaxed">
              Scan rows and columns with 7 or 8 cells filled first. The remaining 1 or 2 digits can be determined immediately!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
