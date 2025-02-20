// app/game/[matchId]/page.tsx
'use client';
import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Client } from 'boardgame.io/react';
import FarkleGame from "@/app/game/game";
import Board from '@/app/components/board';

const GamePage = ({ params }) => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const resolvedParams = use(params);
  const matchId = resolvedParams.matchId;
  const playerID = role === 'host' ? '0' : '1';

  const GameClient = Client({
    game: FarkleGame,
    board: Board,
    debug: true,
    matchID: matchId,
  });

  return <GameClient playerID={playerID}/>;
};

export default GamePage;
