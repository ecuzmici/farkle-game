"use client";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { Client } from 'boardgame.io/client';
import { P2P, generateCredentials } from '@boardgame.io/p2p';
import { useRouter } from 'next/navigation';
import FarkleGame from "@/app/game/game";

const Host = () => {
  const [matchID, setMatchID] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const generatedMatchID = nanoid(6).toUpperCase();
    setMatchID(generatedMatchID);
    
    // Generate unique credentials for this session
    const credentials = generateCredentials();

    const client = Client({
      game: FarkleGame,
      matchID: generatedMatchID,
      playerID: '0',
      credentials,
      multiplayer: P2P({ 
        isHost: true,
        peerOptions: {
          debug: 3,
          host: 'localhost',
          port: 9000,
          path: '/myapp',
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' }
            ]
          }
        }
      }),
    });

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;

    const handleDisconnect = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        setTimeout(() => {
          client.start();
        }, 1000 * reconnectAttempts);
      }
    };

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
        {isConnecting ? "Setting up game..." : "Waiting for player to join..."}
      </p>
    </div>
  );
};

export default Host;
