'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Users, Sparkles, Key, LogIn, Wifi, AlertCircle, RefreshCw } from 'lucide-react';
import { sounds } from '@/lib/utils';

export interface MultiplayerRoomProps {
  game: 'ludo' | 'chess' | 'sudoku' | 'maths';
  onRoomSync?: (roomData: any, isHost: boolean) => void;
  currentGameState?: any;
}

export default function MultiplayerRoom({ game, onRoomSync, currentGameState }: MultiplayerRoomProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [roomKey, setRoomKey] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'waiting' | 'connected'>('idle');
  const [opponentName, setOpponentName] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);

  // Poll for opponent joining / moves
  useEffect(() => {
    if (!roomKey || status === 'idle') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/multiplayer?roomKey=${encodeURIComponent(roomKey)}`);
        const data = await res.json();

        if (res.ok && data.success && data.room) {
          const room = data.room;
          if (room.status === 'active') {
            setStatus('connected');
            setOpponentName(isHost ? room.guestName || 'Opponent' : room.hostName || 'Host');
          }

          if (onRoomSync && room.gameState) {
            onRoomSync(room.gameState, isHost);
          }
        }
      } catch (err) {
        // silent polling catch
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [roomKey, status, isHost, onRoomSync]);

  // Sync state changes from parent to API if room is connected
  useEffect(() => {
    if (status === 'connected' && roomKey && currentGameState) {
      fetch('/api/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          roomKey,
          gameState: currentGameState,
          moveBy: playerName || (isHost ? 'Host' : 'Guest')
        })
      }).catch(() => {});
    }
  }, [currentGameState, status, roomKey, playerName, isHost]);

  // Create Room
  const handleCreateRoom = async () => {
    setError('');
    setLoading(true);
    sounds.playClick();

    try {
      const res = await fetch('/api/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          game,
          hostName: playerName.trim() || 'Host Student',
          initialState: currentGameState || {}
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create room key');
        setLoading(false);
        return;
      }

      setRoomKey(data.roomKey);
      setIsHost(true);
      setStatus('waiting');
      setLoading(false);
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  // Join Room
  const handleJoinRoom = async () => {
    if (!inputKey.trim()) {
      setError('Please paste a valid Room Key');
      return;
    }

    setError('');
    setLoading(true);
    sounds.playClick();

    try {
      const res = await fetch('/api/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          roomKey: inputKey.trim().toUpperCase(),
          guestName: playerName.trim() || 'Challenger Student'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Room not found or expired');
        setLoading(false);
        return;
      }

      setRoomKey(data.roomKey);
      setIsHost(false);
      setStatus('connected');
      setOpponentName(data.room.hostName || 'Host');
      setLoading(false);

      if (onRoomSync && data.room.gameState) {
        onRoomSync(data.room.gameState, false);
      }
    } catch (err) {
      setError('Failed to join room key');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!roomKey) return;
    navigator.clipboard.writeText(roomKey);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 sm:p-6 border border-[#ffc16b]/30 shadow-[0_0_25px_rgba(255,193,107,0.12)] mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#ffc16b]/15 text-[#ffc16b] border border-[#ffc16b]/30">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Multiplayer Arena</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                ROOM KEY SYSTEM
              </span>
            </h3>
            <p className="text-xs text-gray-400">Host creates a key, opponent joins with key to duel in real-time</p>
          </div>
        </div>

        {status === 'connected' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold animate-pulse">
            <Wifi className="w-3.5 h-3.5" />
            <span>PLAYING VS {opponentName.toUpperCase()}</span>
          </div>
        ) : status === 'waiting' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>WAITING FOR OPPONENT...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => { setActiveTab('create'); sounds.playClick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'create'
                  ? 'bg-[#ffc16b] text-black font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              CREATE KEY
            </button>
            <button
              onClick={() => { setActiveTab('join'); sounds.playClick(); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'join'
                  ? 'bg-[#ffc16b] text-black font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              JOIN WITH KEY
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="mt-4">
        {status === 'connected' ? (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Multiplayer Link Active</p>
              <p className="text-xs text-gray-300 mt-0.5">
                Room Key: <span className="font-mono text-[#ffc16b] font-bold">{roomKey}</span> • You: <span className="text-white font-bold">{isHost ? 'Host' : 'Guest'}</span> • Opponent: <span className="text-emerald-300 font-bold">{opponentName}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setStatus('idle');
                setRoomKey('');
                sounds.playClick();
              }}
              className="px-3 py-1.5 rounded-lg border border-white/20 text-xs text-gray-300 hover:text-white hover:border-red-400"
            >
              Leave Room
            </button>
          </div>
        ) : activeTab === 'create' ? (
          <div className="space-y-4">
            {!roomKey ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Your Nickname (optional)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#ffc16b]/50"
                />
                <button
                  onClick={handleCreateRoom}
                  disabled={loading}
                  className="btn-cyber-primary w-full sm:w-auto px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shrink-0"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{loading ? 'Generating Key...' : 'Generate Provider Room Key'}</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-black/50 border border-[#ffc16b]/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-[#ffc16b] uppercase tracking-wider block">Your Provider Room Key:</span>
                    <div className="text-lg sm:text-2xl font-mono font-black text-white tracking-widest mt-1">
                      {roomKey}
                    </div>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#ffc16b] text-black font-bold text-xs hover:bg-[#ffe3ab] transition-all shadow-md shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'KEY COPIED!' : 'COPY ROOM KEY'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  ⚡ Give this key to another student. As soon as they enter it in &quot;Join With Key&quot;, you two will be linked in live match mode!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Paste Provider Room Key (e.g. DBUU-LUDO-1234)"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs font-mono tracking-wider focus:outline-none focus:border-[#ffc16b]/50"
            />
            <input
              type="text"
              placeholder="Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#ffc16b]/50"
            />
            <button
              onClick={handleJoinRoom}
              disabled={loading}
              className="btn-cyber-primary w-full sm:w-auto px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{loading ? 'Joining Match...' : 'Join With Key'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
