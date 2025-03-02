"use client";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Client } from 'boardgame.io/client';
import { P2P } from '@boardgame.io/p2p';
import FarkleGame from "@/app/game/game";

const Host = () => {
  const [matchID, setMatchID] = useState('');
  const [error, setError] = useState('');
  const [isWaiting, setIsWaiting] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const generatedMatchID = nanoid(6).toUpperCase();
    setMatchID(generatedMatchID);

    const hostClient = Client({
      game: FarkleGame,
      matchID: generatedMatchID,
      playerID: '0',
      multiplayer: P2P({ isHost: true })
    });

    hostClient.start();

    hostClient.transport.peer.on('open', () => {
      console.log('Host connection open');
    });

    hostClient.transport.peer.on('connection', (conn) => {
      conn.on('open', () => {
        console.log(`Player ${conn.peer} connected!`);
        setIsWaiting(false);
        router.push(`/game/${generatedMatchID}?role=host`);
      });
    });

    hostClient.transport.peer.on('error', (err) => {
      console.error("PeerJS Error:", err);
      setError("Failed to establish P2P connection.");
    });
  }, [router]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(matchID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col items-center justify-center p-8">
      <div className="p-8 rounded-lg shadow-md bg-gray-800 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-6">
          {isWaiting ? "Waiting for Players..." : "Player Connected!"}
        </h2>
        <p className="text-gray-400 mb-4">
          Share this Match ID with your opponent:
        </p>
        <div 
          className="bg-gray-700 text-white px-6 py-3 rounded-lg text-2xl font-mono mb-2 cursor-pointer hover:bg-gray-600 transition-colors"
          onClick={copyToClipboard}
        >
          {matchID || "Generating..."}
        </div>
        {copied && <p className="text-green-400 text-sm mb-4">Copied to clipboard!</p>}
        <p className="text-gray-400 text-sm mb-6">(Click to copy)</p>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Host;
