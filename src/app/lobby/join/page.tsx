// components/Join.tsx
"use client";
import { useState } from "react";
import { Client } from 'boardgame.io/client';
import { P2P } from '@boardgame.io/p2p';
import { useRouter } from 'next/navigation';
import FarkleGame from "@/app/game/game";

const Join = () => {
  const [matchID, setMatchID] = useState('');
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (!matchID) {
      setError('Please enter a match ID');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const client = Client({
        game: FarkleGame,
        matchID: matchID.toUpperCase(),
        playerID: '1',
        multiplayer: P2P(),
      });

      client.start();

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          client.stop();
          reject(new Error('Connection timeout'));
        }, 10000);

        const unsubscribe = client.subscribe((state) => {
          if (state && state.ctx) {
            clearTimeout(timeout);
            unsubscribe();
            resolve(true);
          }
        });
      });

      router.push(`/game/${matchID}?role=join`);
    } catch (err) {
      setError('Failed to connect. Please check the match ID.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Join Game</h2>

      <div className="w-full max-w-xs space-y-4">
        <div>
          <input
            type="text"
            value={matchID}
            onChange={(e) => setMatchID(e.target.value.toUpperCase())}
            placeholder="Enter Match ID"
            className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={6}
            disabled={isConnecting}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        <button
          onClick={handleJoin}
          disabled={isConnecting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? 'Connecting...' : 'Join Game'}
        </button>
      </div>
    </div>
  );
};

export default Join;