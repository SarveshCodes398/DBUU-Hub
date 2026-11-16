import { NextResponse } from 'next/server';

export interface RoomPlayer {
  id: string;
  name: string;
  color: string; // for chess: 'w' | 'b'; for ludo: 'red' | 'green' | 'yellow' | 'blue'
  isHost: boolean;
  joinedAt: number;
}

export interface Room {
  roomKey: string;
  game: 'ludo' | 'chess' | 'sudoku' | 'maths';
  hostName: string;
  guestName?: string;
  players: RoomPlayer[];
  maxPlayers: number;
  gameState: any;
  lastMoveBy?: string;
  senderId?: string;
  version: number;
  updatedAt: number;
  status: 'waiting' | 'active' | 'finished';
}

// In-memory room store in global scope so hot-reload doesn't wipe active rooms
const globalRooms = (global as any).__dbuu_multiplayer_rooms || new Map<string, Room>();
(global as any).__dbuu_multiplayer_rooms = globalRooms;

const rooms: Map<string, Room> = globalRooms;

function generateRoomKey(game: string): string {
  const prefix = game.toUpperCase().slice(0, 5);
  const code = Math.floor(1000 + Math.random() * 9000);
  return `DBUU-${prefix}-${code}`;
}

const LUDO_COLORS = ['red', 'green', 'yellow', 'blue'];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomKey = searchParams.get('roomKey');
  const clientVersion = searchParams.get('v');

  if (!roomKey) {
    return NextResponse.json({ error: 'roomKey parameter required' }, { status: 400 });
  }

  const room = rooms.get(roomKey.toUpperCase().trim());
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  // Fast delta check: If client version matches current room version, return lightweight response
  if (clientVersion && Number(clientVersion) === room.version) {
    return NextResponse.json({ 
      success: true, 
      changed: false, 
      version: room.version,
      playerCount: room.players.length 
    });
  }

  return NextResponse.json({ 
    success: true, 
    changed: true, 
    room, 
    version: room.version 
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. CREATE ROOM
    if (action === 'create') {
      const { 
        game = 'ludo', 
        hostName = 'Host Player', 
        initialState,
        maxPlayers: requestedMax
      } = body;

      const roomKey = generateRoomKey(game);
      // Support explicit capacity: 2, 3, or 4 players for Ludo!
      const maxPlayers = game === 'ludo' 
        ? (Number(requestedMax) === 2 || Number(requestedMax) === 3 || Number(requestedMax) === 4 ? Number(requestedMax) : 4)
        : 2;
      const hostColor = game === 'chess' ? 'w' : 'red';
      
      const hostPlayer: RoomPlayer = {
        id: `p-host-${Date.now()}`,
        name: hostName.trim() || 'Host Player',
        color: hostColor,
        isHost: true,
        joinedAt: Date.now()
      };

      const newRoom: Room = {
        roomKey,
        game,
        hostName: hostPlayer.name,
        players: [hostPlayer],
        maxPlayers,
        gameState: { ...(initialState || {}), maxPlayers },
        status: 'waiting',
        version: 1,
        updatedAt: Date.now()
      };

      rooms.set(roomKey, newRoom);
      return NextResponse.json({ 
        success: true, 
        roomKey, 
        room: newRoom,
        assignedColor: hostColor,
        playerIndex: 0,
        isHost: true,
        maxPlayers,
        version: 1
      });
    }

    // 2. JOIN ROOM
    if (action === 'join') {
      const { roomKey, guestName = 'Challenger' } = body;
      if (!roomKey) {
        return NextResponse.json({ error: 'Room key is required' }, { status: 400 });
      }

      const key = roomKey.toUpperCase().trim();
      const room = rooms.get(key);

      if (!room) {
        return NextResponse.json({ error: 'Room not found. Check the key and try again.' }, { status: 404 });
      }

      const trimmedName = guestName.trim() || 'Challenger';
      const existingPlayerIndex = room.players.findIndex(p => p.name.toLowerCase() === trimmedName.toLowerCase());
      
      let assignedPlayer: RoomPlayer;
      let playerIndex: number;

      if (existingPlayerIndex >= 0) {
        assignedPlayer = room.players[existingPlayerIndex];
        playerIndex = existingPlayerIndex;
      } else {
        if (room.players.length >= room.maxPlayers) {
          return NextResponse.json({ 
            error: `Room is full for this match (Capacity: ${room.maxPlayers} players already joined)` 
          }, { status: 403 });
        }

        playerIndex = room.players.length;
        let assignedColor = 'b';
        if (room.game === 'ludo') {
          assignedColor = LUDO_COLORS[playerIndex] || 'green';
        } else if (room.game === 'chess') {
          assignedColor = 'b';
        }

        assignedPlayer = {
          id: `p-join-${Date.now()}-${playerIndex}`,
          name: trimmedName,
          color: assignedColor,
          isHost: false,
          joinedAt: Date.now()
        };

        room.players.push(assignedPlayer);
        room.guestName = assignedPlayer.name;
        // Game is active as soon as 2 or more players join!
        room.status = 'active';
        room.version = (room.version || 1) + 1;
        room.updatedAt = Date.now();
      }

      return NextResponse.json({ 
        success: true, 
        roomKey: key, 
        room,
        assignedColor: assignedPlayer.color,
        playerIndex,
        isHost: assignedPlayer.isHost,
        maxPlayers: room.maxPlayers,
        version: room.version
      });
    }

    // 3. UPDATE GAME STATE / INSTANT MOVE BROADCAST
    if (action === 'update') {
      const { roomKey, gameState, moveBy, senderId } = body;
      if (!roomKey) {
        return NextResponse.json({ error: 'Room key is required' }, { status: 400 });
      }

      const key = roomKey.toUpperCase().trim();
      const room = rooms.get(key);

      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }

      room.gameState = gameState;
      room.lastMoveBy = moveBy;
      room.senderId = senderId;
      room.version = (room.version || 1) + 1;
      room.updatedAt = Date.now();

      return NextResponse.json({ success: true, version: room.version });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
