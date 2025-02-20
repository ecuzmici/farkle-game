// components/Host.tsx
"use client";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { Client } from 'boardgame.io/client';
import { P2P } from '@boardgame.io/p2p';
import { useRouter } from 'next/navigation';
import FarkleGame from "@/app/game/game";

const Host = () => {
  const [matchID, setMatchID] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const generatedMatchID = nanoid(6).toUpperCase();
    setMatchID(generatedMatchID);

    const client = Client({
      game: FarkleGame,
      matchID: generatedMatchID,
      playerID: '0',
      multiplayer: P2P({ 
        isHost: true,
        onError: (error) => console.error('P2P Error:', error)
      }),
    });

    client.start();
    
    const unsubscribe = client.subscribe((state) => {
      if (state && state.ctx && state.ctx.numPlayers === 2) {
        setIsConnecting(false);
        router.push(`/game/${generatedMatchID}?role=host`);
      }
    });

    return () => {
      unsubscribe();
      client.stop();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 h-screen w-screen bg-gray-900">
      <h2 className="text-lg font-semibold text-white mb-2">Your Match ID</h2>
      <div className="bg-gray-700 px-6 py-3 rounded-lg">
        <p className="font-mono text-xl font-bold tracking-wide text-gray-200">{matchID}</p>
      </div>
      <p className="mt-4 text-sm text-gray-400">
        {isConnecting ? "Waiting for player to join..." : "Player connected!"}
      </p>
    </div>
  );
};

export default Host;