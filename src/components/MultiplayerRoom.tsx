'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check, Users, Sparkles, Key, LogIn, Wifi, AlertCircle, RefreshCw, Crown, Shield } from 'lucide-react';
import { sounds } from '@/lib/utils';

export interface MultiplayerSyncMeta {
  isHost: boolean;
  myColor: string; // for chess: 'w' | 'b'; for ludo: 'red' | 'green' | 'yellow' | 'blue'
  playerIndex: number;
  players: { id: string; name: string; color: string; isHost: boolean }[];
  maxPlayers: number;
  status: 'waiting' | 'active' | 'finished';
  lastMoveBy?: string;
  roomKey: string;
  senderId?: string;
}

export interface MultiplayerRoomProps {
  game: 'ludo' | 'chess' | 'sudoku' | 'maths';
  onRoomSync?: (roomData: any, meta: MultiplayerSyncMeta) => void;
  currentGameState?: any;
  onRegisterMoveSender?: (sender: (state: any) => Promise<void>) => void;
  onCapacityChange?: (capacity: 2 | 3 | 4) => void;
  initialCapacity?: 2 | 3 | 4;
}

const LUDO_COLOR_LABELS: Record<string, { label: string; badge: string; emoji: string }> = {
  red: { label: 'RED', badge: 'bg-red-500/20 text-red-300 border-red-500/40', emoji: '🔴' },
  green: { label: 'GREEN', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', emoji: '🟢' },
  yellow: { label: 'YELLOW', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', emoji: '🟡' },
  blue: { label: 'BLUE', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40', emoji: '🔵' },
  w: { label: 'WHITE ♔', badge: 'bg-white/20 text-white border-white/40', emoji: '♔' },
  b: { label: 'BLACK ♚', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', emoji: '♚' }
};

export default function MultiplayerRoom({ 
  game, 
  onRoomSync, 
  currentGameState, 
  onRegisterMoveSender,
  onCapacityChange,
  initialCapacity = 2
}: MultiplayerRoomProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [targetPlayers, setTargetPlayers] = useState<2 | 3 | 4>(initialCapacity);
  const [roomKey, setRoomKey] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'waiting' | 'connected'>('idle');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [myColor, setMyColor] = useState<string>(game === 'chess' ? 'w' : 'red');
  const [playerIndex, setPlayerIndex] = useState<number>(0);
  const [maxRoomPlayers, setMaxRoomPlayers] = useState<number>(game === 'ludo' ? initialCapacity : 2);
  const [playersList, setPlayersList] = useState<any[]>([]);

  // Unique client instance ID to prevent echo-loops
  const clientIdRef = useRef<string>(`client-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  const lastServerVersionRef = useRef<number>(0);
  const isPollingRef = useRef<boolean>(false);

  // Auto-fill student name from logged-in session if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('dbuu_auth_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed?.name) {
            setPlayerName(parsed.name);
          }
        } catch (e) {}
      }
    }
  }, []);

  // Sync capacity with parent on initial load or change
  useEffect(() => {
    if (game === 'ludo' && onCapacityChange) {
      onCapacityChange(targetPlayers);
    }
  }, [game, onCapacityChange, targetPlayers]);

  // Direct move sender: sends move to server IMMEDIATELY with zero hook delay
  const pushMoveInstant = useCallback(async (stateToPush: any) => {
    if (!roomKey) return;
    try {
      await fetch('/api/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          roomKey,
          gameState: stateToPush,
          moveBy: playerName || (isHost ? 'Host' : `Player ${playerIndex + 1}`),
          senderId: clientIdRef.current
        })
      });
    } catch (e) {
      // silent
    }
  }, [roomKey, playerName, isHost, playerIndex]);

  // Register pushMove with parent on mount/change
  useEffect(() => {
    if (onRegisterMoveSender) {
      onRegisterMoveSender(pushMoveInstant);
    }
  }, [onRegisterMoveSender, pushMoveInstant]);

  // Fast 250ms polling loop with delta-version check for instant responsiveness
  useEffect(() => {
    if (!roomKey || status === 'idle') return;

    let isMounted = true;

    const poll = async () => {
      if (isPollingRef.current) return;
      isPollingRef.current = true;

      try {
        const url = `/api/multiplayer?roomKey=${encodeURIComponent(roomKey)}&v=${lastServerVersionRef.current}`;
        const res = await fetch(url);
        const data = await res.json();

        if (isMounted && res.ok && data.success) {
          if (data.changed === false) {
            isPollingRef.current = false;
            return;
          }

          if (data.room) {
            const room = data.room;
            lastServerVersionRef.current = room.version || lastServerVersionRef.current + 1;
            setPlayersList(room.players || []);
            if (room.maxPlayers) {
              const parsedMax = Number(room.maxPlayers) as (2 | 3 | 4);
              setMaxRoomPlayers(parsedMax);
              setTargetPlayers(parsedMax);
              if (onCapacityChange) onCapacityChange(parsedMax);
            }

            // As soon as at least 2 players are present, status is connected!
            if (room.status === 'active' || (room.players && room.players.length >= 2)) {
              setStatus('connected');
            }

            // ONLY apply incoming sync if it originated from a different client!
            if (room.senderId !== clientIdRef.current) {
              if (onRoomSync && room.gameState) {
                onRoomSync(room.gameState, {
                  isHost,
                  myColor,
                  playerIndex,
                  players: room.players || [],
                  maxPlayers: room.maxPlayers || maxRoomPlayers,
                  status: room.status,
                  lastMoveBy: room.lastMoveBy,
                  roomKey,
                  senderId: room.senderId
                });
              }
            }
          }
        }
      } catch (err) {
        // silent
      } finally {
        isPollingRef.current = false;
      }
    };

    const interval = setInterval(poll, 250);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [roomKey, status, isHost, myColor, playerIndex, maxRoomPlayers, onRoomSync]);

  // Create Room
  const handleCreateRoom = async () => {
    setError('');
    setLoading(true);
    sounds.playClick();

    const nameToUse = playerName.trim() || 'Host Student';

    try {
      const res = await fetch('/api/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          game,
          hostName: nameToUse,
          maxPlayers: game === 'ludo' ? targetPlayers : 2,
          initialState: currentGameState || {}
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create room key');
        setLoading(false);
        return;
      }

      const assignedMax = (data.maxPlayers || (game === 'ludo' ? targetPlayers : 2)) as (2 | 3 | 4);
      setRoomKey(data.roomKey);
      setIsHost(true);
      setMyColor(data.assignedColor || (game === 'chess' ? 'w' : 'red'));
      setPlayerIndex(0);
      setMaxRoomPlayers(assignedMax);
      setPlayersList(data.room?.players || []);
      lastServerVersionRef.current = data.version || 1;
      setStatus('waiting');
      if (onCapacityChange) onCapacityChange(assignedMax);
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

    const nameToUse = playerName.trim() || 'Challenger Student';

    try {
      const res = await fetch('/api/multiplayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          roomKey: inputKey.trim().toUpperCase(),
          guestName: nameToUse
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Room not found or expired');
        setLoading(false);
        return;
      }

      const joinedMax = (data.maxPlayers || 2) as (2 | 3 | 4);
      setRoomKey(data.roomKey);
      setIsHost(data.isHost || false);
      setMyColor(data.assignedColor || 'b');
      setPlayerIndex(data.playerIndex || 1);
      setMaxRoomPlayers(joinedMax);
      setTargetPlayers(joinedMax);
      setPlayersList(data.room?.players || []);
      lastServerVersionRef.current = data.version || 1;
      setStatus('connected');
      if (onCapacityChange) onCapacityChange(joinedMax);
      setLoading(false);

      if (onRoomSync && data.room.gameState) {
        onRoomSync(data.room.gameState, {
          isHost: data.isHost || false,
          myColor: data.assignedColor || 'b',
          playerIndex: data.playerIndex || 1,
          players: data.room.players || [],
          maxPlayers: data.room.maxPlayers || 2,
          status: data.room.status,
          lastMoveBy: data.room.lastMoveBy,
          roomKey: data.roomKey
        });
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

  const handleLeaveRoom = () => {
    setStatus('idle');
    setRoomKey('');
    setPlayersList([]);
    lastServerVersionRef.current = 0;
    sounds.playClick();
  };

  const colorInfo = LUDO_COLOR_LABELS[myColor] || { label: myColor.toUpperCase(), badge: '', emoji: '🎮' };
  const displayCapacity = (status === 'connected' || status === 'waiting') ? maxRoomPlayers : targetPlayers;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-5 border border-[#ffc16b]/30 shadow-[0_0_25px_rgba(255,193,107,0.12)] mb-6 min-w-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#ffc16b]/15 text-[#ffc16b] border border-[#ffc16b]/30">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Multiplayer Arena</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                {game === 'ludo' ? `${displayCapacity} PLAYERS CAPACITY` : 'INSTANT 1v1'}
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400">
              {game === 'ludo' 
                ? `Choose 2, 3 or 4 players capacity. Game starts immediately once connected!` 
                : 'Host creates a key, opponent joins. Real-time instant turns.'}
            </p>
          </div>
        </div>

        {status === 'connected' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
            <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>LIVE • {playersList.length}/{maxRoomPlayers} PLAYERS</span>
          </div>
        ) : status === 'waiting' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>WAITING FOR PLAYERS (1/{maxRoomPlayers})...</span>
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
        <div className="mt-3 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="mt-3">
        {status === 'connected' ? (
          <div className="space-y-3">
            <div className="p-3 sm:p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    Room Key:
                  </span>
                  <span className="font-mono text-sm font-black text-white px-2 py-0.5 rounded bg-black/40 border border-white/10">
                    {roomKey}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1 text-gray-400 hover:text-white"
                    title="Copy Key"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    Capacity: {maxRoomPlayers} Players
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Your Assigned Slot:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold border text-[11px] font-mono ${colorInfo.badge}`}>
                    {colorInfo.emoji} {colorInfo.label} ({isHost ? 'Host' : `Player ${playerIndex + 1}`})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleLeaveRoom}
                  className="px-3 py-1.5 rounded-lg border border-white/20 text-xs text-gray-300 hover:text-white hover:border-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Leave Room
                </button>
              </div>
            </div>

            {/* Players Roster */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                  Connected Players ({playersList.length}/{maxRoomPlayers}):
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  ✓ Strict turns only between joined players ({maxRoomPlayers}P match)
                </span>
              </div>

              <div className={`grid grid-cols-2 ${maxRoomPlayers === 3 ? 'sm:grid-cols-3' : maxRoomPlayers === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-2'} gap-2`}>
                {playersList.map((p, idx) => {
                  const pColorInfo = LUDO_COLOR_LABELS[p.color] || { label: p.color, emoji: '🎮', badge: '' };
                  const isMe = idx === playerIndex;

                  return (
                    <div 
                      key={p.id || idx}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-mono ${
                        isMe 
                          ? 'bg-[#ffc16b]/15 border-[#ffc16b]/60 shadow-[0_0_12px_rgba(255,193,107,0.2)]' 
                          : 'bg-black/40 border-white/10'
                      }`}
                    >
                      <span className="text-base">{pColorInfo.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-white truncate flex items-center gap-1">
                          {p.name}
                          {p.isHost && <Crown className="w-3 h-3 text-amber-400" />}
                        </div>
                        <span className="text-[10px] text-gray-400 block truncate">
                          {pColorInfo.label} {isMe ? '(You)' : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Empty slots ONLY up to maxRoomPlayers */}
                {Array.from({ length: Math.max(0, maxRoomPlayers - playersList.length) }).map((_, emptyIdx) => {
                  const slotIdx = playersList.length + emptyIdx;
                  const slotColor = ['red', 'green', 'yellow', 'blue'][slotIdx];
                  const emptyInfo = LUDO_COLOR_LABELS[slotColor];
                  return (
                    <div
                      key={`empty-${emptyIdx}`}
                      className="p-2.5 rounded-xl border border-dashed border-white/10 bg-black/20 flex items-center gap-2 text-xs font-mono opacity-40"
                    >
                      <span className="text-base grayscale">{emptyInfo?.emoji}</span>
                      <div className="text-[10px] text-gray-500">
                        Slot {slotIdx + 1} ({emptyInfo?.label}) Waiting...
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeTab === 'create' ? (
          <div className="space-y-3">
            {/* Player Capacity Selector for Ludo */}
            {game === 'ludo' && !roomKey && (
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1.5">
                <span className="text-[11px] font-mono text-[#ffc16b] uppercase tracking-wider block font-bold">
                  Choose Match Player Capacity:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {([2, 3, 4] as const).map(count => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        setTargetPlayers(count);
                        setMaxRoomPlayers(count);
                        if (onCapacityChange) onCapacityChange(count);
                        sounds.playClick();
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold font-mono transition-all flex flex-col items-center justify-center gap-0.5 ${
                        targetPlayers === count
                          ? 'bg-[#ffc16b] text-black font-extrabold shadow-sm'
                          : 'bg-black/50 text-gray-300 hover:text-white border border-white/10'
                      }`}
                    >
                      <span>{count} Players</span>
                      <span className="text-[9px] opacity-80">
                        {count === 2 ? 'Red & Green' : count === 3 ? 'Red, Green, Yellow' : 'All 4 Colors'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!roomKey ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Your Name / Nickname"
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
                  <span>{loading ? 'Creating Room...' : `Create ${game === 'ludo' ? `${targetPlayers}-Player ` : ''}Room Key`}</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-black/50 border border-[#ffc16b]/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-[#ffc16b] uppercase tracking-wider block">
                      Your Provider Room Key ({maxRoomPlayers} Players Max):
                    </span>
                    <div className="text-xl sm:text-2xl font-mono font-black text-white tracking-widest mt-1">
                      {roomKey}
                    </div>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#ffc16b] text-black font-bold text-xs hover:bg-[#ffe3ab] transition-all shadow-md shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'COPIED!' : 'COPY ROOM KEY'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  ⚡ Give this room key to {maxRoomPlayers - 1} friend{maxRoomPlayers > 2 ? 's' : ''}. Only {maxRoomPlayers} players total can access this room. Once connected, turns flow constantly!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder={`Paste Room Key (e.g. DBUU-${game.toUpperCase().slice(0, 4)}-1234)`}
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
              <span>{loading ? 'Connecting...' : 'Join With Key'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
