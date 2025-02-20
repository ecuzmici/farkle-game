"use client";
import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const Host = () => {
  const [matchID, setMatchID] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const createMatch = async () => {
      try {
        const generatedMatchID = nanoid(6).toUpperCase();
        setMatchID(generatedMatchID);

        // Redirect to game page as host
        router.push(`/game/${generatedMatchID}?role=host`);
      } catch (err) {
        console.error('Failed to create match:', err);
        setError('Failed to create game room');
      }
    };

    createMatch();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center p-6 h-screen w-screen bg-gray-900">
      <h2 className="text-lg font-semibold text-white mb-2">Creating Match...</h2>
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default Host;
