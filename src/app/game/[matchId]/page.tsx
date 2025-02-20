// app/game/[matchId]/page.tsx
"use client";
import React, { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Client } from 'boardgame.io/react';
import { P2P } from '@boardgame.io/p2p';
import FarkleGame from "@/app/game/game";
import Board from '@/app/components/board';

const GamePage = ({ params }) => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const playerID = role === 'host' ? '0' : '1';
  const resolvedParams = use(params);
  const matchID = resolvedParams.matchId;
  
  const GameClient = Client({
    game: FarkleGame,
    board: Board,
    matchID,
    playerID,
    multiplayer: P2P({ isHost: role === 'host' }),
    debug: true
  });

  return <GameClient />;
};

export default GamePage;