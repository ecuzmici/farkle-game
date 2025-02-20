"use client";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { Room, RoomEvent } from 'livekit-client';
import { useRouter } from 'next/navigation';

const Host = () => {
  const [matchID, setMatchID] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const generatedMatchID = nanoid(6).toUpperCase();
        setMatchID(generatedMatchID);

        const response = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            roomName: generatedMatchID,
            participantName: `host-${generatedMatchID}`
          })
        });

        const { token } = await response.json();
        if (!token) throw new Error('Failed to get token');

        const room = new Room();
        
        room.on(RoomEvent.Connected, () => {
          console.log('Host connected to room');
        });

        room.on(RoomEvent.ParticipantConnected, () => {
          console.log('Participant joined, redirecting...');
          router.push(`/game/${generatedMatchID}?role=host`);
        });

        await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token, {
          autoSubscribe: true
        });

        return () => {
          room.disconnect();
        };
      } catch (err) {
        console.error('Failed to connect:', err);
        setError('Failed to create game room');
      }
    };

    connectToRoom();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center p-6 h-screen w-screen bg-gray-900">
      <h2 className="text-lg font-semibold text-white mb-2">Your Match ID</h2>
      <div className="bg-gray-700 px-6 py-3 rounded-lg">
        <p className="font-mono text-xl font-bold tracking-wide text-gray-200">{matchID}</p>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      ) : (
        <p className="mt-4 text-sm text-gray-400">Waiting for player to join...</p>
      )}
    </div>
  );
};

export default Host;
