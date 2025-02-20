'use client';
import { useSearchParams } from 'next/navigation';
import { Client } from 'boardgame.io/react';
import { P2P } from '@boardgame.io/p2p';
import FarkleGame from "@/app/game/game";
import Board from '@/app/components/board';
import { use } from 'react';

const GamePage = ({ params }) => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const resolvedParams = use(params);
  const matchId = resolvedParams.matchId;
  const playerID = role === 'host' ? '0' : '1';

  // Configure P2P transport
  const multiplayerConfig = P2P({
    isHost: role === 'host', // Host mode if role is "host"
  });

  const GameClient = Client({
    game: FarkleGame,
    board: Board,
    debug: true,
    multiplayer: multiplayerConfig,
    matchID: matchId,
  });

  return <GameClient playerID={playerID} />;
};

export default GamePage;
