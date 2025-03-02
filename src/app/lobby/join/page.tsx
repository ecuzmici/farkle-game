"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Client } from 'boardgame.io/client';
import { P2P } from '@boardgame.io/p2p';
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
      const joinerClient = Client({
        game: FarkleGame,
        matchID: matchID,
        playerID: '1',
        multiplayer: P2P({ isHost: false }),
      });

      joinerClient.start();

      router.push(`/game/${matchID}?role=join`);
    } catch (err) {
      console.error('Failed to join match:', err);
      setError('Failed to join game. Please check the match ID.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col items-center justify-center p-8">
      <div className="p-8 rounded-lg shadow-md bg-gray-800 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Join Game</h2>

        <div className="space-y-6">
          <div>
            <input
              type="text"
              value={matchID}
              onChange={(e) => setMatchID(e.target.value.toUpperCase())}
              placeholder="Enter Match ID"
              className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={6}
              disabled={isConnecting}
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <button
            onClick={handleJoin}
            disabled={isConnecting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : 'Join Game'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join;
