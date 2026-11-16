import { NextResponse } from 'next/server';

interface Room {
  roomKey: string;
  game: 'ludo' | 'chess' | 'sudoku' | 'maths';
  hostName: string;
  guestName?: string;
  gameState: any;
  lastMoveBy?: string;
  updatedAt: number;
  status: 'waiting' | 'active' | 'finished';
}

// In-memory room cache
const rooms: Map<string, Room> = new Map();

// Helper to generate a friendly room key
function generateRoomKey(game: string): string {
  const prefix = game.toUpperCase().slice(0, 5);
  const code = Math.floor(1000 + Math.random() * 9000);
  return `DBUU-${prefix}-${code}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomKey = searchParams.get('roomKey');

  if (!roomKey) {
    return NextResponse.json({ error: 'roomKey parameter required' }, { status: 400 });
  }

  const room = rooms.get(roomKey.toUpperCase().trim());
  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, room });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // 1. CREATE ROOM
    if (action === 'create') {
      const { game = 'ludo', hostName = 'Host Player', initialState } = body;
      const roomKey = generateRoomKey(game);
      
      const newRoom: Room = {
        roomKey,
        game,
        hostName: hostName.trim() || 'Host Player',
        gameState: initialState || null,
        status: 'waiting',
        updatedAt: Date.now()
      };

      rooms.set(roomKey, newRoom);
      return NextResponse.json({ success: true, roomKey, room: newRoom });
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

      room.guestName = guestName.trim() || 'Challenger';
      room.status = 'active';
      room.updatedAt = Date.now();

      return NextResponse.json({ success: true, roomKey: key, room });
    }

    // 3. UPDATE GAME STATE / SYNC MOVE
    if (action === 'update') {
      const { roomKey, gameState, moveBy } = body;
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
      room.updatedAt = Date.now();

      return NextResponse.json({ success: true, room });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
