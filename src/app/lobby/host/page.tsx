// components/Host.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Room, RoomEvent } from 'livekit-client';
import { nanoid } from "nanoid";

const Host = () => {
  const [matchID, setMatchID] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const router = useRouter();

  useEffect(() => {
    const generatedMatchID = nanoid(6).toUpperCase();
    setMatchID(generatedMatchID);

    const connectToRoom = async () => {
      try {
        // Get token from your API
        const response = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            roomName: generatedMatchID,
            participantName: 'host'
          })
        });
        const { token } = await response.json();

        const room = new Room();
        console.log(process.env.NEXT_PUBLIC_LIVEKIT_URL)
        await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, token);
        
        room.on(RoomEvent.ParticipantConnected, () => {
          if (room.numParticipants === 1) {
            router.push(`/game/${generatedMatchID}?role=host`);
          }
        });

        setRoom(room);
      } catch (error) {
        console.error('Failed to connect to room:', error);
      }
    };

    connectToRoom();

    return () => {
      room?.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 h-screen w-screen bg-gray-900">
      <h2 className="text-lg font-semibold text-white mb-2">Your Match ID</h2>
      <div className="bg-gray-700 px-6 py-3 rounded-lg">
        <p className="font-mono text-xl font-bold tracking-wide text-gray-200">{matchID}</p>
      </div>
      <p className="mt-4 text-sm text-gray-400">Waiting for player to join...</p>
    </div>
  );
};

export default Host;
