// components/Host.tsx (updated)
"use client";

import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { Client } from 'boardgame.io/client';
import { P2P } from '@boardgame.io/p2p';
import { useRouter } from 'next/navigation';
import FarkleGame from "@/app/game/game";

const Host = () => {
  const [matchID, setMatchID] = useState('');
  const router = useRouter();

  useEffect(() => {
    const generatedMatchID = nanoid(6).toUpperCase();
    setMatchID(generatedMatchID);

    const newClient = Client({
      game: FarkleGame,
      matchID: generatedMatchID,
      playerID: '0',
      multiplayer: P2P({ 
        isHost: true,
        onError: (error) => console.error('P2P Error:', error)
      }),
    });

    newClient.start();
    
    // Subscribe to peer connection events
    const unsubscribe = newClient.subscribe((state) => {
      console.log(state);
      // Check for actual peer connection, not just state initialization
      if (state && state._stateID > 1) {
        unsubscribe();
        router.push(`/game/${generatedMatchID}?role=host`);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!matchID) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 h-screen w-screen">
      <h2 className="text-lg font-semibold text-white mb-2">Your Match ID</h2>
      <div className="bg-gray-700 dark:bg-gray-800 px-6 py-3 rounded-lg">
        <p className="font-mono text-xl font-bold tracking-wide text-gray-200">{matchID}</p>
      </div>
      <p className="mt-4 text-sm text-gray-400">Waiting for player to join...</p>
    </div>
  );
};

export default Host;